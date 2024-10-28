import mongoose, { Document, Schema } from 'mongoose';

export interface IPlayer extends Document {
  username: string;
  email: string;
  password: string;
  eloRating: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
}

const PlayerSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  eloRating: { type: Number, default: 1500 },
  gamesPlayed: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  draws: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model<IPlayer>('Player', PlayerSchema);
