import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
}

const MessageSchema: Schema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IMessage>('Message', MessageSchema);
import Player from './Player';

interface Message {
    id: string;
    sender: Player;
    recipient: Player;
    content: string;
    timestamp: Date;
    read: boolean;
}

export default Message;
