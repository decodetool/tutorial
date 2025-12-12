import { Link, useLocation } from '@tanstack/react-router';
import { MapPin, Calendar, Users, Sparkles, Plane, MessageCircle, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/discover', icon: <Sparkles size={22} />, label: 'Discover' },
  { to: '/trips', icon: <Plane size={22} />, label: 'Trips' },
  { to: '/map', icon: <MapPin size={22} />, label: 'Map' },
  { to: '/activity', icon: <Users size={22} />, label: 'Activity' },
  { to: '/messages', icon: <MessageCircle size={22} />, label: 'Messages' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isSettingsActive = location.pathname.startsWith('/settings');

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Floating settings button */}
      <Link
        to="/settings"
        className={cn(
          'fixed top-4 right-4 z-50 p-3 rounded-full backdrop-blur-xl shadow-lg transition-all duration-200',
          isSettingsActive
            ? 'text-accent-cyan bg-accent-cyan/20 border border-accent-cyan/30'
            : 'text-text-secondary bg-surface/90 border border-white/10 hover:text-text-primary hover:bg-surface hover:border-white/20'
        )}
      >
        <Settings size={20} />
      </Link>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar pb-20">
        {children}
      </main>

      {/* Bottom tab navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-white/5 backdrop-blur-xl z-50">
        <div className="max-w-2xl mx-auto px-2 py-2 safe-bottom">
          <div className="grid grid-cols-5 gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 relative',
                    isActive
                      ? 'text-accent-cyan'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-accent-cyan/10 rounded-xl"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.icon}</span>
                  <span className="relative z-10 text-[11px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
