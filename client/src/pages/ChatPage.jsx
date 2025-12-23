import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { io } from 'socket.io-client';
import AuthContext from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Send, Paperclip, Video, File, X, MoreVertical, Phone, Video as VideoIcon, Image as ImageIcon, User } from 'lucide-react';
import SpotlightCard from '../components/SpotlightCard';
import VideoCallModal from '../components/VideoCallModal';

import { API_URL, SOCKET_URL, BASE_URL } from '../config';

// Endpoint handled in Context now
// const ENDPOINT = SOCKET_URL;

const ChatPage = () => {
  const { userId } = useParams();
  const { user } = useContext(AuthContext);
  const { socket, onlineUsers } = useSocket();
  const navigate = useNavigate();
  
  // Chat State
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const isRecipientOnline = onlineUsers?.includes(userId);

  // Video Call State
  const [stream, setStream] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // WebRTC Refs
  const myVideo = useRef();
  const userVideo = useRef();
  const peerConnectionRef = useRef();
  const iceCandidatesQueue = useRef([]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages]);

  useEffect(() => {
    // 1. Fetch Recipient & Messages
    const fetchData = async () => {
      try {
        // Try fetching as generic user first (covers both customers and experts)
        let res = await axios.get(`/auth/user/${userId}`).catch(() => ({ data: { name: 'User', _id: userId } }));
        setRecipient(res.data);
        const { data } = await axios.get(`/messages/${userId}`);
        setMessages(data);
      } catch (err) { console.error(err); }
    };
    if (userId) fetchData();

    // 2. Socket Listeners
    if (!socket) return;
    
    // Message Listener
    // Note: We need a named function to remove it on cleanup to avoid duplicates if re-renders happen
    const handleReceiveMessage = (message) => {
       if (message.sender === userId || message.recipient === userId) {
          setMessages((prev) => [...prev, message]);
       }
    };

    socket.on('receive_message', handleReceiveMessage);

    // --- WebRTC Signaling Listeners ---
    socket.on('callUser', ({ from, name: callerName, signal, callType }) => {
       setIncomingCall({ isReceivingCall: true, from, name: callerName, signal, callType });
       setCallActive(true); 
    });

    socket.on('callAccepted', async (signal) => {
        setCallAccepted(true);
        if (peerConnectionRef.current) {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal));
            // Process any queued candidates now that remote description is set
            if (peerConnectionRef.current.processQueue) {
                await peerConnectionRef.current.processQueue();
            }
        }
    });

    socket.on('callEnded', () => {
        leaveCall(false); // don't emit endCall again
    });

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('callUser');
      socket.off('callAccepted');
      socket.off('callEnded');
      if(stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [userId, user._id, socket]);

  // --- WebRTC Implementation (Native) ---
  const [iceServers, setIceServers] = useState([
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' }
  ]);

  useEffect(() => {
    const fetchIceServers = async () => {
      try {
        const { data } = await axios.get('/turn/credentials');
        if (data && Array.isArray(data)) {
            console.log("✅ Using Metered.ca TURN Servers (Standard):", data);
            setIceServers(data);
        }
      } catch (error) {
        console.warn("Using default STUN servers (TURN fetch failed)");
      }
    };
    fetchIceServers();
  }, []);

  const [remoteStream, setRemoteStream] = useState(null);

  const initializePeerConnection = async () => {
      const pc = new RTCPeerConnection({ 
          iceServers,
          bundlePolicy: 'max-bundle',
          // No aggressive pooling or forced policies - let the browser decide
      });
      peerConnectionRef.current = pc;

      pc.onicecandidateerror = (event) => {
          console.error("⚠️ ICE Candidate Error:", event.errorCode, event.errorText, event.url);
      };

      pc.onicecandidate = (event) => {
          if (event.candidate) {
              socket.emit('iceCandidate', { 
                 to: incomingCall ? incomingCall.from : userId, 
                 candidate: event.candidate 
             });
          }
      };

      pc.ontrack = (event) => {
          // Store stream in state so we can pass it to the UI cleanly
          setRemoteStream(event.streams[0]);
      };

      pc.onconnectionstatechange = () => {
          console.log("🚀 Connection State:", pc.connectionState);
      };
      
      pc.oniceconnectionstatechange = () => {
          console.log("🧊 ICE Connection State:", pc.iceConnectionState);
      };

      // Handle ICE candidates from remote
      const handleBeforeIce = async (candidate) => {
          try {
              if (pc.signalingState !== 'closed' && pc.remoteDescription) {
                   await pc.addIceCandidate(new RTCIceCandidate(candidate));
              } else if (!pc.remoteDescription && candidate) {
                   console.log("🧊 Queuing ICE candidate (waiting for remote description)");
                   iceCandidatesQueue.current.push(candidate);
              }
          } catch(e) { console.error("Error adding ice candidate", e); }
      };
      
      // Allow processing of queued candidates
      peerConnectionRef.current.processQueue = async () => {
          while (iceCandidatesQueue.current.length > 0) {
              const candidate = iceCandidatesQueue.current.shift();
              try {
                  console.log("🧊 Processing queued ICE candidate");
                  await pc.addIceCandidate(new RTCIceCandidate(candidate));
              } catch (e) { console.error("Error processing queued candidate", e); }
          }
      };

      // Remove any existing listener to avoid duplicates
      socket.off('iceCandidate');
      socket.on('iceCandidate', handleBeforeIce);

      return pc;
  };

  const startLocalStream = async (isVideo = true) => {
      try {
          const constraints = { video: isVideo, audio: true };
          const currentStream = await navigator.mediaDevices.getUserMedia(constraints);
          setStream(currentStream);
          setVideoOn(isVideo); // Sync UI state
          if (myVideo.current) myVideo.current.srcObject = currentStream;
          return currentStream;
      } catch (err) {
          console.error("Failed to get stream", err);
          // Auto-fallback for video calls on failure
          if (isVideo) {
               try {
                  const audioStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
                  setStream(audioStream);
                  setVideoOn(false);
                  return audioStream;
               } catch(e) { console.error(e); }
          }
          alert("Could not access camera/microphone.");
          return null;
      }
  };

  const initiateCall = async (isVideo = true) => {
      console.log("Initiating call type:", isVideo ? "video" : "audio");
      setCallActive(true);
      setCallEnded(false);
      
      const localStream = await startLocalStream(isVideo);
      if(!localStream) return;

      const pc = await initializePeerConnection();
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit('callUser', {
          userToCall: userId,
          signalData: offer,
          from: user._id,
          name: user.name,
          callType: isVideo ? 'video' : 'audio'
      });
  };

  const answerCall = async () => {
      const isVideoCall = incomingCall.callType === 'video';
      console.log("Answering call type:", incomingCall.callType);
      
      setCallAccepted(true);
      const localStream = await startLocalStream(isVideoCall);
      if(!localStream) return;

      const pc = await initializePeerConnection();
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

      await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.signal));
      
      // Process queued candidates
      if (pc.processQueue) {
          await pc.processQueue();
      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit('answerCall', {
          signal: answer,
          to: incomingCall.from
      });
  };

  const leaveCall = (emitEvent = true) => {
      setCallEnded(true);
      setCallActive(false);
      setCallAccepted(false);
      setIncomingCall(null);
      
      if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
      }
      
      if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
      }

      if (emitEvent) {
          socket.emit('endCall', { to: incomingCall ? incomingCall.from : userId });
      }
  };

  const toggleMic = () => {
      if(stream) {
          const audioTracks = stream.getAudioTracks();
          if (audioTracks.length > 0) {
              audioTracks[0].enabled = !micOn;
              setMicOn(!micOn);
          }
      }
  };

  const toggleVideo = () => {
      if(stream) {
          const videoTracks = stream.getVideoTracks();
          if (videoTracks.length > 0) {
              videoTracks[0].enabled = !videoOn;
              setVideoOn(!videoOn);
          }
      }
  };

    // Helper to force download from Cloudinary
  const getDownloadUrl = (url) => {
      if (!url) return '';
      // Use our backend proxy to force download
      return `${API_URL}/messages/download?url=${encodeURIComponent(url.startsWith('http') ? url : `${BASE_URL}${url}`)}`;
  };

  // --- Existing Chat Logic ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile)) return;

    let fileUrl = null;
    let messageType = 'text';

    if (selectedFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
            const uploadRes = await axios.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fileUrl = uploadRes.data.fileUrl;
            messageType = 'file';
        } catch (error) { setUploading(false); return; }
        setUploading(false);
    }

    const messageData = {
      sender: user._id,
      recipient: userId,
      content: newMessage || (messageType === 'file' ? 'Sent a file' : ''),
      fileUrl: fileUrl,
      messageType: messageType,
      room: userId,
      senderName: user.name, // Added senderName
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, messageData]);
    socket.emit('send_message', messageData);
    
    setNewMessage('');
    setSelectedFile(null);
  };

  const handleFileSelect = (e) => {
      if (e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="h-[calc(100vh-8rem)] max-w-6xl mx-auto flex gap-6">
        {/* Video Call Modal */}
        {callActive && (
            <VideoCallModal 
                stream={stream}
                remoteStream={remoteStream}
                myVideo={myVideo}
                userVideo={userVideo}
                callAccepted={callAccepted}
                callEnded={callEnded}
                name={recipient?.name}
                leaveCall={() => leaveCall(true)}
                toggleMic={toggleMic}
                toggleVideo={toggleVideo}
                micOn={micOn}
                videoOn={videoOn}
                incomingCall={incomingCall}
                answerCall={answerCall}
                callerName={incomingCall?.name}
            />
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-zinc-800">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md flex justify-between items-center z-10">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {recipient?.name?.[0]}
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 dark:text-white">{recipient?.name || 'Loading...'}</h2>
                        <span className={`flex items-center text-xs ${isRecipientOnline ? 'text-green-500' : 'text-gray-400'}`}>
                            <span className={`w-2 h-2 rounded-full mr-1 ${isRecipientOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            {isRecipientOnline ? 'Online' : 'Offline'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                     {/* Connection Status Indicator */}
                     <div className="hidden md:flex items-center px-2 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 mr-2" title={iceServers.some(s => s.urls && s.urls.includes('turn:')) ? "Secure Relay Connection (TURN) Active" : "Basic P2P Connection (STUN) Only - May fail on WiFi"}>
                        <div className={`w-2 h-2 rounded-full mr-1.5 ${iceServers.some(s => s.urls && s.urls.includes('turn:')) ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                            {iceServers.some(s => s.urls && s.urls.includes('turn:')) ? 'Secure' : 'Basic'}
                        </span>
                    </div>

                    <button 
                         onClick={() => initiateCall(true)}
                         className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-indigo-500"
                         title="Start Video Call"
                    >
                        <VideoIcon size={20} />
                    </button>
                    <button 
                         onClick={() => initiateCall(false)}
                         className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-indigo-500"
                         title="Start Voice Call"
                    >
                        <Phone size={20} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-black/20">
                {messages.map((msg, idx) => {
                    const isMe = msg.sender === user._id;
                    return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] sm:max-w-[60%] relative group`}>
                                <div className={`p-4 rounded-2xl ${
                                    isMe 
                                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-none shadow-lg shadow-indigo-500/20' 
                                    : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded-bl-none shadow-sm border border-gray-100 dark:border-zinc-700'
                                }`}>
                                    
                                    {msg.messageType === 'text' && <p className="leading-relaxed">{msg.content}</p>}
                                    
                                    {msg.messageType === 'file' && (
                                        <div className="flex flex-col gap-2">
                                            {msg.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                                <img 
                                                    src={msg.fileUrl.startsWith('http') ? msg.fileUrl : `${BASE_URL}${msg.fileUrl}`} 
                                                    alt="attachment" 
                                                    className="rounded-lg max-h-60 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                    onClick={() => window.open(msg.fileUrl.startsWith('http') ? msg.fileUrl : `${BASE_URL}${msg.fileUrl}`, '_blank')}
                                                />
                                            ) : (
                                                <a 
                                                    href={getDownloadUrl(msg.fileUrl)} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    download
                                                    className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                >
                                                    <File size={24} />
                                                    <span className="underline truncate max-w-[200px]">Download Attachment</span>
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    <div className={`text-[10px] mt-2 flex items-center justify-end opacity-70 ${isMe ? 'text-indigo-100' : 'text-gray-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
                {selectedFile && (
                    <div className="mb-2 p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-between">
                        <div className="flex items-center text-sm text-indigo-700 dark:text-indigo-300">
                            <ImageIcon size={16} className="mr-2" />
                            <span className="truncate max-w-xs">{selectedFile.name}</span>
                        </div>
                        <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-red-500">
                            <X size={16} />
                        </button>
                    </div>
                )}
                
                <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                    <button 
                        type="button" 
                        onClick={() => fileInputRef.current.click()}
                        className="p-3 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors"
                    >
                        <Paperclip size={22} />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileSelect} 
                        className="hidden" 
                        accept="image/*,.pdf,.doc,.docx"
                    />

                    <div className="flex-1 relative">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            placeholder="Type your message..."
                            className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 min-h-[50px] max-h-[120px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none dark:text-white"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={uploading || (!newMessage.trim() && !selectedFile)}
                        className={`p-3 rounded-xl transition-all shadow-lg ${
                            (newMessage.trim() || selectedFile)
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30 cursor-pointer' 
                            : 'bg-gray-200 dark:bg-zinc-800 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {uploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={22} />}
                    </button>
                </form>
            </div>
        </div>

        {/* Sidebar (Desktop) */}
        <div className="hidden lg:block w-80">
            <SpotlightCard className="h-full p-6 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-zinc-800 mb-4 flex items-center justify-center text-4xl overflow-hidden">
                    {recipient?.name?.[0] || <User size={40} />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{recipient?.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{recipient?.email}</p>
                
                <div className="w-full space-y-3">
                    <button className="w-full py-2.5 px-4 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl text-sm font-medium transition-colors text-left flex items-center">
                        <ImageIcon size={16} className="mr-3 text-indigo-500" />
                        Shared Media
                    </button>
                    <button className="w-full py-2.5 px-4 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl text-sm font-medium transition-colors text-left flex items-center">
                         <File size={16} className="mr-3 text-indigo-500" />
                        Shared Files
                    </button>
                </div>
            </SpotlightCard>
        </div>
    </div>
  );
};

export default ChatPage;
