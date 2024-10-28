import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Users, Plus } from 'lucide-react';

export default function NewGame() {
  const { players, recordGame } = useGameStore();
  const [team1Players, setTeam1Players] = useState<number[]>([]);
  const [team2Players, setTeam2Players] = useState<number[]>([]);
  const [team1Score, setTeam1Score] = useState<number>(0);
  const [team2Score, setTeam2Score] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (team1Score === team2Score) {
      alert('Games cannot end in a tie!');
      return;
    }
    recordGame(team1Players, team2Players, team1Score, team2Score);
    // Reset form
    setTeam1Players([]);
    setTeam2Players([]);
    setTeam1Score(0);
    setTeam2Score(0);
  };

  const addPlayer = (teamNumber: number, playerId: number) => {
    if (teamNumber === 1) {
      setTeam1Players([...team1Players, playerId]);
    } else {
      setTeam2Players([...team2Players, playerId]);
    }
  };

  const removePlayer = (teamNumber: number, playerId: number) => {
    if (teamNumber === 1) {
      setTeam1Players(team1Players.filter((id) => id !== playerId));
    } else {
      setTeam2Players(team2Players.filter((id) => id !== playerId));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2" />
          Record New Game
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Team 1 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Team 1</h3>
              <div className="space-y-2">
                {team1Players.map((playerId) => (
                  <div
                    key={playerId}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span>
                      {players.find((p) => p.id === playerId)?.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePlayer(1, playerId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <select
                  onChange={(e) =>
                    addPlayer(1, parseInt(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value=""
                >
                  <option value="">Add player...</option>
                  {players
                    .filter(
                      (p) =>
                        !team1Players.includes(p.id) &&
                        !team2Players.includes(p.id)
                    )
                    .map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Score
                </label>
                <input
                  type="number"
                  min="0"
                  value={team1Score}
                  onChange={(e) =>
                    setTeam1Score(parseInt(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>

            {/* Team 2 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Team 2</h3>
              <div className="space-y-2">
                {team2Players.map((playerId) => (
                  <div
                    key={playerId}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span>
                      {players.find((p) => p.id === playerId)?.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePlayer(2, playerId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <select
                  onChange={(e) =>
                    addPlayer(2, parseInt(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value=""
                >
                  <option value="">Add player...</option>
                  {players
                    .filter(
                      (p) =>
                        !team1Players.includes(p.id) &&
                        !team2Players.includes(p.id)
                    )
                    .map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Score
                </label>
                <input
                  type="number"
                  min="0"
                  value={team2Score}
                  onChange={(e) =>
                    setTeam2Score(parseInt(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Record Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}