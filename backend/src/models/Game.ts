import mongoose, { Document, Schema } from 'mongoose';

export interface IGame extends Document {
  player1: mongoose.Types.ObjectId;
  player2: mongoose.Types.ObjectId;
  winner: mongoose.Types.ObjectId;
  player1Score: number;
  player2Score: number;
  date: Date;
}

const GameSchema: Schema = new Schema({
  player1: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  player2: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  winner: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  player1Score: { type: Number, required: true },
  player2Score: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model<IGame>('Game', GameSchema);
import Player from './Player';

interface Game {
    id: string;
    whitePlayer: Player;
    blackPlayer: Player;
    pgn: string;  // Chess game moves in PGN notation
    status: 'active' | 'completed' | 'abandoned';
    winner?: Player;
    startTime: Date;
    endTime?: Date;
    eloChange?: {
        white: number;
        black: number;
    };
}

export default Game;
