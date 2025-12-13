import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import type { City, Place } from '@/types';
import { BottomSheet } from './ui/BottomSheet';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

interface CityDetailSheetProps {
  city: City;
  places: Place[];
  isOpen: boolean;
  onClose: () => void;
}

export function CityDetailSheet({ city, places, isOpen, onClose }: CityDetailSheetProps) {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  // Filter places for this city
  const cityPlaces = places.filter(p => p.cityId === city.id);

  // Map cities to their corresponding trips
  const cityToTripMap: Record<string, string> = {
    'lisbon': 'trip-1',
    'tokyo': 'trip-2',
    'barcelona': 'trip-3',
    'mexico-city': 'trip-4',
    'paris': 'trip-5',
  };

  const tripId = cityToTripMap[city.id] || 'trip-1'; // fallback to trip-1 if not found

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <div>
        {/* Hero Image */}
        <div className="relative">
          {city.imageUrl && !imageError ? (
            <div className="relative h-32 overflow-hidden rounded-t-3xl">
              <img
                src={city.imageUrl}
                alt={city.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-0.5">{city.name}</h2>
                    <p className="text-white/80 text-sm">{city.country}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-32 bg-gradient-to-br from-accent-teal/20 to-accent-cyan/20 flex items-center justify-center rounded-t-3xl">
              <MapPin size={48} className="text-text-secondary opacity-30" />
            </div>
          )}
        </div>

      {/* Content */}
      <div className="px-4 pt-3 pb-4 space-y-2.5">
        {/* Description */}
        <div>
          <p className="text-text-secondary text-sm leading-relaxed">{city.description}</p>
        </div>

        {/* Tags */}
        <div>
          <h3 className="text-xs font-semibold text-text-primary mb-2">Highlights</h3>
          <div className="flex flex-wrap gap-1.5">
            {city.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-accent-cyan/10 rounded-full text-xs text-accent-cyan border border-accent-cyan/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-surface rounded-xl border border-white/5">
            <div className="flex items-center gap-1.5 text-text-secondary mb-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs">Places</span>
            </div>
            <p className="text-xl font-bold text-text-primary">{cityPlaces.length}</p>
          </div>
          <div className="p-2.5 bg-surface rounded-xl border border-white/5">
            <div className="flex items-center gap-1.5 text-text-secondary mb-0.5">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs">Suggested Stay</span>
            </div>
            <p className="text-xl font-bold text-text-primary">3-5 days</p>
          </div>
        </div>

        {/* CTA */}
        <motion.button
          onClick={() => navigate({ to: '/trips/$tripId', params: { tripId }, search: { tab: 'overview' } })}
          className="w-full py-2.5 bg-gradient-to-r from-accent-teal to-accent-cyan text-background rounded-2xl font-semibold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Plan Your Trip
        </motion.button>
      </div>
      </div>
    </BottomSheet>
  );
}
