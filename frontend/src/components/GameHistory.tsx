import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IGame } from '../types';

interface GameHistoryProps {
  playerId: string;
}

interface GameWithContext extends IGame {
  playerTeamScore: number;
  opposingTeamScore: number;
  eloChange: number;
  result: 'WIN' | 'LOSS';
}

export const GameHistory: React.FC<GameHistoryProps> = ({ playerId }) => {
  const [games, setGames] = useState<GameWithContext[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<'date' | 'eloChange'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get<GameWithContext[]>(`/api/games/player/${playerId}`);
        setGames(response.data);
      } catch (error) {
        console.error('Error fetching game history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [playerId]);

  const handleSort = (field: 'date' | 'eloChange') => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedGames = [...games].sort((a, b) => {
    if (sortField === 'date') {
      return sortOrder === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return sortOrder === 'asc'
        ? a.eloChange - b.eloChange
        : b.eloChange - a.eloChange;
    }
  });

  if (loading) return <div>Loading game history...</div>;

  return (
    <div className="game-history">
      <h2>Game History</h2>
      <div className="sort-controls">
        <button onClick={() => handleSort('date')}>
          Sort by Date {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button onClick={() => handleSort('eloChange')}>
          Sort by ELO Change {sortField === 'eloChange' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Score</th>
            <th>Result</th>
            <th>ELO Change</th>
          </tr>
        </thead>
        <tbody>
          {sortedGames.map((game) => (
            <tr key={game._id} className={game.result.toLowerCase()}>
              <td>{new Date(game.date).toLocaleDateString()}</td>
              <td>{game.playerTeamScore} - {game.opposingTeamScore}</td>
              <td>{game.result}</td>
              <td className={game.eloChange >= 0 ? 'positive' : 'negative'}>
                {game.eloChange >= 0 ? '+' : ''}{game.eloChange}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
