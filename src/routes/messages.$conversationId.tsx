import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { mockConversations, currentUser } from '@/lib/seed-data';
import { ArrowLeft, Send, Image as ImageIcon, Smile } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/messages/$conversationId')({
  component: ConversationComponent,
  beforeLoad: () => {
    document.title = 'Chat - Journeys';
  },
});

// Mock messages for the conversation
const mockMessages = [
  {
    id: 'msg-1',
    senderId: 'user-2',
    senderName: 'Sarah Chen',
    senderAvatar: 'https://i.pravatar.cc/150?img=5',
    text: 'Hey! Are you excited for Lisbon?',
    timestamp: '2025-10-12T10:00:00Z',
  },
  {
    id: 'msg-2',
    senderId: 'user-1',
    senderName: 'Alex Morgan',
    senderAvatar: 'https://i.pravatar.cc/150?img=1',
    text: "Absolutely! I've been researching the best pastéis de nata spots",
    timestamp: '2025-10-12T10:02:00Z',
  },
  {
    id: 'msg-3',
    senderId: 'user-2',
    senderName: 'Sarah Chen',
    senderAvatar: 'https://i.pravatar.cc/150?img=5',
    text: 'Pastéis de Belém is a must! Also, I found this amazing cooking class we could take',
    timestamp: '2025-10-12T10:05:00Z',
  },
  {
    id: 'msg-4',
    senderId: 'user-2',
    senderName: 'Sarah Chen',
    senderAvatar: 'https://i.pravatar.cc/150?img=5',
    text: "Can't wait for the Lisbon trip! Should we book that cooking class?",
    timestamp: '2025-10-12T15:30:00Z',
  },
];

function ConversationComponent() {
  const navigate = useNavigate();
  const { conversationId } = Route.useParams();
  const [messageText, setMessageText] = useState('');

  const conversation = mockConversations.find((c) => c.id === conversationId);

  if (!conversation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Conversation not found</p>
      </div>
    );
  }

  const otherParticipants = conversation.participants.filter((p) => p.id !== currentUser.id);
  const isGroup = otherParticipants.length > 1;
  const displayName = isGroup
    ? otherParticipants.map((p) => p.name.split(' ')[0]).join(', ')
    : otherParticipants[0].name;

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleSend = () => {
    if (messageText.trim()) {
      // Would send message here
      setMessageText('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 border-b border-white/5 bg-surface/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => navigate({ to: '/messages' })}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} className="text-text-primary" />
          </motion.button>

          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface">
            {!isGroup && otherParticipants[0].avatar ? (
              <img
                src={otherParticipants[0].avatar}
                alt={otherParticipants[0].name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent-teal to-accent-cyan flex items-center justify-center text-white font-semibold">
                {displayName.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-text-primary truncate">{displayName}</h1>
            <p className="text-xs text-text-secondary">
              {isGroup ? `${otherParticipants.length} members` : 'Active now'}
            </p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 pb-24">
        {mockMessages.map((message, index) => {
          const isCurrentUser = message.senderId === currentUser.id;

          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              {!isCurrentUser && (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-surface flex-shrink-0">
                  {message.senderAvatar ? (
                    <img
                      src={message.senderAvatar}
                      alt={message.senderName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent-teal to-accent-cyan flex items-center justify-center text-white text-xs font-semibold">
                      {message.senderName.charAt(0)}
                    </div>
                  )}
                </div>
              )}

              {/* Message Bubble */}
              <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                {!isCurrentUser && isGroup && (
                  <span className="text-xs text-text-secondary mb-1 px-3">
                    {message.senderName.split(' ')[0]}
                  </span>
                )}
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                    isCurrentUser
                      ? 'bg-gradient-to-r from-accent-teal to-accent-cyan text-background rounded-br-sm'
                      : 'bg-surface text-text-primary rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                <span className="text-xs text-text-secondary mt-1 px-3">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-surface border-t border-white/5 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <motion.button
            className="p-2 text-text-secondary hover:text-accent-cyan transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ImageIcon size={20} />
          </motion.button>
          <motion.button
            className="p-2 text-text-secondary hover:text-accent-cyan transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Smile size={20} />
          </motion.button>

          <input
            type="text"
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2.5 bg-background rounded-2xl border border-white/5 text-text-primary placeholder-text-secondary focus:border-accent-cyan focus:outline-none transition-colors"
          />

          <motion.button
            onClick={handleSend}
            disabled={!messageText.trim()}
            className="p-2.5 bg-gradient-to-r from-accent-teal to-accent-cyan text-background rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
