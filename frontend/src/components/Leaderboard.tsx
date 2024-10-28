import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IPlayer } from '../types';

export const Leaderboard: React.FC = () => {
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get<IPlayer[]>('/api/players');
        setPlayers(response.data.sort((a, b) => b.eloRating - a.eloRating));
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <div className="leaderboard">
      <h2>Player Rankings</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>ELO Rating</th>
            <th>W/L/D</th>
            <th>Win Rate</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => {
            const winRate = player.gamesPlayed > 0 
              ? ((player.wins / player.gamesPlayed) * 100).toFixed(1) 
              : '0.0';
            
            return (
              <tr key={player._id}>
                <td>{index + 1}</td>
                <td>{player.username}</td>
                <td>{player.eloRating}</td>
                <td>{`${player.wins}/${player.losses}/${player.draws}`}</td>
                <td>{winRate}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
