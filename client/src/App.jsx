import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ExpertList from './pages/ExpertList';
import ExpertProfile from './pages/ExpertProfile';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

import Footer from './components/Footer';
import DebugInfo from './components/DebugInfo';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300 flex flex-col">
      <DebugInfo />
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/experts" element={<ExpertList />} />
          <Route path="/experts/:id" element={<ExpertProfile />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          <Route path="/chat/:userId" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
