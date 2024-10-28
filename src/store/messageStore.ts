import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Message } from '../lib/db';

interface MessageStore {
  messages: Message[];
  sendMessage: (senderId: number, content: string) => Promise<void>;
  loadMessages: () => Promise<void>;
  initialized: boolean;
  initialize: () => Promise<void>;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  initialized: false,
  messages: [],

  initialize: async () => {
    if (!get().initialized) {
      await get().loadMessages();
      set({ initialized: true });
    }
  },

  loadMessages: async () => {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    set({ messages: messages || [] });
  },

  sendMessage: async (senderId: number, content: string) => {
    const { error } = await supabase
      .from('messages')
      .insert([{
        sender_id: senderId,
        content: content
      }]);

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    // Reload messages to show the new one
    const store = set.getState();
    await store.loadMessages();
  },
}));
