import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Message } from '../lib/db';

interface MessageStore {
  messages: Message[];
  sendMessage: (senderId: number, content: string) => Promise<void>;
  loadMessages: () => Promise<void>;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],

  loadMessages: async () => {
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id(name)
      `)
      .order('created_at', { ascending: false })
      .limit(100);

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
