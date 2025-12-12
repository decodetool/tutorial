import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Trip, ItineraryItem } from '@/types';

interface TripsState {
  trips: Trip[];
  itineraryItems: Record<string, ItineraryItem[]>;
  currentTripId: string | null;

  // Actions
  setTrips: (trips: Trip[]) => void;
  addTrip: (trip: Trip) => void;
  setCurrentTrip: (tripId: string | null) => void;
  setItinerary: (tripId: string, items: ItineraryItem[]) => void;
  addItineraryItem: (tripId: string, item: ItineraryItem) => void;
  updateItineraryItem: (tripId: string, itemId: string, updates: Partial<ItineraryItem>) => void;
  removeItineraryItem: (tripId: string, itemId: string) => void;
}

export const useTripsStore = create<TripsState>()(
  persist(
    (set) => ({
      trips: [],
      itineraryItems: {},
      currentTripId: null,

      setTrips: (trips) => set({ trips }),

      addTrip: (trip) => set((state) => ({
        trips: [...state.trips, trip]
      })),

      setCurrentTrip: (tripId) => set({ currentTripId: tripId }),

      setItinerary: (tripId, items) => set((state) => ({
        itineraryItems: { ...state.itineraryItems, [tripId]: items }
      })),

      addItineraryItem: (tripId, item) => set((state) => ({
        itineraryItems: {
          ...state.itineraryItems,
          [tripId]: [...(state.itineraryItems[tripId] || []), item]
        }
      })),

      updateItineraryItem: (tripId, itemId, updates) => set((state) => ({
        itineraryItems: {
          ...state.itineraryItems,
          [tripId]: state.itineraryItems[tripId]?.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          ) || []
        }
      })),

      removeItineraryItem: (tripId, itemId) => set((state) => ({
        itineraryItems: {
          ...state.itineraryItems,
          [tripId]: state.itineraryItems[tripId]?.filter(item => item.id !== itemId) || []
        }
      })),
    }),
    {
      name: 'trip-threads-trips',
    }
  )
);
