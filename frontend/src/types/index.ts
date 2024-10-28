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

export interface IGame {
  _id: string;
  team1: IPlayer[];
  team2: IPlayer[];
  team1Score: number;
  team2Score: number;
  date: Date;
  eloChanges: {
    playerId: string;
    change: number;
  }[];
}

export interface IGameSubmission {
  team1PlayerIds: string[];
  team2PlayerIds: string[];
  team1Score: number;
  team2Score: number;
}
