import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Lock,
  Globe,
  HelpCircle,
  Info,
  ChevronRight,
  LogOut,
} from 'lucide-react';

export const Route = createFileRoute('/settings/')({
  component: SettingsComponent,
  beforeLoad: () => {
    document.title = 'Settings - Journeys';
  },
});

interface SettingItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  to?: string;
  action?: () => void;
  danger?: boolean;
}

function SettingsComponent() {
  const navigate = useNavigate();

  const settingsSections: { title: string; items: SettingItem[] }[] = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          icon: <User size={20} />,
          label: 'Profile',
          description: 'Edit your personal information',
          to: '/settings/profile',
        },
        {
          id: 'notifications',
          icon: <Bell size={20} />,
          label: 'Notifications',
          description: 'Manage notification preferences',
          to: '/settings/notifications',
        },
        {
          id: 'privacy',
          icon: <Lock size={20} />,
          label: 'Privacy',
          description: 'Control your privacy settings',
          to: '/settings/privacy',
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'language',
          icon: <Globe size={20} />,
          label: 'Language & Region',
          description: 'English (US)',
          to: '/settings/language',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          icon: <HelpCircle size={20} />,
          label: 'Help Center',
          description: 'Get help and support',
          to: '/settings/help',
        },
        {
          id: 'about',
          icon: <Info size={20} />,
          label: 'About',
          description: 'App version and legal info',
          to: '/settings/about',
        },
      ],
    },
    {
      title: '',
      items: [
        {
          id: 'logout',
          icon: <LogOut size={20} />,
          label: 'Log Out',
          description: 'Sign out of your account',
          action: () => alert('Logout functionality coming soon!'),
          danger: true,
        },
      ],
    },
  ];

  const handleItemClick = (item: SettingItem) => {
    if (item.action) {
      item.action();
    } else if (item.to) {
      navigate({ to: item.to });
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
          Settings
        </motion.h1>
        <p className="text-text-secondary">Manage your account and preferences</p>
      </header>

      {/* Settings Sections */}
      <div className="space-y-8">
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.title && (
              <h2 className="px-6 text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                {section.title}
              </h2>
            )}
            <div className="bg-surface mx-6 rounded-3xl border border-white/5 overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                  className={`w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors ${
                    itemIndex < section.items.length - 1 ? 'border-b border-white/5' : ''
                  }`}
                >
                  <div
                    className={`flex-shrink-0 ${
                      item.danger ? 'text-red-400' : 'text-accent-cyan'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p
                      className={`font-medium ${
                        item.danger ? 'text-red-400' : 'text-text-primary'
                      }`}
                    >
                      {item.label}
                    </p>
                    <p className="text-sm text-text-secondary truncate">{item.description}</p>
                  </div>
                  <ChevronRight
                    size={20}
                    className={item.danger ? 'text-red-400/50' : 'text-text-secondary'}
                  />
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
