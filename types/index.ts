export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

export interface PrayerTime {
  name: string;
  arabicName: string;
  time: string;
  minutesSinceMidnight: number;
  timeRemaining: string;
}

export interface Mosque {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  prayerTimes: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  facilities: string[];
  imageUrl: string;
  latitude: number;
  longitude: number;
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  imageUrl?: string;
  halalStatus: 'halal' | 'haram' | 'doubtful';
  certification?: string;
  certificationNumber?: string;
  certificationExpiry?: string;
  category?: string;
  ingredients?: string;
  nutritionalInfo?: Record<string, string>;
  manufacturer?: string;
  countryOfOrigin?: string;
  manufacturerContact?: string;
  scanDate: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  address: string;
  distance: string;
  priceRange: string;
  imageUrl: string;
  halalStatus: 'fully-halal' | 'halal-options' | 'halal-certified';
  openingHours: {
    open: string;
    close: string;
  };
  latitude: number;
  longitude: number;
}

export interface Stream {
  id: string;
  title: string;
  description: string;
  mosqueName: string;
  mosqueId: string;
  mosqueLocation?: string;
  imamName?: string;
  thumbnailUrl: string;
  streamUrl: string;
  viewCount: number;
  likes?: number;
  startTime: string;
  endTime?: string;
  type: 'live' | 'upcoming' | 'recorded';
  category?: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  imageUri?: string;
}