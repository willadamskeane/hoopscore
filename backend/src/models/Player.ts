import mongoose, { Document, Schema } from 'mongoose';

export interface IPlayer extends Document {
  name: string;
  email: string;
  password: string;
  elo: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
}

const PlayerSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  elo: { type: Number, default: 1500 },
  gamesPlayed: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model<IPlayer>('Player', PlayerSchema);
interface Player {
    id: string;
    username: string;
    email: string;
    eloRating: number;
    gamesPlayed: number;
    wins: number;
    losses: number;
    draws: number;
}

export default Player;
