import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Trophy as Basketball, MessageCircle, Trophy, UserCircle } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import NewGame from './pages/NewGame';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import { useGameStore } from './store/gameStore';

function App() {
  const { loadPlayers } = useGameStore();

  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-indigo-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Basketball className="w-8 h-8" />
                <span className="ml-2 text-xl font-bold">HoopScore</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500"
                >
                  <Trophy className="w-5 h-5" />
                </Link>
                <Link
                  to="/new-game"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500"
                >
                  <Basketball className="w-5 h-5" />
                </Link>
                <Link
                  to="/messages"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500"
                >
                  <MessageCircle className="w-5 h-5" />
                </Link>
                <Link
                  to="/profile"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500"
                >
                  <UserCircle className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/new-game" element={<NewGame />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
