import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Platform, Linking 
} from 'react-native';
import * as Location from 'expo-location';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Search, MapPin, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

interface Mosque {
  name: string;
  address: string;
  rating: number;
  location: { lat: number; lng: number };
}

export default function MapScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Fetch mosques by country (and optionally city)
  const getMosquesByLocation = async (country: string, city?: string) => {
    try {
      setIsLoading(true);
      let url = `https://d2abcd549103.ngrok-free.app/api/v1/prayer/mosques?country=${encodeURIComponent(country)}`;
      if (city) url += `&city=${encodeURIComponent(city)}`;

      const res = await fetch(url);
      const data = await res.json();
      setMosques(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get user location & country
  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return alert('Location permission denied');
    
    const location = await Location.getCurrentPositionAsync({});
    const address = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    const country = address[0]?.country || "South Korea"; // default
    const city = address[0]?.city || undefined;
    setLocationName(city || country);

    getMosquesByLocation(country, city);
  };

  useEffect(() => { getUserLocation(); }, []);

  const filteredMosques = mosques.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openDirections = (lat: number, lng: number) => {
    const url = Platform.select({
      ios: `maps://?daddr=${lat},${lng}`,
      android: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    });
    if (url) Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors[theme].background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors[theme].card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={24} color={colors[theme].text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors[theme].text }]}>Mosques Near You</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors[theme].card }]}>
          <Search size={20} color={colors[theme].inactive} />
          <TextInput
            style={[styles.searchInput, { color: colors[theme].text }]}
            placeholder="Search mosques..."
            placeholderTextColor={colors[theme].inactive}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Location */}
      <View style={styles.locationContainer}>
        <MapPin size={20} color={colors[theme].primary} />
        <Text style={[styles.locationText, { color: colors[theme].text }]}>
         {locationName}
        </Text>
        <TouchableOpacity 
          style={[styles.changeLocationButton, { backgroundColor: colors[theme].primary + '20' }]} 
          onPress={getUserLocation}
        >
          <Text style={[styles.changeLocationText, { color: colors[theme].primary }]}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Mosque List */}
      {isLoading ? (
        <ActivityIndicator size="large" color={colors[theme].primary} style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={styles.mosqueList} showsVerticalScrollIndicator={false}>
          {filteredMosques.map((mosque, index) => (
            <Card key={index} style={styles.mosqueCard}>
              <Text style={{ color: colors[theme].text, fontWeight: 'bold' }}>{mosque.name}</Text>
              <Text style={{ color: colors[theme].inactive }}>{mosque.address}</Text>
              <Text style={{ color: colors[theme].text }}>Rating: {mosque.rating || 'N/A'}</Text>

              <TouchableOpacity
                style={[styles.directionButton, { backgroundColor: colors[theme].primary }]}
                onPress={() => openDirections(mosque.location.lat, mosque.location.lng)}
              >
                <Text style={styles.directionButtonText}>Get Directions</Text>
              </TouchableOpacity>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, marginTop:20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#ddd', borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 },
  headerButton: { padding: 8, borderRadius: 50 },
  headerTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center', flex: 1 },

  searchContainer: { marginVertical: 16 },
  searchInputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderRadius: 12, height: 50, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },

  locationContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: 'rgba(0,0,0,0.03)', padding: 10, borderRadius: 10 },
  locationText: { fontSize: 16, marginLeft: 8, flex: 1, fontWeight: '500' },
  changeLocationButton: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20 },
  changeLocationText: { fontSize: 14, fontWeight: '600' },

  mosqueList: { flex: 1 },
  mosqueCard: { padding: 16, marginBottom: 14, borderRadius: 14, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 },
  directionButton: { marginTop: 12, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  directionButtonText: { color: '#fff', fontWeight: '700', fontSize: 15, letterSpacing: 0.3 },
});
