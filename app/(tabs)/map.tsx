import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  Image
} from 'react-native';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Search, MapPin, Navigation, Clock, Star } from 'lucide-react-native';
import { mosques } from '@/mocks/mosqueData';
import { Stack } from 'expo-router';

export default function MapScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nearbyMosques, setNearbyMosques] = useState(mosques);
  const [userLocation, setUserLocation] = useState('New York, NY');

  const filteredMosques = mosques.filter(mosque => 
    mosque.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mosque.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const requestLocationPermission = async () => {
    setIsLoading(true);
    // Simulate location permission request
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Nearby Mosques",
        }}
      />
      <View style={[styles.container, { backgroundColor: colors[theme].background }]}>
        <View style={styles.searchContainer}>
          <View style={[
            styles.searchInputContainer,
            { backgroundColor: colors[theme].card, borderColor: colors[theme].border }
          ]}>
            <Search size={20} color={colors[theme].inactive} />
            <TextInput
              style={[styles.searchInput, { color: colors[theme].text }]}
              placeholder="Search mosques..."
              placeholderTextColor={colors[theme].inactive}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </View>

        <View style={styles.locationContainer}>
          <MapPin size={20} color={colors[theme].primary} />
          <Text style={[styles.locationText, { color: colors[theme].text }]}>
            {userLocation}
          </Text>
          <TouchableOpacity 
            style={[styles.changeLocationButton, { backgroundColor: colors[theme].primary + '20' }]}
            onPress={requestLocationPermission}
          >
            <Text style={[styles.changeLocationText, { color: colors[theme].primary }]}>
              Change
            </Text>
          </TouchableOpacity>
        </View>

        {Platform.OS !== 'web' ? (
          <View style={styles.mapContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69c07a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80' }} 
              style={styles.mapImage}
              resizeMode="cover"
            />
            <Text style={[styles.mapPlaceholder, { color: colors[theme].text }]}>
              Map View
            </Text>
          </View>
        ) : (
          <Text style={[styles.webMapMessage, { color: colors[theme].text }]}>
            Map view is not available on web. Please use the list below.
          </Text>
        )}

        <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
          Nearby Mosques
        </Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors[theme].primary} />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.mosqueList}>
            {filteredMosques.map((mosque, index) => (
              <Card key={index} style={styles.mosqueCard}>
                <View style={styles.mosqueHeader}>
                  <Text style={[styles.mosqueName, { color: colors[theme].text }]}>
                    {mosque.name}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Star size={16} color="#FFD700" fill="#FFD700" />
                    <Text style={[styles.ratingText, { color: colors[theme].text }]}>
                      {mosque.rating}
                    </Text>
                  </View>
                </View>
                
                <Text style={[styles.mosqueAddress, { color: colors[theme].inactive }]}>
                  {mosque.address}
                </Text>
                
                <View style={styles.mosqueDetails}>
                  <View style={styles.mosqueDetailItem}>
                    <Clock size={16} color={colors[theme].primary} />
                    <Text style={[styles.mosqueDetailText, { color: colors[theme].text }]}>
                      {mosque.prayerTimes.fajr} • {mosque.prayerTimes.isha}
                    </Text>
                  </View>
                  
                  <View style={styles.mosqueDetailItem}>
                    <Navigation size={16} color={colors[theme].primary} />
                    <Text style={[styles.mosqueDetailText, { color: colors[theme].text }]}>
                      {mosque.distance} away
                    </Text>
                  </View>
                </View>
                
                <View style={styles.mosqueActions}>
                  <TouchableOpacity 
                    style={[styles.mosqueActionButton, { backgroundColor: colors[theme].primary }]}
                  >
                    <Text style={styles.mosqueActionButtonText}>
                      Directions
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.mosqueActionButton, 
                      { backgroundColor: 'transparent', borderColor: colors[theme].primary, borderWidth: 1 }
                    ]}
                  >
                    <Text style={[styles.mosqueActionButtonText, { color: colors[theme].primary }]}>
                      Details
                    </Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
  },
  changeLocationButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  changeLocationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  mapPlaceholder: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 4,
    color: '#FFFFFF',
  },
  webMapMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  mosqueList: {
    flex: 1,
  },
  mosqueCard: {
    marginBottom: 12,
  },
  mosqueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mosqueName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  mosqueAddress: {
    fontSize: 14,
    marginBottom: 12,
  },
  mosqueDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  mosqueDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  mosqueDetailText: {
    fontSize: 14,
    marginLeft: 4,
  },
  mosqueActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mosqueActionButton: {
    flex: 0.48,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  mosqueActionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});