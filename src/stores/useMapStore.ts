import { create } from 'zustand';
import type { Category } from '@/types';

interface MapState {
  selectedPlaceId: string | null;
  activeFilters: Category[];

  // Actions
  setSelectedPlaceId: (id: string | null) => void;
  toggleFilter: (category: Category) => void;
  clearFilters: () => void;
}

export const useMapStore = create<MapState>()((set) => ({
  selectedPlaceId: null,
  activeFilters: [],

  setSelectedPlaceId: (id) => set({ selectedPlaceId: id }),

  toggleFilter: (category) => set((state) => ({
    activeFilters: state.activeFilters.includes(category)
      ? state.activeFilters.filter(c => c !== category)
      : [...state.activeFilters, category]
  })),

  clearFilters: () => set({ activeFilters: [] }),
}));
