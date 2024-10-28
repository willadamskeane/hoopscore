import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { UserCircle, Plus } from 'lucide-react';

export default function Profile() {
  const { addPlayer, players } = useGameStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      addPlayer(name, email);
      setName('');
      setEmail('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <UserCircle className="w-6 h-6 mr-2" />
          Add New Player
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Player
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Registered Players</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {players.map((player) => (
            <div
              key={player.id}
              className="border rounded-lg p-4 bg-gray-50"
            >
              <h3 className="font-medium">{player.name}</h3>
              <p className="text-sm text-gray-500">{player.email}</p>
              <div className="mt-2 text-sm">
                <span className="text-indigo-600">
                  ELO Rating: {player.elo}
                </span>
                <span className="mx-2">•</span>
                <span className="text-gray-600">
                  Games: {player.gamesPlayed}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}