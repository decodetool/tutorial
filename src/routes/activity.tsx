import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { mockActivities } from '@/lib/seed-data';
import { Plane, MapPin, UserPlus, CheckCircle, Sparkles } from 'lucide-react';

export const Route = createFileRoute('/activity')({
  component: ActivityFeedComponent,
  beforeLoad: () => {
    document.title = 'Activity - Journeys';
  },
});

function ActivityFeedComponent() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'trip_created':
        return <Plane size={16} className="text-accent-cyan" />;
      case 'trip_completed':
        return <CheckCircle size={16} className="text-accent-teal" />;
      case 'place_saved':
        return <MapPin size={16} className="text-accent-cyan" />;
      case 'friend_added':
        return <UserPlus size={16} className="text-accent-teal" />;
      default:
        return <Sparkles size={16} className="text-accent-cyan" />;
    }
  };

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case 'trip_created':
        return (
          <>
            <span className="font-semibold text-text-primary">{activity.userName}</span>
            <span className="text-text-secondary"> created a trip to </span>
            <span className="font-semibold text-text-primary">{activity.data.tripName}</span>
          </>
        );
      case 'trip_completed':
        return (
          <>
            <span className="font-semibold text-text-primary">{activity.userName}</span>
            <span className="text-text-secondary"> completed </span>
            <span className="font-semibold text-text-primary">{activity.data.tripName}</span>
          </>
        );
      case 'place_saved':
        return (
          <>
            <span className="font-semibold text-text-primary">{activity.userName}</span>
            <span className="text-text-secondary"> saved </span>
            <span className="font-semibold text-text-primary">{activity.data.placeName}</span>
          </>
        );
      case 'friend_added':
        return (
          <>
            <span className="font-semibold text-text-primary">{activity.userName}</span>
            <span className="text-text-secondary"> became friends with </span>
            <span className="font-semibold text-text-primary">{activity.data.friendName}</span>
          </>
        );
      default:
        return <span className="text-text-secondary">Activity</span>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <motion.h1
          className="text-3xl font-bold text-text-primary mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Activity
        </motion.h1>
        <p className="text-text-secondary">See what your friends are up to</p>
      </header>

      {/* Activity Feed */}
      <div className="px-6 space-y-3">
        {mockActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-3 p-4 bg-surface rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-surface flex-shrink-0">
              {activity.userAvatar ? (
                <img
                  src={activity.userAvatar}
                  alt={activity.userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-accent-teal to-accent-cyan flex items-center justify-center text-white font-semibold">
                  {activity.userName.charAt(0)}
                </div>
              )}
            </div>

            {/* Activity Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-white/5 rounded-lg">{getActivityIcon(activity.type)}</div>
                <p className="text-sm flex-1 min-w-0">{getActivityText(activity)}</p>
              </div>
              <span className="text-xs text-text-secondary">
                {formatTimestamp(activity.timestamp)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State (if no activities) */}
      {mockActivities.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 px-6"
        >
          <Sparkles className="w-16 h-16 text-text-secondary/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No activity yet</h3>
          <p className="text-text-secondary">
            Follow friends to see their travel adventures here
          </p>
        </motion.div>
      )}
    </div>
  );
}
