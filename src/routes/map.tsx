import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { mockApi } from '@/lib/mock-api';
import { useMapStore } from '@/stores/useMapStore';
import { Filter } from 'lucide-react';
import type { Category } from '@/types';
import { Map } from '@/components/Map';
import { PlaceDetailSheet } from '@/components/PlaceDetailSheet';

export const Route = createFileRoute('/map')({
  component: MapComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      place: (search.place as string) || undefined,
    };
  },
  beforeLoad: () => {
    document.title = 'Map - Journeys';
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

function MapComponent() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/map' });

  const { data: places } = useQuery({
    queryKey: ['places'],
    queryFn: () => mockApi.getPlaces(),
  });

  const { activeFilters, toggleFilter, selectedPlaceId, setSelectedPlaceId } = useMapStore();
  const [showFilters, setShowFilters] = useState(false);

  // Sync URL param with selected place
  useEffect(() => {
    if (searchParams.place && searchParams.place !== selectedPlaceId) {
      setSelectedPlaceId(searchParams.place);
    } else if (!searchParams.place && selectedPlaceId) {
      // Clear selectedPlaceId when URL param is removed
      setSelectedPlaceId(null);
    }
  }, [searchParams.place, selectedPlaceId, setSelectedPlaceId]);

  const filteredPlaces = places?.filter(
    place => activeFilters.length === 0 || activeFilters.includes(place.category)
  );

  const categories: Category[] = ['food', 'museum', 'cafe', 'landmark', 'transit', 'nightlife', 'shopping'];

  const selectedPlace = filteredPlaces?.find(p => p.id === selectedPlaceId);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 bg-background z-10 shrink-0">
        <div className="flex items-center gap-3">
          <motion.h1
            className="text-3xl font-bold text-text-primary"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Map
          </motion.h1>

          {/* Filter Button */}
          <motion.button
            className="p-2 bg-surface rounded-xl border border-white/5 hover:border-white/20 transition-all relative"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5 text-text-primary" />
            {activeFilters.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-cyan rounded-full text-xs flex items-center justify-center text-background font-bold">
                {activeFilters.length}
              </span>
            )}
          </motion.button>
        </div>

        {/* Filter Chips */}
        {showFilters && (
          <motion.div
            className="mt-4 flex flex-wrap gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {categories.map(category => {
              const isActive = activeFilters.includes(category);
              return (
                <motion.button
                  key={category}
                  onClick={() => toggleFilter(category)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'text-background border-2'
                      : 'bg-surface text-text-secondary border border-white/10 hover:border-white/20'
                  }`}
                  style={isActive ? {
                    backgroundColor: categoryColors[category],
                    borderColor: categoryColors[category],
                  } : {}}
                  whileTap={{ scale: 0.95 }}
                >
                  {categoryEmoji[category]} {category}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </header>

      {/* Map */}
      <div className="relative bg-surface-secondary" style={{ height: '62.5vh' }}>
        {filteredPlaces && (
          <Map
            places={filteredPlaces}
            selectedPlaceId={selectedPlaceId}
            onPlaceClick={(id) => {
              setSelectedPlaceId(id);
              navigate({ search: { place: id } });
            }}
            categoryColors={categoryColors}
            categoryEmoji={categoryEmoji}
            flyToPlace={true}
          />
        )}
      </div>

      {/* Place List */}
      <div className="flex-1 bg-background border-t border-white/5 overflow-y-auto custom-scrollbar">
        <div className="px-6 py-4 space-y-2">
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            Saved Places ({filteredPlaces?.length || 0})
          </h3>
          {filteredPlaces?.map((place, index) => (
            <motion.div
              key={place.id}
              onClick={() => {
                setSelectedPlaceId(place.id);
                navigate({ search: { place: place.id } });
              }}
              className={`flex items-center gap-3 p-3 bg-surface rounded-xl border transition-all cursor-pointer ${
                selectedPlaceId === place.id
                  ? 'border-accent-cyan'
                  : 'border-white/5 hover:border-white/10'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ x: 4 }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: categoryColors[place.category] }}
              >
                <span className="text-lg">{categoryEmoji[place.category]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text-primary font-medium text-sm truncate">{place.name}</p>
                <p className="text-text-secondary text-xs">{place.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Place Detail Sheet */}
      {selectedPlace && (
        <PlaceDetailSheet
          place={selectedPlace}
          isOpen={!!searchParams.place}
          onClose={() => {
            navigate({ search: { place: undefined } });
            setSelectedPlaceId(null);
          }}
          categoryColor={categoryColors[selectedPlace.category]}
          categoryEmoji={categoryEmoji[selectedPlace.category]}
        />
      )}
    </div>
  );
}
