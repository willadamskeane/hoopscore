import mongoose, { Document, Schema } from 'mongoose';

export interface IGame extends Document {
  team1: mongoose.Types.ObjectId[];
  team2: mongoose.Types.ObjectId[];
  team1Score: number;
  team2Score: number;
  date: Date;
  eloChanges: {
    playerId: mongoose.Types.ObjectId;
    change: number;
  }[];
}

const GameSchema: Schema = new Schema({
  team1: [{ type: Schema.Types.ObjectId, ref: 'Player', required: true }],
  team2: [{ type: Schema.Types.ObjectId, ref: 'Player', required: true }],
  team1Score: { type: Number, required: true },
  team2Score: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  eloChanges: [{
    playerId: { type: Schema.Types.ObjectId, ref: 'Player' },
    change: Number
  }]
});

export default mongoose.model<IGame>('Game', GameSchema);
