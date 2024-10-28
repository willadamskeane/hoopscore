export interface IPlayer {
  _id: string;
  username: string;
  email: string;
  eloRating: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
}
