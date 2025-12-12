import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { mockApi } from '@/lib/mock-api';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';
import type { ItineraryItem, Place } from '@/types';

export const Route = createFileRoute('/itinerary')({
  component: ItineraryComponent,
  beforeLoad: () => {
    document.title = 'Itinerary - Journeys';
  },
});

function ItineraryComponent() {
  const tripId = 'trip-1'; // Using sample trip

  const { data: trip } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => mockApi.getTrip(tripId),
  });

  const { data: itineraryItems } = useQuery({
    queryKey: ['itinerary', tripId],
    queryFn: () => mockApi.getItinerary(tripId),
  });

  const { data: allPlaces } = useQuery({
    queryKey: ['places'],
    queryFn: () => mockApi.getPlaces(),
  });

  // Group items by date
  const itemsByDate = groupByDate(itineraryItems || []);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 border-b border-white/5">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-text-primary mb-2">{trip?.name || 'Itinerary'}</h1>
          <p className="text-text-secondary">
            {trip && formatDateRange(trip.startDate, trip.endDate)}
          </p>
        </motion.div>
      </header>

      {/* Itinerary by Day */}
      <div className="px-6 pt-6 space-y-8">
        {Object.entries(itemsByDate).map(([date, items], dayIndex) => (
          <DaySection
            key={date}
            date={date}
            dayNumber={dayIndex + 1}
            items={items}
            places={allPlaces || []}
          />
        ))}

        {/* Empty State */}
        {(!itineraryItems || itineraryItems.length === 0) && (
          <motion.div
            className="flex flex-col items-center justify-center py-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Calendar className="w-16 h-16 text-text-secondary/30 mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No plans yet</h3>
            <p className="text-text-secondary mb-6">Start adding places to your itinerary</p>
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-accent-teal to-accent-cyan text-background rounded-2xl font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Add Place
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Floating FAB */}
      {itineraryItems && itineraryItems.length > 0 && (
        <motion.button
          className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-accent-teal to-accent-cyan rounded-full shadow-glow-cyan flex items-center justify-center z-40"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Plus className="w-6 h-6 text-background" />
        </motion.button>
      )}
    </div>
  );
}

function DaySection({
  date,
  dayNumber,
  items,
  places,
}: {
  date: string;
  dayNumber: number;
  items: ItineraryItem[];
  places: Place[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: dayNumber * 0.1 }}
    >
      {/* Day Header */}
      <div className="mb-4">
        <p className="text-text-primary font-semibold text-lg">
          {new Date(date).toLocaleDateString('en-US', { weekday: 'long' })} (Day {dayNumber})
        </p>
        <p className="text-text-secondary text-sm">
          {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-3 pl-5">
        {items.map((item, index) => {
          const place = places.find(p => p.id === item.placeId);
          if (!place) return null;

          return (
            <ItineraryCard
              key={item.id}
              item={item}
              place={place}
              isLast={index === items.length - 1}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

function ItineraryCard({
  item,
  place,
  isLast,
}: {
  item: ItineraryItem;
  place: Place;
  isLast: boolean;
}) {
  const categoryIcons: Record<string, string> = {
    food: '🍽️',
    museum: '🏛️',
    cafe: '☕',
    landmark: '🗿',
    transit: '🚇',
    nightlife: '🌃',
    shopping: '🛍️',
  };

  return (
    <motion.div
      className="relative"
      whileHover={{ x: 4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[13px] top-8 bottom-0 w-0.5 bg-white/10" />
      )}

      {/* Timeline dot */}
      <div className="absolute left-2 top-6 w-2 h-2 bg-accent-teal rounded-full" />

      {/* Card */}
      <div className="ml-6 bg-surface rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{categoryIcons[place.category]}</span>
            <div>
              <h4 className="text-text-primary font-semibold">{place.name}</h4>
              <p className="text-text-secondary text-sm">{place.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-text-secondary text-sm">
            <Clock className="w-4 h-4" />
            <span>{item.startTime}</span>
          </div>
        </div>

        {item.notes && (
          <p className="text-text-secondary text-sm mt-2 p-2 bg-white/5 rounded-lg">
            💡 {item.notes}
          </p>
        )}

        <div className="flex items-center gap-4 mt-3 text-xs text-text-secondary">
          <span>{item.duration} min</span>
          <button className="flex items-center gap-1 hover:text-text-primary transition-colors">
            <MapPin className="w-3 h-3" />
            View on map
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function groupByDate(items: ItineraryItem[]): Record<string, ItineraryItem[]> {
  return items.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = [];
    }
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, ItineraryItem[]>);
}

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return `${days} days • ${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}
