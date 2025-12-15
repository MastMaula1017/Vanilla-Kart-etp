import { useEffect, useRef, useState } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, User, Phone } from 'lucide-react';

const VideoCallModal = ({ 
  stream, 
  myVideo, 
  userVideo, 
  callAccepted, 
  callEnded, 
  name, 
  leaveCall, 
  toggleMic, 
  toggleVideo, 
  micOn, 
  videoOn,
  incomingCall,
  answerCall,
  callerName,
  remoteStream // New prop
}) => {

  // Ensure remote stream is attached whenever it changes or video ref is ready
  useEffect(() => {
    if (userVideo.current && remoteStream) {
        userVideo.current.srcObject = remoteStream;
    }
  }, [remoteStream, userVideo, callAccepted]);

  // Ensure LOCAL stream is attached when modal mounts
  useEffect(() => {
    if (myVideo.current && stream) {
        myVideo.current.srcObject = stream;
    }
  }, [stream, myVideo]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-5xl aspect-video bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
        
        {/* Remote Video (Main) */}
        {callAccepted && !callEnded ? (
          <video 
            playsInline 
            ref={userVideo} 
            autoPlay 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center flex-col text-white">
            <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center mb-4 border-2 border-indigo-500 animate-pulse">
                <User size={48} className="text-gray-400" />
            </div>
            {incomingCall && !callAccepted ? (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">{callerName} is calling...</h2>
                    <p className="text-gray-400">
                      {incomingCall.callType === 'audio' ? 'Incoming Voice Call' : 'Incoming Video Call'}
                    </p>
                </div>
            ) : (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Calling {name || 'Peer'}...</h2>
                    <p className="text-gray-400">Waiting for answer</p>
                </div>
            )}
          </div>
        )}

        {/* Local Video (PIP) */}
        {stream && (
            <div className="absolute top-4 right-4 w-48 aspect-video bg-black rounded-xl overflow-hidden shadow-xl border border-white/10 z-10 transition-all hover:scale-105">
                <video 
                    playsInline 
                    muted 
                    ref={myVideo} 
                    autoPlay 
                    className={`w-full h-full object-cover ${!videoOn ? 'hidden' : ''}`}
                />
                {!videoOn && (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                        <User size={24} className="text-gray-500" />
                    </div>
                )}
            </div>
        )}

        {/* Controls Overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-zinc-950/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
          
          {incomingCall && !callAccepted ? (
             <div className="flex gap-4">
                 <button 
                    onClick={answerCall} 
                    className="p-4 bg-green-500 hover:bg-green-600 rounded-full text-white transition-colors animate-bounce"
                 >
                    {incomingCall.callType === 'audio' ? <Phone /> : <Video size={24} />}
                 </button>
                 <button 
                    onClick={leaveCall} 
                    className="p-4 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                 >
                    <PhoneOff size={24} />
                 </button>
             </div>
          ) : (
             <>
                <button 
                  onClick={toggleMic} 
                  className={`p-3 rounded-full transition-colors ${micOn ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
                >
                  {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                </button>
                
                <button 
                  onClick={toggleVideo} 
                  className={`p-3 rounded-full transition-colors ${videoOn ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
                >
                  {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
                </button>

                <button 
                  onClick={leaveCall} 
                  className="p-4 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors ml-4"
                >
                  <PhoneOff size={24} />
                </button>
             </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
