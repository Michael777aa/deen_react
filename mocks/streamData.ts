import { Stream } from '@/types';

export type StreamType = 'live' | 'upcoming' | 'recorded';
export type StreamCategory = 'khutbah' | 'lecture' | 'quran' | 'dua' | 'other';

const streams: Stream[] = [
  {
    id: "1",
    title: "Friday Khutbah: Importance of Patience in Islam",
    description: "Join us for the weekly Friday sermon discussing the virtue of patience in Islamic teachings.",
    mosqueId: "1",
    mosqueName: "Islamic Center of New York",
    imamName: "Imam Abdullah",
    type: "live",
    startTime: "2025-06-10T13:30:00Z",
    thumbnailUrl: "https://images.unsplash.com/photo-1584286595398-a8c264b1dea4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    streamUrl: "https://example.com/stream/1",
    viewCount: 1245,
    likes: 320,
    category: "khutbah",
    tags: ["khutbah", "patience", "friday"]
  },
  {
    id: "2",
    title: "Tafsir of Surah Al-Kahf",
    description: "Detailed explanation of Surah Al-Kahf with lessons and reflections.",
    mosqueId: "2",
    mosqueName: "Masjid Manhattan",
    imamName: "Sheikh Mohammed",
    type: "upcoming",
    startTime: "2025-06-11T19:00:00Z",
    endTime: "2025-06-11T20:30:00Z",
    thumbnailUrl: "https://images.unsplash.com/photo-1585036156171-384164a8c675?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    streamUrl: "https://example.com/stream/2",
    viewCount: 0,
    likes: 0,
    category: "quran",
    tags: ["tafsir", "quran", "al-kahf"]
  },
  {
    id: "3",
    title: "Islamic Finance Workshop",
    description: "Learn about halal investment options and financial planning according to Islamic principles.",
    mosqueId: "3",
    mosqueName: "Brooklyn Islamic Center",
    imamName: "Dr. Ahmed Khan",
    type: "upcoming",
    startTime: "2025-06-12T18:00:00Z",
    endTime: "2025-06-12T20:00:00Z",
    thumbnailUrl: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    streamUrl: "https://example.com/stream/3",
    viewCount: 0,
    likes: 0,
    category: "lecture",
    tags: ["finance", "workshop", "halal"]
  },
  {
    id: "4",
    title: "Ramadan Preparation Class",
    description: "Get ready for the blessed month with essential tips and spiritual preparation.",
    mosqueId: "4",
    mosqueName: "Queens Muslim Center",
    imamName: "Ustadh Ibrahim",
    type: "upcoming",
    startTime: "2025-06-15T19:30:00Z",
    endTime: "2025-06-15T21:00:00Z",
    thumbnailUrl: "https://images.unsplash.com/photo-1532635241-17e820acc59f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    streamUrl: "https://example.com/stream/4",
    viewCount: 0,
    likes: 0,
    category: "lecture",
    tags: ["ramadan", "preparation", "fasting"]
  },
  {
    id: "5",
    title: "Youth Halaqa: Building Strong Muslim Identity",
    description: "Special session for young Muslims on maintaining Islamic identity in modern society.",
    mosqueId: "5",
    mosqueName: "Bronx Islamic Society",
    imamName: "Br. Yusuf Ali",
    type: "live",
    startTime: "2025-06-10T18:00:00Z",
    thumbnailUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    streamUrl: "https://example.com/stream/5",
    viewCount: 876,
    likes: 245,
    category: "lecture",
    tags: ["youth", "identity", "halaqa"]
  },
  {
    id: "6",
    title: "Tajweed Class: Perfecting Quranic Recitation",
    description: "Learn the rules of proper Quran recitation with expert guidance.",
    mosqueId: "1",
    mosqueName: "Islamic Center of New York",
    imamName: "Qari Zaid",
    type: "upcoming",
    startTime: "2025-06-13T17:00:00Z",
    endTime: "2025-06-13T18:30:00Z",
    thumbnailUrl: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    streamUrl: "https://example.com/stream/6",
    viewCount: 0,
    likes: 0,
    category: "quran",
    tags: ["tajweed", "quran", "recitation"]
  },
  {
    id: "7",
    title: "Dua Session: Prayers for Healing and Protection",
    description: "Join our imam for a special session of duas for healing, protection, and well-being.",
    mosqueId: "3",
    mosqueName: "Brooklyn Islamic Center",
    imamName: "Imam Khalid",
    type: "recorded",
    startTime: "2025-06-05T20:00:00Z",
    endTime: "2025-06-05T21:00:00Z",
    thumbnailUrl: "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    streamUrl: "https://example.com/stream/7",
    viewCount: 3450,
    likes: 890,
    category: "dua",
    tags: ["dua", "healing", "protection"]
  },
  {
    id: "8",
    title: "Eid Prayer and Khutbah",
    description: "Recording of our Eid al-Fitr prayer and special khutbah from last Ramadan.",
    mosqueId: "2",
    mosqueName: "Masjid Manhattan",
    imamName: "Sheikh Mohammed",
    type: "recorded",
    startTime: "2025-05-12T08:00:00Z",
    endTime: "2025-05-12T09:30:00Z",
    thumbnailUrl: "https://images.unsplash.com/photo-1566996533071-2c578080c06e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    streamUrl: "https://example.com/stream/8",
    viewCount: 7890,
    likes: 1245,
    category: "khutbah",
    tags: ["eid", "khutbah", "ramadan"]
  }
];

export const getLiveStreams = (): Stream[] => {
  return streams.filter(stream => stream.type === 'live');
};

export const getUpcomingStreams = (): Stream[] => {
  return streams.filter(stream => stream.type === 'upcoming');
};

export const getRecordedStreams = (): Stream[] => {
  return streams.filter(stream => stream.type === 'recorded');
};

export const getStreamsByMosque = (mosqueId: string): Stream[] => {
  return streams.filter(stream => stream.mosqueId === mosqueId);
};

export const getStreamsByCategory = (category: StreamCategory): Stream[] => {
  return streams.filter(stream => stream.category === category);
};

export const getStreamById = (streamId: string): Stream | undefined => {
  return streams.find(stream => stream.id === streamId);
};

export { streams };