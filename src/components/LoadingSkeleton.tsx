import { motion } from 'framer-motion';

export function CityCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-surface border border-white/5">
      {/* Image Skeleton */}
      <div className="relative h-48 bg-gradient-to-br from-white/5 to-white/10 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Content Skeleton */}
      <div className="p-5 space-y-4">
        {/* Description Lines */}
        <div className="space-y-2">
          <div className="h-4 bg-white/5 rounded-lg w-full" />
          <div className="h-4 bg-white/5 rounded-lg w-4/5" />
        </div>

        {/* Tags */}
        <div className="flex gap-2">
          <div className="h-6 bg-white/5 rounded-full w-16" />
          <div className="h-6 bg-white/5 rounded-full w-20" />
          <div className="h-6 bg-white/5 rounded-full w-14" />
        </div>

        {/* Button */}
        <div className="h-12 bg-white/5 rounded-2xl" />
      </div>
    </div>
  );
}

export function PlaceCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl overflow-hidden border border-white/5">
      {/* Image */}
      <div className="h-32 bg-gradient-to-br from-white/5 to-white/10 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="flex items-center justify-between">
          <div className="h-3 bg-white/5 rounded w-1/4" />
          <div className="h-3 bg-white/5 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-white/5">
      <div className="w-8 h-8 bg-white/5 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
      </div>
    </div>
  );
}
