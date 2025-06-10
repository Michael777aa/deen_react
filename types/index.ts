export type User = {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  role: 'user' | 'admin';
  language: string;
  createdAt: string;
  lastActive: string;
  preferences: {
    darkMode: boolean;
    notifications: boolean;
    prayerReminders: boolean;
    dailyQuote: boolean;
  };
  subscription: 'free' | 'premium';
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
};

export type PrayerTime = {
  name: string;
  time: string;
  arabicName: string;
};

export type DailyQuote = {
  text: string;
  source: string;
  reference?: string;
};

export type Language = {
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
};

export type AnalyticsData = {
  dailyActivity: number[];
  featureUsage: {
    name: string;
    count: number;
  }[];
  prayerTracking: {
    name: string;
    completed: number;
    total: number;
  }[];
};

export type Product = {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  imageUrl?: string;
  halalStatus: 'halal' | 'haram' | 'doubtful';
  certification?: string;
  certificationNumber?: string;
  certificationExpiry?: string;
  category: string;
  ingredients?: string;
  nutritionalInfo?: {
    [key: string]: string;
  };
  manufacturer?: string;
  countryOfOrigin?: string;
  manufacturerContact?: string;
  scanDate: string;
};

export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  phone?: string;
  website?: string;
  hours?: string;
  certification: string;
  description: string;
  rating: number;
  reviewCount: number;
  distance: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  featured: boolean;
  menuHighlights?: {
    name: string;
    price: string;
  }[];
};

export type Mosque = {
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
};

export type Stream = {
  id: string;
  title: string;
  description: string;
  mosqueId: string;
  mosqueName: string;
  type: 'live' | 'upcoming' | 'recorded';
  startTime: string;
  endTime?: string;
  thumbnailUrl: string;
  streamUrl: string;
  viewCount: number;
  likes: number;
  speaker?: string;
  tags?: string[];
};