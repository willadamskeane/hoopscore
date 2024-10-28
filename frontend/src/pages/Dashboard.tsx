import React from 'react';
import { GameSubmissionForm } from '../components/GameSubmissionForm';
import { Leaderboard } from '../components/Leaderboard';
import { GameHistory } from '../components/GameHistory';

interface DashboardProps {
  userId: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const handleGameSubmit = () => {
    window.location.reload();
  };

  return (
    <div className="dashboard">
      <h1>Basketball ELO Rankings</h1>
      <GameSubmissionForm onGameSubmit={handleGameSubmit} />
      <Leaderboard />
      <GameHistory playerId={userId} />
    </div>
  );
};
