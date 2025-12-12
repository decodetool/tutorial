import { sleep } from './utils';
import { cities, places, sampleTrips, sampleItinerary, barcelonaItinerary, mockUsers } from './seed-data';
import type { City, Place, Trip, ItineraryItem, User } from '@/types';

// Simulate network latency
const LATENCY = 300;

export const mockApi = {
  // Cities
  async getCities(): Promise<City[]> {
    await sleep(LATENCY);
    return cities;
  },

  async getCity(id: string): Promise<City | null> {
    await sleep(LATENCY);
    return cities.find(c => c.id === id) || null;
  },

  // Places
  async getPlaces(cityId?: string): Promise<Place[]> {
    await sleep(LATENCY);
    if (cityId) {
      return places.filter(p => p.city === cityId);
    }
    return places;
  },

  async getPlace(id: string): Promise<Place | null> {
    await sleep(LATENCY);
    return places.find(p => p.id === id) || null;
  },

  async searchPlaces(query: string, cityId?: string): Promise<Place[]> {
    await sleep(LATENCY);
    const filtered = places.filter(p => {
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) ||
                          p.description.toLowerCase().includes(query.toLowerCase());
      const matchesCity = !cityId || p.city === cityId;
      return matchesQuery && matchesCity;
    });
    return filtered;
  },

  // Trips
  async getTrips(filter?: 'upcoming' | 'past' | 'shared'): Promise<Trip[]> {
    await sleep(LATENCY);

    if (filter === 'upcoming') {
      return sampleTrips.filter(t => t.status === 'upcoming' || t.status === 'planning');
    } else if (filter === 'past') {
      return sampleTrips.filter(t => t.status === 'completed');
    } else if (filter === 'shared') {
      return sampleTrips.filter(t => t.travelers.length > 1);
    }

    return sampleTrips;
  },

  async getTrip(id: string): Promise<Trip | null> {
    await sleep(LATENCY);
    return sampleTrips.find(t => t.id === id) || null;
  },

  async createTrip(trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trip> {
    await sleep(LATENCY);
    const now = new Date().toISOString();
    return {
      ...trip,
      id: `trip-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
  },

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
    await sleep(LATENCY);
    const existing = sampleTrips.find(t => t.id === id);
    if (!existing) throw new Error('Trip not found');
    return {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  },

  // Users
  async getUsers(): Promise<User[]> {
    await sleep(LATENCY);
    return mockUsers;
  },

  async getUser(id: string): Promise<User | null> {
    await sleep(LATENCY);
    return mockUsers.find(u => u.id === id) || null;
  },

  // Itinerary
  async getItinerary(tripId: string): Promise<ItineraryItem[]> {
    await sleep(LATENCY);
    if (tripId === 'trip-1') {
      return sampleItinerary;
    }
    if (tripId === 'trip-3') {
      return barcelonaItinerary;
    }
    return [];
  },

  async addItineraryItem(item: Omit<ItineraryItem, 'id'>): Promise<ItineraryItem> {
    await sleep(LATENCY);
    return {
      ...item,
      id: `item-${Date.now()}`,
    };
  },

  async updateItineraryItem(id: string, updates: Partial<ItineraryItem>): Promise<ItineraryItem> {
    await sleep(LATENCY);
    const existing = sampleItinerary.find(i => i.id === id);
    if (!existing) throw new Error('Item not found');
    return { ...existing, ...updates };
  },

  async deleteItineraryItem(_id: string): Promise<void> {
    await sleep(LATENCY);
  },
};
