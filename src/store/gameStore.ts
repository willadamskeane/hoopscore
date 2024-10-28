import { create } from 'zustand';
import { db } from '../lib/db';
import { calculateEloChange, calculateTeamElo } from '../lib/elo';

interface Player {
  id: number;
  name: string;
  email: string;
  elo: number;
  gamesPlayed: number;
}

interface GameStore {
  players: Player[];
  addPlayer: (name: string, email: string) => void;
  recordGame: (
    team1Players: number[],
    team2Players: number[],
    team1Score: number,
    team2Score: number
  ) => void;
  getPlayerStats: (playerId: number) => Player | undefined;
  loadPlayers: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  players: [],

  loadPlayers: () => {
    const result = db.exec('SELECT * FROM players');
    const players = result[0]?.values.map(row => ({
      id: row[0],
      name: row[1],
      email: row[2],
      elo: row[3],
      gamesPlayed: row[4]
    })) || [];
    set({ players });
  },

  addPlayer: (name, email) => {
    db.run(
      'INSERT INTO players (name, email) VALUES (?, ?)',
      [name, email]
    );
    get().loadPlayers();
  },

  recordGame: (team1Players, team2Players, team1Score, team2Score) => {
    const players = get().players;
    const team1Elos = team1Players.map(
      (id) => players.find((p) => p.id === id)?.elo ?? 1500
    );
    const team2Elos = team2Players.map(
      (id) => players.find((p) => p.id === id)?.elo ?? 1500
    );

    const team1Elo = calculateTeamElo(team1Elos);
    const team2Elo = calculateTeamElo(team2Elos);

    const isTeam1Winner = team1Score > team2Score;
    const eloChange = calculateEloChange(
      isTeam1Winner ? team1Elo : team2Elo,
      isTeam1Winner ? team2Elo : team1Elo
    );

    db.run('BEGIN TRANSACTION');
    try {
      // Insert game
      db.run(
        'INSERT INTO games (team_size, winner_score, loser_score) VALUES (?, ?, ?)',
        [team1Players.length, Math.max(team1Score, team2Score), Math.min(team1Score, team2Score)]
      );
      
      const gameId = db.exec('SELECT last_insert_rowid()')[0].values[0][0];

      // Insert game players
      for (const playerId of [...team1Players, ...team2Players]) {
        const isWinner = isTeam1Winner
          ? team1Players.includes(playerId)
          : team2Players.includes(playerId);
        db.run(
          'INSERT INTO game_players (game_id, player_id, team, elo_change) VALUES (?, ?, ?, ?)',
          [gameId, playerId, team1Players.includes(playerId) ? 'team1' : 'team2', isWinner ? eloChange : -eloChange]
        );
      }

      // Update player ELOs
      for (const playerId of team1Players) {
        db.run(
          'UPDATE players SET elo = elo + ?, games_played = games_played + 1 WHERE id = ?',
          [isTeam1Winner ? eloChange : -eloChange, playerId]
        );
      }
      for (const playerId of team2Players) {
        db.run(
          'UPDATE players SET elo = elo + ?, games_played = games_played + 1 WHERE id = ?',
          [isTeam1Winner ? -eloChange : eloChange, playerId]
        );
      }

      db.run('COMMIT');
    } catch (error) {
      db.run('ROLLBACK');
      throw error;
    }

    get().loadPlayers();
  },

  getPlayerStats: (playerId) => {
    const result = db.exec('SELECT * FROM players WHERE id = ?', [playerId]);
    if (result[0]?.values?.length) {
      const row = result[0].values[0];
      return {
        id: row[0],
        name: row[1],
        email: row[2],
        elo: row[3],
        gamesPlayed: row[4]
      };
    }
    return undefined;
  },
}));