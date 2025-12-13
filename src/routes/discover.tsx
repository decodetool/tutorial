import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { mockApi } from '@/lib/mock-api';
import type { City } from '@/types';
import { Search, MapPin, X } from 'lucide-react';
import { CityCardSkeleton } from '@/components/LoadingSkeleton';
import { CityDetailSheet } from '@/components/CityDetailSheet';
import { PlaceDetailSheet } from '@/components/PlaceDetailSheet';
import { useState } from 'react';

export const Route = createFileRoute('/discover')({
  component: DiscoverComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      city: (search.city as string) || undefined,
      place: (search.place as string) || undefined,
    };
  },
  beforeLoad: () => {
    document.title = 'Discover - Journeys';
  },
});

function DiscoverComponent() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/discover' });

  const { data: cities, isLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: () => mockApi.getCities(),
  });

  const { data: allPlaces } = useQuery({
    queryKey: ['places'],
    queryFn: () => mockApi.getPlaces(),
  });

  const seasons = ['Winter Escapes', 'Spring Blooms', 'Summer Vibes', 'Fall Colors'];
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get selected city and place from URL params
  const selectedCity = cities?.find(c => c.id === searchParams.city);
  const selectedPlace = allPlaces?.find(p => p.id === searchParams.place);

  // Map seasons to cities that fit the theme
  const seasonToCitiesMap: Record<number, string[]> = {
    0: ['tokyo', 'istanbul', 'mexico-city'], // Winter Escapes - cities great in winter
    1: ['paris', 'barcelona', 'lisbon'], // Spring Blooms - cities with spring attractions
    2: ['barcelona', 'lisbon', 'bangkok'], // Summer Vibes - beach/summer destinations
    3: ['tokyo', 'paris', 'mexico-city', 'istanbul'], // Fall Colors - cities with autumn beauty
  };

  const filteredCities = cities?.filter(city => {
    // Filter by search query
    const matchesSearch = searchQuery === '' ||
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filter by selected season (if one is selected)
    const matchesSeason = selectedSeason === null || seasonToCitiesMap[selectedSeason]?.includes(city.id);

    return matchesSearch && matchesSeason;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <header className="px-6 pt-12 pb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Discover</h1>
          <p className="text-text-secondary">Find your next adventure</p>
        </header>
        <div className="px-6 pb-24 space-y-6">
          {[1, 2, 3].map(i => (
            <CityCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-6 pt-12 pb-4">
        <motion.h1
          className="text-3xl font-bold text-text-primary mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Discover
        </motion.h1>
        <p className="text-text-secondary mb-4">Find your next adventure</p>

        {/* Search Bar */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search cities, countries, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3 bg-surface rounded-2xl border border-white/5 text-text-primary placeholder-text-secondary focus:border-accent-cyan focus:outline-none transition-colors"
          />
          {searchQuery && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-text-secondary" />
            </motion.button>
          )}
        </motion.div>
      </header>

      {/* Seasonal Filter Chips */}
      <div className="pb-6 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-6">
          {seasons.map((season, index) => (
            <motion.button
              key={season}
              onClick={() => setSelectedSeason(selectedSeason === index ? null : index)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedSeason === index
                  ? 'bg-accent-cyan text-background'
                  : 'bg-surface text-text-secondary border border-white/10 hover:border-white/20'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {season}
            </motion.button>
          ))}
        </div>
      </div>

      {/* City Cards */}
      <div className="px-6 pb-24">
        <AnimatePresence mode="popLayout">
          {filteredCities && filteredCities.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredCities.map((city, index) => (
                <CityCard key={city.id} city={city} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <MapPin className="w-16 h-16 text-text-secondary/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">No cities found</h3>
              <p className="text-text-secondary">Try adjusting your search query</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* City Detail Sheet */}
      {selectedCity && (
        <CityDetailSheet
          city={selectedCity}
          places={allPlaces || []}
          isOpen={!!searchParams.city}
          onClose={() => navigate({ to: '/discover', search: {} })}
          onPlaceClick={(placeId) => navigate({ to: '/discover', search: { city: searchParams.city, place: placeId } })}
        />
      )}

      {/* Place Detail Sheet */}
      {selectedPlace && (
        <PlaceDetailSheet
          place={selectedPlace}
          isOpen={!!searchParams.place}
          onClose={() => navigate({ to: '/discover', search: { city: searchParams.city } })}
          categoryColor="#4ECDC4"
          categoryEmoji="📍"
        />
      )}
    </div>
  );
}

function CityCard({ city, index }: { city: City; index: number }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate({ to: '/discover', search: { city: city.id } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Card */}
      <div
        onClick={handleCardClick}
        className="relative overflow-hidden rounded-3xl bg-surface border border-white/5 hover:border-white/10 transition-all cursor-pointer"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {city.imageUrl ? (
            <>
              <img
                src={city.imageUrl}
                alt={city.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="hidden absolute inset-0 bg-gradient-to-br from-accent-teal/20 to-accent-cyan/20 items-center justify-center">
                <MapPin size={48} className="text-text-secondary opacity-30" />
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent-teal/20 to-accent-cyan/20 flex items-center justify-center">
              <MapPin size={48} className="text-text-secondary opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

          {/* City name overlay */}
          <div className="absolute bottom-4 left-4 z-20">
            <h3 className="text-2xl font-bold text-white mb-1">{city.name}</h3>
            <p className="text-sm text-white/80">{city.country}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-text-secondary text-sm mb-4 line-clamp-2">
            {city.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {city.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/5 rounded-full text-xs text-text-secondary border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <motion.button
            className="mt-4 w-full py-3 bg-gradient-to-r from-accent-teal to-accent-cyan text-background rounded-2xl font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Plan Trip
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
