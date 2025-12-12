import { createFileRoute, useSearch, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import {
  MapPin,
  Users,
  Calendar,
  DollarSign,
  ArrowRight,
  MessageCircle,
  Heart,
  Plane,
  Plus,
  Check,
  User,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { Tabs } from '@/components/ui/Tabs';
import type { Trip, User as UserType, Message, Activity } from '@/types';

export const Route = createFileRoute('/components/')({
  component: ComponentGalleryComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      component: (search.component as string) || undefined,
    };
  },
  beforeLoad: () => {
    document.title = 'Component Gallery - Journeys';
  },
});

function ComponentGalleryComponent() {
  const searchParams = useSearch({ from: '/components/' });
  const selectedComponent = searchParams.component;

  // If a specific component is selected, show only that component
  if (selectedComponent) {
    return <SingleComponentView componentId={selectedComponent} />;
  }

  // Otherwise, show the full gallery
  return <GalleryGridView />;
}

function GalleryGridView() {
  const navigate = useNavigate();

  const componentSections = [
    {
      title: 'Timeline & Cards',
      id: 'cards',
      components: [
        { id: 'TripTimelineCard', name: 'Trip Timeline Card', category: 'cards' },
        { id: 'TripCardVariants', name: 'Trip Card Variants', category: 'cards' },
        { id: 'CityCard', name: 'City Card', category: 'cards' },
        { id: 'ActivityCard', name: 'Activity Feed Card', category: 'cards' },
      ],
    },
    {
      title: 'Chat & Messaging',
      id: 'chat',
      components: [
        { id: 'MessageBubble', name: 'Message Bubble', category: 'chat' },
        { id: 'MessageBubbleVariants', name: 'Message Variants', category: 'chat' },
        { id: 'ConversationItem', name: 'Conversation List Item', category: 'chat' },
      ],
    },
    {
      title: 'Navigation',
      id: 'navigation',
      components: [
        { id: 'TabsComponent', name: 'Tabs Navigation', category: 'navigation' },
        { id: 'SettingsItem', name: 'Settings List Item', category: 'navigation' },
      ],
    },
    {
      title: 'UI Elements',
      id: 'ui',
      components: [
        { id: 'DateBadge', name: 'Date Badge', category: 'ui' },
        { id: 'AvatarGroup', name: 'Avatar Group', category: 'ui' },
        { id: 'StatusBadges', name: 'Status Badges', category: 'ui' },
        { id: 'Buttons', name: 'Button Variants', category: 'ui' },
      ],
    },
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <motion.h1
          className="text-3xl font-bold text-text-primary mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Component Gallery
        </motion.h1>
        <p className="text-text-secondary">Design system showcase for infinite canvas</p>
      </header>

      {/* Component Sections */}
      <div className="space-y-12">
        {componentSections.map((section, sectionIndex) => (
          <div key={section.id}>
            <div className="px-6 mb-4">
              <h2 className="text-xl font-semibold text-text-primary mb-1">{section.title}</h2>
              <p className="text-sm text-text-secondary">Click any component to view it in isolation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6">
              {section.components.map((component, componentIndex) => (
                <motion.button
                  key={component.id}
                  onClick={() => navigate({ to: '/components', search: { component: component.id } })}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (sectionIndex * 0.1) + (componentIndex * 0.05) }}
                  className="text-left bg-surface border border-white/5 rounded-2xl p-6 hover:bg-white/5 hover:border-accent-cyan/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-text-primary">{component.name}</h3>
                    <ArrowRight
                      size={20}
                      className="text-text-secondary group-hover:text-accent-cyan group-hover:translate-x-1 transition-all"
                    />
                  </div>
                  <div className="text-sm text-text-secondary mb-4">Category: {component.category}</div>

                  {/* Mini Preview */}
                  <div className="bg-background/50 rounded-xl p-3 border border-white/5">
                    <ComponentPreview componentId={component.id} mini />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SingleComponentView({ componentId }: { componentId: string }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <button
          onClick={() => navigate({ to: '/components' })}
          className="text-accent-cyan hover:text-accent-teal transition-colors mb-4 flex items-center gap-2"
        >
          <ArrowRight size={16} className="rotate-180" />
          Back to Gallery
        </button>
        <motion.h1
          className="text-3xl font-bold text-text-primary mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {componentId}
        </motion.h1>
        <p className="text-text-secondary">Component showcase</p>
      </header>

      {/* Component Display */}
      <div className="px-6">
        <div className="bg-surface border border-white/5 rounded-3xl p-8">
          <ComponentPreview componentId={componentId} />
        </div>
      </div>
    </div>
  );
}

function ComponentPreview({ componentId, mini = false }: { componentId: string; mini?: boolean }) {
  // Mock data
  const mockTrip: Trip = {
    id: 'trip-1',
    name: 'Tokyo Adventure',
    destination: 'Tokyo, Japan',
    startDate: '2024-06-15',
    endDate: '2024-06-22',
    status: 'upcoming',
    places: [],
    travelers: [
      { id: '1', name: 'Sarah Chen', avatar: '' },
      { id: '2', name: 'Alex Rivera', avatar: '' },
    ],
    budget: 3500,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
  };

  const mockUser: UserType = {
    id: '1',
    name: 'Sarah Chen',
    avatar: '',
  };

  const mockMessage: Message = {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: '1',
    text: 'Hey! Are we still on for Tokyo next month?',
    timestamp: new Date('2024-01-20T10:30:00'),
    read: true,
  };

  const mockActivity: Activity = {
    id: 'act-1',
    userId: '1',
    type: 'trip_created',
    data: { tripName: 'Tokyo Adventure', destination: 'Tokyo, Japan' },
    timestamp: new Date('2024-01-20T10:00:00'),
  };

  switch (componentId) {
    case 'TripTimelineCard':
      return <TripTimelineCardExample trip={mockTrip} mini={mini} />;

    case 'TripCardVariants':
      return <TripCardVariantsExample mini={mini} />;

    case 'MessageBubble':
      return <MessageBubbleExample message={mockMessage} mini={mini} />;

    case 'MessageBubbleVariants':
      return <MessageBubbleVariantsExample mini={mini} />;

    case 'ConversationItem':
      return <ConversationItemExample mini={mini} />;

    case 'ActivityCard':
      return <ActivityCardExample activity={mockActivity} mini={mini} />;

    case 'TabsComponent':
      return <TabsComponentExample mini={mini} />;

    case 'SettingsItem':
      return <SettingsItemExample mini={mini} />;

    case 'DateBadge':
      return <DateBadgeExample mini={mini} />;

    case 'AvatarGroup':
      return <AvatarGroupExample mini={mini} />;

    case 'StatusBadges':
      return <StatusBadgesExample mini={mini} />;

    case 'Buttons':
      return <ButtonsExample mini={mini} />;

    case 'CityCard':
      return <CityCardExample mini={mini} />;

    default:
      return <div className="text-text-secondary">Component preview not available</div>;
  }
}

// ============================================================================
// Component Examples
// ============================================================================

function TripTimelineCardExample({ trip, mini }: { trip: Trip; mini?: boolean }) {
  return (
    <div className={mini ? '' : 'space-y-4'}>
      <div className="relative flex gap-3 p-4 rounded-2xl border bg-accent-cyan/10 border-accent-cyan/30 hover:scale-[1.02] transition-all">
        {/* Date Badge */}
        <div className="flex-shrink-0 w-16 flex flex-col items-center justify-center bg-gradient-to-br from-accent-teal to-accent-cyan rounded-xl p-2 text-background">
          <div className="text-2xl font-bold leading-none">15</div>
          <div className="text-[10px] uppercase font-semibold mt-0.5">Jun</div>
        </div>

        {/* Trip Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-semibold text-text-primary">{trip.name}</h3>
            <span className="text-xs text-text-secondary whitespace-nowrap">8d</span>
          </div>

          <div className="flex items-center gap-1.5 text-text-secondary text-sm mb-2">
            <MapPin size={14} />
            <span>{trip.destination}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Users size={14} className="text-text-secondary" />
              <div className="flex -space-x-1.5">
                {trip.travelers.map((traveler, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-background bg-gradient-to-br from-accent-teal to-accent-cyan flex items-center justify-center text-white text-[10px] font-semibold"
                  >
                    {traveler.name.charAt(0)}
                  </div>
                ))}
              </div>
            </div>
            <ArrowRight size={16} className="text-text-secondary" />
          </div>
        </div>
      </div>

      {!mini && (
        <div className="text-sm text-text-secondary mt-4">
          <p className="mb-2"><strong>Usage:</strong> Timeline card for trip lists with date badge and traveler avatars</p>
          <p><strong>States:</strong> upcoming (cyan), planning (teal), completed (gray)</p>
        </div>
      )}
    </div>
  );
}

function TripCardVariantsExample({ mini }: { mini?: boolean }) {
  const variants = [
    { status: 'upcoming', label: 'Upcoming', bgClass: 'bg-accent-cyan/10 border-accent-cyan/30' },
    { status: 'planning', label: 'Planning', bgClass: 'bg-accent-teal/10 border-accent-teal/30' },
    { status: 'completed', label: 'Completed', bgClass: 'bg-text-secondary/10 border-text-secondary/20' },
  ];

  return (
    <div className={mini ? 'space-y-2' : 'space-y-4'}>
      {variants.map((variant) => (
        <div key={variant.status} className={`p-3 rounded-xl border ${variant.bgClass}`}>
          <div className="text-sm font-medium text-text-primary">{variant.label}</div>
        </div>
      ))}
    </div>
  );
}

function MessageBubbleExample({ message, mini }: { message: Message; mini?: boolean }) {
  return (
    <div className={mini ? '' : 'space-y-4'}>
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-teal to-accent-cyan flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
          S
        </div>
        <div className="flex-1">
          <div className="bg-surface border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
            <p className="text-text-primary text-sm">{message.text}</p>
          </div>
          <p className="text-xs text-text-secondary mt-1 ml-1">10:30 AM</p>
        </div>
      </div>

      {!mini && (
        <div className="text-sm text-text-secondary mt-4">
          <p className="mb-2"><strong>Usage:</strong> Chat message bubble with sender avatar</p>
          <p><strong>Variants:</strong> Sent (right-aligned, gradient), Received (left-aligned, surface)</p>
        </div>
      )}
    </div>
  );
}

function MessageBubbleVariantsExample({ mini }: { mini?: boolean }) {
  return (
    <div className="space-y-3">
      {/* Received */}
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-teal to-accent-cyan flex items-center justify-center text-white text-sm font-semibold">
          A
        </div>
        <div className="bg-surface border border-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5">
          <p className="text-text-primary text-sm">Received message</p>
        </div>
      </div>

      {/* Sent */}
      <div className="flex gap-3 justify-end">
        <div className="bg-gradient-to-r from-accent-teal to-accent-cyan rounded-2xl rounded-tr-sm px-4 py-2.5">
          <p className="text-background text-sm">Sent message</p>
        </div>
      </div>
    </div>
  );
}

function ConversationItemExample({ mini }: { mini?: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-3 p-4 hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-teal to-accent-cyan flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-background" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-text-primary">Alex Rivera</h3>
            <span className="text-xs text-text-secondary">2h ago</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary truncate">Can't wait for the trip!</p>
            <div className="flex-shrink-0 w-5 h-5 bg-accent-cyan rounded-full flex items-center justify-center text-background text-xs font-semibold ml-2">
              2
            </div>
          </div>
        </div>
      </div>

      {!mini && (
        <div className="text-sm text-text-secondary mt-4">
          <p><strong>Usage:</strong> Conversation list item with avatar, preview, unread badge</p>
        </div>
      )}
    </div>
  );
}

function ActivityCardExample({ activity, mini }: { activity: Activity; mini?: boolean }) {
  return (
    <div>
      <div className="flex gap-3 p-4 bg-surface rounded-xl border border-white/5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-teal to-accent-cyan flex items-center justify-center flex-shrink-0">
          <Plane size={18} className="text-background" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-primary mb-1">
            <span className="font-semibold">Sarah Chen</span> created a new trip
          </p>
          <p className="text-sm text-accent-cyan">Tokyo Adventure → Tokyo, Japan</p>
          <p className="text-xs text-text-secondary mt-2">2 hours ago</p>
        </div>
      </div>

      {!mini && (
        <div className="text-sm text-text-secondary mt-4">
          <p><strong>Usage:</strong> Activity feed card with icon and user action</p>
        </div>
      )}
    </div>
  );
}

function TabsComponentExample({ mini }: { mini?: boolean }) {
  const tabs = [
    { id: 'all', label: 'All', count: 24 },
    { id: 'upcoming', label: 'Upcoming', count: 5 },
    { id: 'past', label: 'Past', count: 15 },
  ];

  return (
    <div>
      <Tabs tabs={tabs} activeTab="all" onChange={() => {}} />

      {!mini && (
        <div className="text-sm text-text-secondary mt-4">
          <p><strong>Usage:</strong> Animated tab navigation with counts and gradient active state</p>
        </div>
      )}
    </div>
  );
}

function SettingsItemExample({ mini }: { mini?: boolean }) {
  return (
    <div>
      <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
        <button className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
          <div className="flex-shrink-0 text-accent-cyan">
            <User size={20} />
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="font-medium text-text-primary">Profile</p>
            <p className="text-sm text-text-secondary truncate">Edit your personal information</p>
          </div>
          <ChevronRight size={20} className="text-text-secondary" />
        </button>
      </div>

      {!mini && (
        <div className="text-sm text-text-secondary mt-4">
          <p><strong>Usage:</strong> Settings list item with icon, label, description, and chevron</p>
        </div>
      )}
    </div>
  );
}

function DateBadgeExample({ mini }: { mini?: boolean }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-16 flex flex-col items-center justify-center bg-gradient-to-br from-accent-teal to-accent-cyan rounded-xl p-2 text-background">
        <div className="text-2xl font-bold leading-none">15</div>
        <div className="text-[10px] uppercase font-semibold mt-0.5">Jun</div>
      </div>

      {!mini && (
        <div className="text-sm text-text-secondary flex items-center">
          <p><strong>Usage:</strong> Date badge for timeline cards</p>
        </div>
      )}
    </div>
  );
}

function AvatarGroupExample({ mini }: { mini?: boolean }) {
  const users = ['S', 'A', 'M'];

  return (
    <div>
      <div className="flex -space-x-2">
        {users.map((initial, i) => (
          <div
            key={i}
            className="w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br from-accent-teal to-accent-cyan flex items-center justify-center text-white font-semibold"
          >
            {initial}
          </div>
        ))}
        <div className="w-10 h-10 rounded-full border-2 border-background bg-white/10 flex items-center justify-center text-text-secondary text-sm font-semibold">
          +2
        </div>
      </div>

      {!mini && (
        <div className="text-sm text-text-secondary mt-4">
          <p><strong>Usage:</strong> Overlapping avatar group with overflow count</p>
        </div>
      )}
    </div>
  );
}

function StatusBadgesExample({ mini }: { mini?: boolean }) {
  return (
    <div className="flex gap-2 flex-wrap">
      <span className="px-3 py-1 bg-accent-cyan/20 text-accent-cyan text-xs font-semibold rounded-full">
        Upcoming
      </span>
      <span className="px-3 py-1 bg-accent-teal/20 text-accent-teal text-xs font-semibold rounded-full">
        Planning
      </span>
      <span className="px-3 py-1 bg-text-secondary/20 text-text-secondary text-xs font-semibold rounded-full">
        Completed
      </span>

      {!mini && (
        <div className="w-full text-sm text-text-secondary mt-2">
          <p><strong>Usage:</strong> Status pills for various states</p>
        </div>
      )}
    </div>
  );
}

function ButtonsExample({ mini }: { mini?: boolean }) {
  return (
    <div className="space-y-3">
      <button className="w-full px-6 py-3 bg-gradient-to-r from-accent-teal to-accent-cyan text-background rounded-2xl font-medium hover:scale-105 transition-transform">
        Primary Button
      </button>
      <button className="w-full px-6 py-3 bg-surface border border-white/10 text-text-primary rounded-2xl font-medium hover:bg-white/5 transition-colors">
        Secondary Button
      </button>
      <button className="w-full px-6 py-3 border border-accent-cyan text-accent-cyan rounded-2xl font-medium hover:bg-accent-cyan/10 transition-colors">
        Outline Button
      </button>

      {!mini && (
        <div className="text-sm text-text-secondary mt-4">
          <p><strong>Usage:</strong> Button variants with different styles</p>
        </div>
      )}
    </div>
  );
}

function CityCardExample({ mini }: { mini?: boolean }) {
  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl aspect-[4/3] cursor-pointer group">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-teal to-accent-cyan" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-bold text-text-primary mb-2">Tokyo</h3>
          <div className="flex items-center gap-4 text-text-secondary text-sm">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>8 places</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart size={14} />
              <span>24 saved</span>
            </div>
          </div>
        </div>
      </div>

      {!mini && (
        <div className="text-sm text-text-secondary mt-4">
          <p><strong>Usage:</strong> City card with gradient overlay and stats</p>
        </div>
      )}
    </div>
  );
}
