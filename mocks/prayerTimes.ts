export const prayerTimes = [
  {
    name: 'Fajr',
    arabicName: 'الفجر',
    time: '05:12 AM',
  },
  {
    name: 'Sunrise',
    arabicName: 'الشروق',
    time: '06:34 AM',
  },
  {
    name: 'Dhuhr',
    arabicName: 'الظهر',
    time: '12:15 PM',
  },
  {
    name: 'Asr',
    arabicName: 'العصر',
    time: '03:45 PM',
  },
  {
    name: 'Maghrib',
    arabicName: 'المغرب',
    time: '06:52 PM',
  },
  {
    name: 'Isha',
    arabicName: 'العشاء',
    time: '08:22 PM',
  },
];

export const getNextPrayer = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Convert prayer times to minutes since midnight for comparison
  const prayerTimesInMinutes = prayerTimes.map(prayer => {
    const [time, period] = prayer.time.split(' ');
    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }
    
    return {
      ...prayer,
      minutesSinceMidnight: hour * 60 + minute,
    };
  });
  
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
  // Find the next prayer
  const nextPrayer = prayerTimesInMinutes.find(
    prayer => prayer.minutesSinceMidnight > currentTimeInMinutes
  );
  
  // If no prayer is found (after Isha), return Fajr for the next day
  return nextPrayer || prayerTimesInMinutes[0];
};