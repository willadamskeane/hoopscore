export interface Player {
  id: number
  name: string
  email: string
  elo: number
  games_played: number
  created_at: string
}

export interface Game {
  id: number
  team_size: number
  winner_score: number
  loser_score: number
  date: string
}

export interface GamePlayer {
  id: number
  game_id: number
  player_id: number
  team: 'team1' | 'team2'
  elo_change: number
}

export interface Message {
  id: number
  sender_id: number
  content: string
  created_at: string
}
