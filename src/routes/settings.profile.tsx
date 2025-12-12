import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera } from 'lucide-react';
import { currentUser } from '@/lib/seed-data';
import { useState } from 'react';

export const Route = createFileRoute('/settings/profile')({
  component: ProfileSettingsComponent,
  beforeLoad: () => {
    document.title = 'Profile Settings - Journeys';
  },
});

function ProfileSettingsComponent() {
  const navigate = useNavigate();
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email || '');

  const handleSave = () => {
    alert('Profile saved! (This is a demo)');
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4 mb-4">
          <motion.button
            onClick={() => navigate({ to: '/settings' })}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} className="text-text-primary" />
          </motion.button>
          <motion.h1
            className="text-2xl font-bold text-text-primary"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Profile Settings
          </motion.h1>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 py-8 space-y-6">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-accent-teal to-accent-cyan">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-3xl font-semibold">
                  {currentUser.name.charAt(0)}
                </div>
              )}
            </div>
            <motion.button
              className="absolute bottom-0 right-0 p-2 bg-accent-cyan rounded-full text-background shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Camera size={16} />
            </motion.button>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-surface rounded-2xl border border-white/5 text-text-primary focus:border-accent-cyan focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-surface rounded-2xl border border-white/5 text-text-primary focus:border-accent-cyan focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Bio</label>
            <textarea
              placeholder="Tell us about yourself..."
              rows={4}
              className="w-full px-4 py-3 bg-surface rounded-2xl border border-white/5 text-text-primary placeholder-text-secondary focus:border-accent-cyan focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <motion.button
          onClick={handleSave}
          className="w-full px-6 py-3 bg-gradient-to-r from-accent-teal to-accent-cyan text-background rounded-2xl font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Save Changes
        </motion.button>
      </div>
    </div>
  );
}
