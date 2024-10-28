import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { calculateEloChange, calculateTeamElo } from '../lib/elo';
import type { Player } from '../lib/db';

interface GameStore {
  players: Player[];
  addPlayer: (name: string, email: string) => Promise<void>;
  recordGame: (
    team1Players: number[],
    team2Players: number[],
    team1Score: number,
    team2Score: number
  ) => Promise<void>;
  getPlayerStats: (playerId: number) => Promise<Player | undefined>;
  loadPlayers: () => Promise<void>;
}

export const useGameStore = create<GameStore>((set, get) => ({
  players: [],

  loadPlayers: async () => {
    const { data: players, error } = await supabase
      .from('players')
      .select('*')
      .order('elo', { ascending: false });
    
    if (error) {
      console.error('Error loading players:', error);
      return;
    }
    
    set({ players: players || [] });
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
