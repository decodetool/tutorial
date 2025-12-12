export type Category = 'food' | 'museum' | 'cafe' | 'landmark' | 'transit' | 'nightlife' | 'shopping';

export interface Place {
  id: string;
  name: string;
  city: string;
  category: Category;
  description: string;
  lat: number;
  lng: number;
  imageUrl?: string;
}

export interface ItineraryItem {
  id: string;
  placeId: string;
  date: string;
  startTime: string;
  duration: number; // minutes
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface Trip {
  id: string;
  name: string;
  destination: string; // City name or custom destination
  cityId?: string; // Optional reference to a City
  startDate: string;
  endDate: string;
  coverImage?: string;
  travelers: User[];
  budget?: number;
  status: 'planning' | 'upcoming' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  description: string;
  tags: string[];
  imageUrl: string;
  lat: number;
  lng: number;
}

export interface SharedTrip {
  tripId: string;
  role: 'owner' | 'editor' | 'viewer';
  sharedWith: {
    id: string;
    name: string;
    avatar?: string;
  }[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: 'trip_created' | 'place_saved' | 'trip_completed' | 'friend_added' | 'trip_shared';
  data: {
    tripId?: string;
    tripName?: string;
    placeId?: string;
    placeName?: string;
    friendId?: string;
    friendName?: string;
  };
  timestamp: string;
}

export interface FriendRequest {
  id: string;
  fromUser: User;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
}
