import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { mockConversations, currentUser } from '@/lib/seed-data';
import { Search, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/messages/')({
  component: MessagesListComponent,
  beforeLoad: () => {
    document.title = 'Messages - Journeys';
  },
});

function MessagesListComponent() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = mockConversations.filter((conv) =>
    conv.participants.some(
      (p) =>
        p.id !== currentUser.id &&
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 border-b border-white/5">
        <motion.h1
          className="text-3xl font-bold text-text-primary mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Messages
        </motion.h1>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface rounded-2xl border border-white/5 text-text-primary placeholder-text-secondary focus:border-accent-cyan focus:outline-none transition-colors"
          />
        </div>
      </header>

      {/* Conversations List */}
      <div className="pb-24">
        {filteredConversations.length > 0 ? (
          <div>
            {filteredConversations.map((conversation, index) => {
              const otherParticipants = conversation.participants.filter(
                (p) => p.id !== currentUser.id
              );
              const isGroup = otherParticipants.length > 1;
              const displayName = isGroup
                ? otherParticipants.map((p) => p.name.split(' ')[0]).join(', ')
                : otherParticipants[0].name;

              return (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate({ to: `/messages/${conversation.id}` })}
                  className="px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex gap-3">
                    {/* Avatar(s) */}
                    <div className="relative flex-shrink-0">
                      {isGroup ? (
                        <div className="flex -space-x-2">
                          {otherParticipants.slice(0, 2).map((participant, i) => (
                            <div
                              key={i}
                              className="w-12 h-12 rounded-full border-2 border-background overflow-hidden bg-surface"
                            >
                              {participant.avatar ? (
                                <img
                                  src={participant.avatar}
                                  alt={participant.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-accent-teal to-accent-cyan flex items-center justify-center text-white font-semibold">
                                  {participant.name.charAt(0)}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-surface">
                          {otherParticipants[0].avatar ? (
                            <img
                              src={otherParticipants[0].avatar}
                              alt={otherParticipants[0].name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-accent-teal to-accent-cyan flex items-center justify-center text-white font-semibold">
                              {otherParticipants[0].name.charAt(0)}
                            </div>
                          )}
                        </div>
                      )}
                      {conversation.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-cyan rounded-full flex items-center justify-center text-background text-xs font-bold">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>

                    {/* Message Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3
                          className={`font-semibold truncate ${
                            conversation.unreadCount > 0 ? 'text-text-primary' : 'text-text-primary'
                          }`}
                        >
                          {displayName}
                        </h3>
                        <span className="text-xs text-text-secondary whitespace-nowrap ml-2">
                          {conversation.lastMessage &&
                            formatTimestamp(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                      {conversation.lastMessage && (
                        <p
                          className={`text-sm truncate ${
                            conversation.unreadCount > 0
                              ? 'text-text-primary font-medium'
                              : 'text-text-secondary'
                          }`}
                        >
                          {conversation.lastMessage.senderId === currentUser.id && 'You: '}
                          {conversation.lastMessage.text}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 px-6"
          >
            <MessageCircle className="w-16 h-16 text-text-secondary/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No conversations</h3>
            <p className="text-text-secondary">Start chatting with your travel buddies!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
