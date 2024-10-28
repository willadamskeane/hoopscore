import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IPlayer } from '../types';

interface Props {
  onGameSubmit: () => void;
}

export const GameSubmissionForm: React.FC<Props> = ({ onGameSubmit }) => {
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [team1Players, setTeam1Players] = useState<string[]>([]);
  const [team2Players, setTeam2Players] = useState<string[]>([]);
  const [team1Score, setTeam1Score] = useState<number>(0);
  const [team2Score, setTeam2Score] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get<IPlayer[]>('/api/players');
        setPlayers(response.data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    fetchPlayers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (team1Players.length === 0 || team2Players.length === 0) {
      alert('Both teams must have at least one player');
      return;
    }
    if (team1Players.length !== team2Players.length) {
      alert('Teams must have equal number of players');
      return;
    }
    if (team1Score === team2Score) {
      alert('Games cannot end in a tie');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/games', {
        team1PlayerIds: team1Players,
        team2PlayerIds: team2Players,
        team1Score,
        team2Score
      });
      
      onGameSubmit();
      setTeam1Players([]);
      setTeam2Players([]);
      setTeam1Score(0);
      setTeam2Score(0);
    } catch (error) {
      console.error('Error submitting game:', error);
      alert('Error submitting game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="game-submission-form">
      <div className="teams-container">
        <div className="team-section">
          <h3>Team 1</h3>
          <select
            multiple
            value={team1Players}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => option.value);
              if (values.length <= 5) {
                setTeam1Players(values);
              }
            }}
          >
            {players.map(player => (
              <option 
                key={player._id} 
                value={player._id}
                disabled={team2Players.includes(player._id)}
              >
                {player.username} (ELO: {player.eloRating})
              </option>
            ))}
          </select>
          <input
            type="number"
            value={team1Score}
            onChange={(e) => setTeam1Score(parseInt(e.target.value) || 0)}
            placeholder="Score"
            min="0"
          />
        </div>

        <div className="team-section">
          <h3>Team 2</h3>
          <select
            multiple
            value={team2Players}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => option.value);
              if (values.length <= 5) {
                setTeam2Players(values);
              }
            }}
          >
            {players.map(player => (
              <option 
                key={player._id} 
                value={player._id}
                disabled={team1Players.includes(player._id)}
              >
                {player.username} (ELO: {player.eloRating})
              </option>
            ))}
          </select>
          <input
            type="number"
            value={team2Score}
            onChange={(e) => setTeam2Score(parseInt(e.target.value) || 0)}
            placeholder="Score"
            min="0"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading || team1Players.length === 0 || team2Players.length === 0}
      >
        {loading ? 'Submitting...' : 'Submit Game'}
      </button>
    </form>
  );
};
