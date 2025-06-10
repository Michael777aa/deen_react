import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { Stack } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Moon, 
  Sun, 
  Star, 
  Gift, 
  Heart
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const MONTHS = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
  'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'
];

// Islamic holidays and special days
const ISLAMIC_EVENTS = [
  { name: 'Islamic New Year', date: '1 Muharram', description: 'First day of the Islamic year' },
  { name: 'Day of Ashura', date: '10 Muharram', description: 'A day of fasting and remembrance' },
  { name: 'Mawlid al-Nabi', date: '12 Rabi al-Awwal', description: 'Birth of Prophet Muhammad (PBUH)' },
  { name: 'Laylat al-Mi\'raj', date: '27 Rajab', description: 'Night Journey and Ascension of Prophet Muhammad (PBUH)' },
  { name: 'Laylat al-Bara\'at', date: '15 Sha\'ban', description: 'Night of Forgiveness' },
  { name: 'First day of Ramadan', date: '1 Ramadan', description: 'Beginning of the month of fasting' },
  { name: 'Laylat al-Qadr', date: '27 Ramadan', description: 'Night of Power, when the Quran was first revealed' },
  { name: 'Eid al-Fitr', date: '1 Shawwal', description: 'Festival of Breaking the Fast' },
  { name: 'Day of Arafah', date: '9 Dhu al-Hijjah', description: 'Second day of the Hajj pilgrimage' },
  { name: 'Eid al-Adha', date: '10 Dhu al-Hijjah', description: 'Festival of Sacrifice' }
];

export default function IslamicCalendarScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  const [currentMonth, setCurrentMonth] = useState(8); // Ramadan
  const [currentYear, setCurrentYear] = useState(1445);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  // Generate days for the current month (simplified)
  const generateDays = () => {
    // In a real app, this would use proper Hijri calendar calculations
    // For demo purposes, we'll create a simplified 30-day month
    const days = [];
    const daysInMonth = currentMonth === 8 ? 30 : 29; // Ramadan has 30 days in this example
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        gregorian: `${new Date().getMonth() + 1}/${i + 10}/${new Date().getFullYear()}`,
        events: ISLAMIC_EVENTS.filter(event => {
          const [eventDay, eventMonth] = event.date.split(' ');
          return parseInt(eventDay) === i && MONTHS[currentMonth] === eventMonth;
        })
      });
    }
    
    return days;
  };

  const days = generateDays();

  const getEventsForCurrentMonth = () => {
    return ISLAMIC_EVENTS.filter(event => {
      const [_, eventMonth] = event.date.split(' ');
      return MONTHS[currentMonth] === eventMonth;
    });
  };

  const monthEvents = getEventsForCurrentMonth();

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const getEventIcon = (eventName: string) => {
    if (eventName.includes('Eid')) return <Gift size={16} color="#E91E63" />;
    if (eventName.includes('Laylat')) return <Moon size={16} color="#9C27B0" />;
    if (eventName.includes('Ramadan')) return <Star size={16} color="#FF9800" />;
    if (eventName.includes('Mawlid')) return <Heart size={16} color="#F44336" />;
    return <Sun size={16} color="#4CAF50" />;
  };

  const renderMonthView = () => (
    <>
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
          <ChevronLeft size={24} color={colors[theme].primary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.monthYearButton}
          onPress={() => setViewMode('year')}
        >
          <Text style={[styles.monthYearText, { color: colors[theme].text }]}>
            {MONTHS[currentMonth]} {currentYear}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
          <ChevronRight size={24} color={colors[theme].primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.calendarGrid}>
        {days.map((day, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.dayCell,
              selectedDate === `${day.day} ${MONTHS[currentMonth]}` && 
                [styles.selectedDay, { backgroundColor: colors[theme].primary + '20' }],
              day.events.length > 0 && styles.eventDay
            ]}
            onPress={() => setSelectedDate(`${day.day} ${MONTHS[currentMonth]}`)}
          >
            <Text 
              style={[
                styles.dayNumber, 
                { color: colors[theme].text },
                day.events.length > 0 && { color: colors[theme].primary, fontWeight: 'bold' }
              ]}
            >
              {day.day}
            </Text>
            {day.events.length > 0 && (
              <View style={[styles.eventIndicator, { backgroundColor: colors[theme].primary }]} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      {selectedDate ? (
        <Card style={styles.selectedDateCard}>
          <Text style={[styles.selectedDateTitle, { color: colors[theme].text }]}>
            {selectedDate}
          </Text>
          
          {days.find(day => `${day.day} ${MONTHS[currentMonth]}` === selectedDate)?.events.length ? (
            days.find(day => `${day.day} ${MONTHS[currentMonth]}` === selectedDate)?.events.map((event, index) => (
              <View key={index} style={styles.eventItem}>
                {getEventIcon(event.name)}
                <View style={styles.eventInfo}>
                  <Text style={[styles.eventName, { color: colors[theme].text }]}>
                    {event.name}
                  </Text>
                  <Text style={[styles.eventDescription, { color: colors[theme].inactive }]}>
                    {event.description}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={[styles.noEventsText, { color: colors[theme].inactive }]}>
              No special events on this day
            </Text>
          )}
        </Card>
      ) : (
        <Card style={styles.monthEventsCard}>
          <Text style={[styles.monthEventsTitle, { color: colors[theme].text }]}>
            Events in {MONTHS[currentMonth]}
          </Text>
          
          {monthEvents.length > 0 ? (
            monthEvents.map((event, index) => (
              <View key={index} style={styles.monthEventItem}>
                {getEventIcon(event.name)}
                <View style={styles.eventInfo}>
                  <Text style={[styles.eventName, { color: colors[theme].text }]}>
                    {event.name}
                  </Text>
                  <Text style={[styles.eventDate, { color: colors[theme].primary }]}>
                    {event.date}
                  </Text>
                  <Text style={[styles.eventDescription, { color: colors[theme].inactive }]}>
                    {event.description}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={[styles.noEventsText, { color: colors[theme].inactive }]}>
              No special events this month
            </Text>
          )}
        </Card>
      )}
    </>
  );

  const renderYearView = () => (
    <>
      <View style={styles.yearHeader}>
        <TouchableOpacity 
          onPress={() => setCurrentYear(currentYear - 1)}
          style={styles.yearNavButton}
        >
          <ChevronLeft size={20} color={colors[theme].primary} />
        </TouchableOpacity>
        
        <Text style={[styles.yearText, { color: colors[theme].text }]}>
          {currentYear} Hijri
        </Text>
        
        <TouchableOpacity 
          onPress={() => setCurrentYear(currentYear + 1)}
          style={styles.yearNavButton}
        >
          <ChevronRight size={20} color={colors[theme].primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.monthsGrid}>
        {MONTHS.map((month, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.monthCell,
              currentMonth === index && [styles.selectedMonth, { backgroundColor: colors[theme].primary + '20' }]
            ]}
            onPress={() => {
              setCurrentMonth(index);
              setViewMode('month');
            }}
          >
            <Text 
              style={[
                styles.monthName, 
                { color: colors[theme].text },
                currentMonth === index && { color: colors[theme].primary, fontWeight: 'bold' }
              ]}
            >
              {month}
            </Text>
            {ISLAMIC_EVENTS.some(event => event.date.includes(month)) && (
              <View style={[styles.monthEventIndicator, { backgroundColor: colors[theme].primary }]} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      <Card style={styles.yearEventsCard}>
        <Text style={[styles.yearEventsTitle, { color: colors[theme].text }]}>
          Major Islamic Events in {currentYear}
        </Text>
        
        <View style={styles.yearEventsList}>
          {ISLAMIC_EVENTS.slice(0, 5).map((event, index) => (
            <View key={index} style={styles.yearEventItem}>
              {getEventIcon(event.name)}
              <View style={styles.eventInfo}>
                <Text style={[styles.eventName, { color: colors[theme].text }]}>
                  {event.name}
                </Text>
                <Text style={[styles.eventDate, { color: colors[theme].primary }]}>
                  {event.date}, {currentYear}
                </Text>
              </View>
            </View>
          ))}
          
          <TouchableOpacity 
            style={[styles.viewAllButton, { backgroundColor: colors[theme].primary + '20' }]}
            onPress={() => setViewMode('month')}
          >
            <Text style={[styles.viewAllText, { color: colors[theme].primary }]}>
              View Monthly Calendar
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    </>
  );

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Islamic Calendar",
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <ScrollView 
        style={[styles.container, { backgroundColor: colors[theme].background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.headerContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1564769625688-8318f9153a5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }} 
            style={styles.headerImage}
          />
          <View style={styles.headerOverlay}>
            <CalendarIcon size={32} color="#FFFFFF" />
            <Text style={styles.headerTitle}>Islamic Calendar</Text>
            <Text style={styles.headerSubtitle}>1445 Hijri / 2025 Gregorian</Text>
          </View>
        </View>
        
        <View style={styles.calendarContainer}>
          {viewMode === 'month' ? renderMonthView() : renderYearView()}
        </View>
        
        <Card style={styles.todayCard}>
          <Text style={[styles.todayTitle, { color: colors[theme].text }]}>
            Today
          </Text>
          
          <View style={styles.todayContent}>
            <View style={styles.dateColumn}>
              <Text style={[styles.hijriDate, { color: colors[theme].primary }]}>
                15 Sha'ban 1445
              </Text>
              <Text style={[styles.gregorianDate, { color: colors[theme].inactive }]}>
                February 15, 2025
              </Text>
            </View>
            
            <View style={[styles.dateDivider, { backgroundColor: colors[theme].border }]} />
            
            <View style={styles.eventColumn}>
              <Text style={[styles.todayEventTitle, { color: colors[theme].text }]}>
                Laylat al-Bara'at
              </Text>
              <Text style={[styles.todayEventDescription, { color: colors[theme].inactive }]}>
                Night of Forgiveness
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  headerContainer: {
    height: 180,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  headerSubtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.9,
    marginTop: 4,
  },
  calendarContainer: {
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthYearButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayCell: {
    width: (width - 32 - 28) / 7,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 20,
    position: 'relative',
  },
  selectedDay: {
    borderRadius: 20,
  },
  eventDay: {
    position: 'relative',
  },
  dayNumber: {
    fontSize: 16,
  },
  eventIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 6,
  },
  selectedDateCard: {
    marginTop: 8,
    marginBottom: 16,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventInfo: {
    marginLeft: 12,
    flex: 1,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  eventDescription: {
    fontSize: 14,
  },
  noEventsText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  monthEventsCard: {
    marginTop: 8,
    marginBottom: 16,
  },
  monthEventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  monthEventItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  eventDate: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  // Year view styles
  yearHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  yearNavButton: {
    padding: 8,
  },
  yearText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthCell: {
    width: (width - 32 - 16) / 3,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 12,
    position: 'relative',
  },
  selectedMonth: {
    borderRadius: 12,
  },
  monthName: {
    fontSize: 14,
    fontWeight: '500',
  },
  monthEventIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 10,
  },
  yearEventsCard: {
    marginTop: 8,
    marginBottom: 16,
  },
  yearEventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  yearEventsList: {
    gap: 12,
  },
  yearEventItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Today card styles
  todayCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  todayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  todayContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateColumn: {
    flex: 0.4,
  },
  hijriDate: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  gregorianDate: {
    fontSize: 14,
  },
  dateDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 16,
  },
  eventColumn: {
    flex: 0.6,
  },
  todayEventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  todayEventDescription: {
    fontSize: 14,
  },
});