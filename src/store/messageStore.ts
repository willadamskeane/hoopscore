import { create } from 'zustand';
import { db } from '../lib/db';

interface Message {
  id: number;
  senderId: number;
  content: string;
  createdAt: string;
  senderName: string;
}

interface MessageStore {
  messages: Message[];
  sendMessage: (senderId: number, content: string) => void;
  loadMessages: () => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],

  loadMessages: () => {
    const result = db.exec(`
      SELECT m.*, p.name as sender_name 
      FROM messages m 
      JOIN players p ON m.sender_id = p.id 
      ORDER BY m.created_at DESC 
      LIMIT 100
    `);
    const messages = result[0]?.values.map(row => ({
      id: row[0],
      senderId: row[1],
      content: row[2],
      createdAt: row[3],
      senderName: row[4]
    })) || [];
    set({ messages });
  },

  sendMessage: (senderId, content) => {
    db.run(
      'INSERT INTO messages (sender_id, content) VALUES (?, ?)',
      [senderId, content]
    );
    set.getState().loadMessages();
  },
}));