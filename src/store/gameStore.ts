import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { calculateEloChange, calculateTeamElo } from "../lib/elo";
import type { Player } from "../lib/db";

const setupPlayerSubscription = (loadPlayers: () => Promise<void>) => {
  return supabase
    .channel("players")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "players" },
      () => {
        loadPlayers();
      }
    )
    .subscribe();
};

interface GameStore {
  cleanup: () => void;
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

export const useGameStore = create<GameStore>((set, get) => {
  const subscription = setupPlayerSubscription(async () => {
    const { loadPlayers } = get();
    await loadPlayers();
  });

  const cleanup = () => {
    subscription.unsubscribe();
  };

  return {
    cleanup,
    players: [],

    loadPlayers: async () => {
      const { data: players, error } = await supabase
        .from("players")
        .select("*")
        .order("elo", { ascending: false });

      if (error) {
        console.error("Error loading players:", error);
        return;
      }

      set({ players: players || [] });
    },

    addPlayer: async (name: string, email: string) => {
      const { error } = await supabase
        .from("players")
        .insert([{ name, email }]);

      if (error) {
        console.error("Error adding player:", error);
        return;
      }

      await get().loadPlayers();
    },

    recordGame: async (
      team1Players: number[],
      team2Players: number[],
      team1Score: number,
      team2Score: number
    ) => {
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

      // Insert game
      const { data: game, error: gameError } = await supabase
        .from("games")
        .insert([
          {
            team_size: team1Players.length,
            winner_score: Math.max(team1Score, team2Score),
            loser_score: Math.min(team1Score, team2Score),
          },
        ])
        .select()
        .single();

      if (gameError || !game) {
        console.error("Error recording game:", gameError);
        return;
      }

      // Insert game players
      const gamePlayers = [...team1Players, ...team2Players].map(
        (playerId) => ({
          game_id: game.id,
          player_id: playerId,
          team: team1Players.includes(playerId) ? "team1" : "team2",
          elo_change: (isTeam1Winner ? team1Players : team2Players).includes(
            playerId
          )
            ? eloChange
            : -eloChange,
        })
      );

      const { error: playerError } = await supabase
        .from("game_players")
        .insert(gamePlayers);

      if (playerError) {
        console.error("Error recording game players:", playerError);
        return;
      }

      // Update player ELOs
      for (const playerId of team1Players) {
        await supabase
          .from("players")
          .update({
            elo: supabase.raw(
              `elo + ${isTeam1Winner ? eloChange : -eloChange}`
            ),
            games_played: supabase.raw("games_played + 1"),
          })
          .eq("id", playerId);
      }

      for (const playerId of team2Players) {
        await supabase
          .from("players")
          .update({
            elo: supabase.raw(
              `elo + ${isTeam1Winner ? -eloChange : eloChange}`
            ),
            games_played: supabase.raw("games_played + 1"),
          })
          .eq("id", playerId);
      }

      await get().loadPlayers();
    },

    getPlayerStats: async (playerId: number) => {
      const { data: player, error } = await supabase
        .from("players")
        .select("*")
        .eq("id", playerId)
        .single();

      if (error) {
        console.error("Error getting player stats:", error);
        return undefined;
      }

      return player;
    },
  };
});
