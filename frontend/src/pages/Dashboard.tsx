import React from 'react';
import { GameSubmissionForm } from '../components/GameSubmissionForm';
import { Leaderboard } from '../components/Leaderboard';

export const Dashboard: React.FC = () => {
  const handleGameSubmit = () => {
    window.location.reload();
  };

  return (
    <div className="dashboard">
      <h1>Basketball ELO Rankings</h1>
      <GameSubmissionForm onGameSubmit={handleGameSubmit} />
      <Leaderboard />
    </div>
  );
};
