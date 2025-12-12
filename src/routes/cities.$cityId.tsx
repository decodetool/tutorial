import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { mockApi } from '@/lib/mock-api';
import { ArrowLeft, MapPin, Plus, Star } from 'lucide-react';
import { useState } from 'react';
import { PlaceDetailSheet } from '@/components/PlaceDetailSheet';
import type { Category } from '@/types';

export const Route = createFileRoute('/cities/$cityId')({
  component: CityDetailComponent,
  beforeLoad: ({ params }) => {
    document.title = `City - Journeys`;
  },
});

const categoryColors: Record<Category, string> = {
  food: '#FF6B6B',
  museum: '#4ECDC4',
  cafe: '#FFE66D',
  landmark: '#95E1D3',
  transit: '#A8E6CF',
  nightlife: '#C7CEEA',
  shopping: '#FFDAC1',
};

const categoryEmoji: Record<Category, string> = {
  food: '🍽️',
  museum: '🏛️',
  cafe: '☕',
  landmark: '🗿',
  transit: '🚇',
  nightlife: '🌃',
  shopping: '🛍️',
};

function CityDetailComponent() {
  const { cityId } = Route.useParams();
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  const { data: cities } = useQuery({
    queryKey: ['cities'],
    queryFn: () => mockApi.getCities(),
  });

  const { data: allPlaces } = useQuery({
    queryKey: ['places'],
    queryFn: () => mockApi.getPlaces(),
  });

  const city = cities?.find(c => c.id === cityId);
  const cityPlaces = allPlaces?.filter(p => p.city === cityId);

  const selectedPlace = cityPlaces?.find(p => p.id === selectedPlaceId);

  if (!city) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary">City not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-br from-accent-teal/20 to-accent-cyan/20">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        {/* Back Button */}
        <Link to="/discover">
          <motion.button
            className="absolute top-12 left-6 p-2 bg-background/80 backdrop-blur-sm rounded-xl border border-white/10"
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </motion.button>
        </Link>

        {/* City Info */}
        <div className="absolute bottom-6 left-6 right-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-text-primary mb-2">{city.name}</h1>
            <p className="text-text-secondary">{city.country}</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 mt-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Places" value={String(cityPlaces?.length || 0)} />
          <StatCard label="Rating" value="4.8" />
          <StatCard label="Visitors" value="1.2M" />
        </div>

        {/* Description */}
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-3">About {city.name}</h2>
          <p className="text-text-secondary leading-relaxed">
            {city.description}
          </p>
        </div>

        {/* Tags */}
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-3">Highlights</h2>
          <div className="flex flex-wrap gap-2">
            {city.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-surface rounded-full text-sm text-text-primary border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Places */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">
              Places to Visit ({cityPlaces?.length || 0})
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {cityPlaces?.map((place, index) => (
              <motion.div
                key={place.id}
                onClick={() => setSelectedPlaceId(place.id)}
                className="bg-surface rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                {/* Image */}
                <div className="h-32 relative overflow-hidden">
                  {place.imageUrl ? (
                    <>
                      <img
                        src={place.imageUrl}
                        alt={place.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div
                        className="hidden w-full h-full items-center justify-center text-4xl absolute inset-0"
                        style={{ backgroundColor: categoryColors[place.category] + '30' }}
                      >
                        {categoryEmoji[place.category]}
                      </div>
                    </>
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-4xl"
                      style={{ backgroundColor: categoryColors[place.category] + '30' }}
                    >
                      {categoryEmoji[place.category]}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="text-text-primary font-semibold text-sm mb-1 truncate">
                    {place.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary capitalize">{place.category}</span>
                    <div className="flex items-center gap-1 text-text-secondary">
                      <Star className="w-3 h-3 fill-current" />
                      <span>4.{Math.floor(Math.random() * 3) + 6}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link to="/itinerary">
          <motion.button
            className="w-full py-4 bg-gradient-to-r from-accent-teal to-accent-cyan text-background rounded-2xl font-medium flex items-center justify-center gap-2 mt-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            Start Planning Trip
          </motion.button>
        </Link>
      </div>

      {/* Place Detail Sheet */}
      {selectedPlace && (
        <PlaceDetailSheet
          place={selectedPlace}
          isOpen={!!selectedPlaceId}
          onClose={() => setSelectedPlaceId(null)}
          categoryColor={categoryColors[selectedPlace.category]}
          categoryEmoji={categoryEmoji[selectedPlace.category]}
        />
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      className="bg-surface rounded-2xl p-4 border border-white/5 text-center"
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <p className="text-2xl font-bold text-text-primary font-mono">{value}</p>
      <p className="text-text-secondary text-xs mt-1">{label}</p>
    </motion.div>
  );
}
