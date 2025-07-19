import { PrayerTime } from "@/types";

// Mock prayer times data
export const prayerTimes = [
  {
    name: "Fajr",
    arabicName: "الفجر",
    time: "04:30 AM",
    minutesSinceMidnight: 270,
  },
  {
    name: "Dhuhr",
    arabicName: "الظهر",
    time: "12:30 PM",
    minutesSinceMidnight: 750,
  },
  {
    name: "Asr",
    arabicName: "العصر",
    time: "04:15 PM",
    minutesSinceMidnight: 975,
  },
  {
    name: "Maghrib",
    arabicName: "المغرب",
    time: "07:45 PM",
    minutesSinceMidnight: 1185,
  },
  {
    name: "Isha",
    arabicName: "العشاء",
    time: "09:15 PM",
    minutesSinceMidnight: 1275,
  },
];

// Function to get the next prayer time
export const getNextPrayer = (): PrayerTime => {
  const now = new Date();
  const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();

  // Find the next prayer
  const nextPrayer = prayerTimes.find(
    (prayer) => prayer.minutesSinceMidnight > minutesSinceMidnight
  );

  // If no next prayer today, return the first prayer for tomorrow
  const prayer = nextPrayer || prayerTimes[0];

  // Calculate time remaining
  let minutesRemaining = prayer.minutesSinceMidnight - minutesSinceMidnight;
  if (minutesRemaining < 0) {
    minutesRemaining += 24 * 60; // Add 24 hours if it's tomorrow
  }

  const hoursRemaining = Math.floor(minutesRemaining / 60);
  const minsRemaining = minutesRemaining % 60;

  const timeRemaining = `${hoursRemaining}h ${minsRemaining}m`;

  return {
    ...prayer,
    timeRemaining,
  };
};
export const featuredContent = [
  {
    id: "1",
    title: "Complete Umrah Guide",
    description:
      "Step-by-step guide for performing Umrah with duas and rituals",
    image:
      "https://images.unsplash.com/photo-1604480132736-44c188fe4d20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    route: "/umrah",
  },
  {
    id: "2",
    title: "Ramadan Preparation",
    description: "Get ready for the blessed month with these essential tips",
    image:
      "https://images.unsplash.com/photo-1532635241-17e820acc59f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    route: "/ramadan",
  },
  {
    id: "3",
    title: "Islamic Finance Basics",
    description: "Learn about halal investments and financial planning",
    image:
      "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    route: "/finance",
  },
];
