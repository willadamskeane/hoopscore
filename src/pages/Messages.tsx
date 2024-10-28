import React, { useState, useEffect } from 'react';
import { useMessageStore } from '../store/messageStore';
import { useGameStore } from '../store/gameStore';
import { Send, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function Messages() {
  const { messages, sendMessage, loadMessages } = useMessageStore();
  const { players } = useGameStore();
  const [newMessage, setNewMessage] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlayer && newMessage.trim()) {
      sendMessage(selectedPlayer, newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <MessageCircle className="w-6 h-6 mr-2" />
          Group Chat
        </h2>

        <div className="space-y-4">
          <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4">
            {messages.map((message) => {
              const sender = players.find((p) => p.id === message.senderId);
              return (
                <div
                  key={message.id}
                  className="flex items-start space-x-3"
                >
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-indigo-600">
                          {sender?.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(
                            new Date(message.createdAt),
                            'MMM d, h:mm a'
                          )}
                        </span>
                      </div>
                      <p className="text-gray-800">{message.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={selectedPlayer || ''}
              onChange={(e) =>
                setSelectedPlayer(
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select your name...</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <button
                type="submit"
                disabled={!selectedPlayer || !newMessage.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}