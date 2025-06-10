export type StreamType = 'live' | 'upcoming' | 'recorded';
export type StreamCategory = 'khutbah' | 'lecture' | 'quran' | 'dua' | 'other';

export interface Stream {
  id: string;
  title: string;
  description: string;
  mosqueId: string;
  mosqueName: string;
  imamName: string;
  thumbnailUrl: string;
  streamUrl: string;
  type: StreamType;
  category: StreamCategory;
  startTime: string;
  endTime: string;
  viewCount: number;
  language: string;
  tags: string[];
  isFeatured: boolean;
}

export const streams: Stream[] = [
  {
    id: "1",
    title: "Friday Khutbah: The Importance of Patience",
    description: "Join Sheikh Ahmad for this week's Jummah khutbah on the virtue of patience in Islam and how it helps us navigate life's challenges.",
    mosqueId: "1",
    mosqueName: "Islamic Center of New York",
    imamName: "Sheikh Ahmad Hassan",
    thumbnailUrl: "https://images.unsplash.com/photo-1564121211835-e88c852648ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    streamUrl: "https://example.com/stream/1",
    type: "live",
    category: "khutbah",
    startTime: "2025-06-10T13:30:00Z",
    endTime: "2025-06-10T14:30:00Z",
    viewCount: 1245,
    language: "English",
    tags: ["jummah", "patience", "islamic teachings"],
    isFeatured: true
  },
  {
    id: "2",
    title: "Tafsir of Surah Al-Kahf",
    description: "Weekly Tafsir session explaining the meanings and lessons from Surah Al-Kahf (The Cave).",
    mosqueId: "2",
    mosqueName: "Masjid Manhattan",
    imamName: "Dr. Yasir Qadhi",
    thumbnailUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51149?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    streamUrl: "https://example.com/stream/2",
    type: "upcoming",
    category: "lecture",
    startTime: "2025-06-11T19:00:00Z",
    endTime: "2025-06-11T20:30:00Z",
    viewCount: 0,
    language: "English",
    tags: ["tafsir", "quran", "surah al-kahf"],
    isFeatured: false
  },
  {
    id: "3",
    title: "Ramadan Preparation Workshop",
    description: "Learn how to prepare spiritually and physically for the blessed month of Ramadan.",
    mosqueId: "3",
    mosqueName: "Brooklyn Islamic Center",
    imamName: "Imam Siraj Wahhaj",
    thumbnailUrl: "https://images.unsplash.com/photo-1604154858776-6c379a2d7b7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    streamUrl: "https://example.com/stream/3",
    type: "upcoming",
    category: "lecture",
    startTime: "2025-06-12T18:00:00Z",
    endTime: "2025-06-12T20:00:00Z",
    viewCount: 0,
    language: "English",
    tags: ["ramadan", "preparation", "fasting"],
    isFeatured: true
  },
  {
    id: "4",
    title: "Quranic Arabic for Beginners",
    description: "Learn the basics of Quranic Arabic to better understand the Holy Quran.",
    mosqueId: "4",
    mosqueName: "Queens Muslim Center",
    imamName: "Ustadh Muhammad Ali",
    thumbnailUrl: "https://images.unsplash.com/photo-1609599006353-e629aaabeb38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    streamUrl: "https://example.com/stream/4",
    type: "recorded",
    category: "lecture",
    startTime: "2025-06-09T17:00:00Z",
    endTime: "2025-06-09T18:30:00Z",
    viewCount: 876,
    language: "English",
    tags: ["arabic", "quran", "language"],
    isFeatured: false
  },
  {
    id: "5",
    title: "Night of Dhikr and Dua",
    description: "Join us for a spiritual evening of remembrance of Allah and supplications.",
    mosqueId: "5",
    mosqueName: "Bronx Islamic Society",
    imamName: "Sheikh Abdullah Johnson",
    thumbnailUrl: "https://images.unsplash.com/photo-1591456983933-9a9a20a27d12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    streamUrl: "https://example.com/stream/5",
    type: "upcoming",
    category: "dua",
    startTime: "2025-06-13T20:00:00Z",
    endTime: "2025-06-13T22:00:00Z",
    viewCount: 0,
    language: "English",
    tags: ["dhikr", "dua", "night prayer"],
    isFeatured: false
  },
  {
    id: "6",
    title: "Fiqh of Salah: Perfecting Your Prayer",
    description: "Detailed explanation of the proper way to perform salah according to the Sunnah.",
    mosqueId: "1",
    mosqueName: "Islamic Center of New York",
    imamName: "Sheikh Ahmad Hassan",
    thumbnailUrl: "https://images.unsplash.com/photo-1580681681625-ded9d7e5f364?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    streamUrl: "https://example.com/stream/6",
    type: "recorded",
    category: "lecture",
    startTime: "2025-06-08T18:00:00Z",
    endTime: "2025-06-08T19:30:00Z",
    viewCount: 1532,
    language: "English",
    tags: ["fiqh", "salah", "prayer"],
    isFeatured: true
  },
  {
    id: "7",
    title: "Live Quran Recitation: Surah Yaseen",
    description: "Beautiful recitation of Surah Yaseen with English translation.",
    mosqueId: "2",
    mosqueName: "Masjid Manhattan",
    imamName: "Qari Ziyad Patel",
    thumbnailUrl: "https://images.unsplash.com/photo-1585036156171-384164a8c675?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    streamUrl: "https://example.com/stream/7",
    type: "upcoming",
    category: "quran",
    startTime: "2025-06-14T21:00:00Z",
    endTime: "2025-06-14T22:00:00Z",
    viewCount: 0,
    language: "Arabic/English",
    tags: ["quran", "recitation", "yaseen"],
    isFeatured: false
  },
  {
    id: "8",
    title: "Islamic Finance Workshop",
    description: "Learn about halal investments, avoiding riba, and financial planning in accordance with Islamic principles.",
    mosqueId: "3",
    mosqueName: "Brooklyn Islamic Center",
    imamName: "Dr. Monzer Kahf",
    thumbnailUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    streamUrl: "https://example.com/stream/8",
    type: "recorded",
    category: "lecture",
    startTime: "2025-06-07T15:00:00Z",
    endTime: "2025-06-07T17:00:00Z",
    viewCount: 945,
    language: "English",
    tags: ["finance", "halal", "investment"],
    isFeatured: false
  }
];

export const getLiveStreams = () => {
  return streams.filter(stream => stream.type === 'live');
};

export const getUpcomingStreams = () => {
  return streams.filter(stream => stream.type === 'upcoming');
};

export const getRecordedStreams = () => {
  return streams.filter(stream => stream.type === 'recorded');
};

export const getFeaturedStreams = () => {
  return streams.filter(stream => stream.isFeatured);
};

export const getStreamsByMosque = (mosqueId: string) => {
  return streams.filter(stream => stream.mosqueId === mosqueId);
};

export const getStreamsByCategory = (category: StreamCategory) => {
  return streams.filter(stream => stream.category === category);
};