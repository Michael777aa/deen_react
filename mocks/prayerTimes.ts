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
