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
  Image,
  FlatList
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Search, MapPin, Navigation, Clock, Star, Video, Users } from 'lucide-react-native';
import { mosques } from '@/mocks/mosqueData';
import { getStreamsByMosque } from '@/mocks/streamData';
import { Mosque, Stream } from '@/types';

export default function MapScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nearbyMosques, setNearbyMosques] = useState(mosques);
  const [userLocation, setUserLocation] = useState('New York, NY');
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const [showMosqueDetails, setShowMosqueDetails] = useState(false);

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

  const handleMosqueSelect = (mosque: Mosque) => {
    setSelectedMosque(mosque);
    setShowMosqueDetails(true);
  };

  const handleBackToList = () => {
    setShowMosqueDetails(false);
    setSelectedMosque(null);
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const renderMosqueDetails = () => {
    if (!selectedMosque) return null;
    
    const mosqueStreams = getStreamsByMosque(selectedMosque.id);
    
    return (
      <View style={styles.mosqueDetailsContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackToList}
        >
          <Text style={[styles.backButtonText, { color: colors[theme].primary }]}>
            ← Back to List
          </Text>
        </TouchableOpacity>
        
        <View style={styles.mosqueImageContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1584286595398-a8c264b1dea4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }} 
            style={styles.mosqueImage}
          />
          <View style={styles.mosqueImageOverlay}>
            <Text style={styles.mosqueName}>{selectedMosque.name}</Text>
          </View>
        </View>
        
        <Card style={styles.mosqueInfoCard}>
          <View style={styles.mosqueInfoRow}>
            <MapPin size={18} color={colors[theme].primary} />
            <Text style={[styles.mosqueInfoText, { color: colors[theme].text }]}>
              {selectedMosque.address}
            </Text>
          </View>
          
          <View style={styles.mosqueInfoRow}>
            <Navigation size={18} color={colors[theme].primary} />
            <Text style={[styles.mosqueInfoText, { color: colors[theme].text }]}>
              {selectedMosque.distance} from your location
            </Text>
          </View>
          
          <View style={styles.mosqueInfoRow}>
            <Star size={18} color="#FFD700" fill="#FFD700" />
            <Text style={[styles.mosqueInfoText, { color: colors[theme].text }]}>
              {selectedMosque.rating} rating
            </Text>
          </View>
        </Card>
        
        <Card style={styles.prayerTimesCard}>
          <Text style={[styles.cardTitle, { color: colors[theme].text }]}>
            Prayer Times
          </Text>
          
          <View style={styles.prayerTimesGrid}>
            <View style={styles.prayerTimeItem}>
              <Text style={[styles.prayerName, { color: colors[theme].text }]}>Fajr</Text>
              <Text style={[styles.prayerTime, { color: colors[theme].primary }]}>
                {selectedMosque.prayerTimes.fajr}
              </Text>
            </View>
            
            <View style={styles.prayerTimeItem}>
              <Text style={[styles.prayerName, { color: colors[theme].text }]}>Dhuhr</Text>
              <Text style={[styles.prayerTime, { color: colors[theme].primary }]}>
                {selectedMosque.prayerTimes.dhuhr}
              </Text>
            </View>
            
            <View style={styles.prayerTimeItem}>
              <Text style={[styles.prayerName, { color: colors[theme].text }]}>Asr</Text>
              <Text style={[styles.prayerTime, { color: colors[theme].primary }]}>
                {selectedMosque.prayerTimes.asr}
              </Text>
            </View>
            
            <View style={styles.prayerTimeItem}>
              <Text style={[styles.prayerName, { color: colors[theme].text }]}>Maghrib</Text>
              <Text style={[styles.prayerTime, { color: colors[theme].primary }]}>
                {selectedMosque.prayerTimes.maghrib}
              </Text>
            </View>
            
            <View style={styles.prayerTimeItem}>
              <Text style={[styles.prayerName, { color: colors[theme].text }]}>Isha</Text>
              <Text style={[styles.prayerTime, { color: colors[theme].primary }]}>
                {selectedMosque.prayerTimes.isha}
              </Text>
            </View>
          </View>
        </Card>
        
        <Card style={styles.facilitiesCard}>
          <Text style={[styles.cardTitle, { color: colors[theme].text }]}>
            Facilities
          </Text>
          
          <View style={styles.facilitiesList}>
            {selectedMosque.facilities.map((facility: string, index: number) => (
              <View key={index} style={styles.facilityItem}>
                <View style={[styles.facilityDot, { backgroundColor: colors[theme].primary }]} />
                <Text style={[styles.facilityText, { color: colors[theme].text }]}>
                  {facility}
                </Text>
              </View>
            ))}
          </View>
        </Card>
        
        {mosqueStreams.length > 0 && (
          <Card style={styles.streamsCard}>
            <View style={styles.streamsHeader}>
              <Text style={[styles.cardTitle, { color: colors[theme].text }]}>
                Live & Upcoming Streams
              </Text>
              <TouchableOpacity onPress={() => router.push('/streams')}>
                <Text style={[styles.seeAllText, { color: colors[theme].primary }]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.streamsList}>
              {mosqueStreams.slice(0, 2).map((stream) => (
                <TouchableOpacity 
                  key={stream.id}
                  style={styles.streamItem}
                  onPress={() => router.push(`/streams/${stream.id}`)}
                >
                  <View style={styles.streamImageContainer}>
                    <Image 
                      source={{ uri: stream.thumbnailUrl }} 
                      style={styles.streamImage}
                    />
                    {stream.type === 'live' && (
                      <View style={styles.liveIndicator}>
                        <Text style={styles.liveText}>LIVE</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.streamInfo}>
                    <Text 
                      style={[styles.streamTitle, { color: colors[theme].text }]}
                      numberOfLines={2}
                    >
                      {stream.title}
                    </Text>
                    
                    <View style={styles.streamMeta}>
                      <Video size={14} color={colors[theme].inactive} />
                      <Text style={[styles.streamMetaText, { color: colors[theme].inactive }]}>
                        {stream.type === 'live' ? 'Live Now' : 'Upcoming'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors[theme].primary }]}
          >
            <Text style={styles.actionButtonText}>Get Directions</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              { 
                backgroundColor: 'transparent', 
                borderColor: colors[theme].primary,
                borderWidth: 1
              }
            ]}
          >
            <Text style={[styles.actionButtonText, { color: colors[theme].primary }]}>
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Nearby Mosques",
        }}
      />
      <View style={[styles.container, { backgroundColor: colors[theme].background }]}>
        {!showMosqueDetails ? (
          <>
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
                    <TouchableOpacity onPress={() => handleMosqueSelect(mosque)}>
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
                      
                      {getStreamsByMosque(mosque.id).length > 0 && (
                        <View style={styles.streamBadge}>
                          <Video size={12} color="#FFFFFF" />
                          <Text style={styles.streamBadgeText}>
                            {getStreamsByMosque(mosque.id).filter(s => s.type === 'live').length > 0 
                              ? 'Live Stream Available' 
                              : 'Streams Available'}
                          </Text>
                        </View>
                      )}
                      
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
                          onPress={() => handleMosqueSelect(mosque)}
                        >
                          <Text style={[styles.mosqueActionButtonText, { color: colors[theme].primary }]}>
                            Details
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </Card>
                ))}
              </ScrollView>
            )}
          </>
        ) : (
          renderMosqueDetails()
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
  // Mosque details styles
  mosqueDetailsContainer: {
    flex: 1,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  mosqueImageContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mosqueImage: {
    width: '100%',
    height: '100%',
  },
  mosqueImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
  },
  mosqueInfoCard: {
    marginBottom: 16,
  },
  mosqueInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mosqueInfoText: {
    fontSize: 16,
    marginLeft: 12,
  },
  prayerTimesCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  prayerTimesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  prayerTimeItem: {
    width: '30%',
    marginBottom: 16,
  },
  prayerName: {
    fontSize: 14,
    marginBottom: 4,
  },
  prayerTime: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  facilitiesCard: {
    marginBottom: 16,
  },
  facilitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  facilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  facilityText: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 0.48,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Stream badge
  streamBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  streamBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  // Streams section
  streamsCard: {
    marginBottom: 16,
  },
  streamsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  streamsList: {
    gap: 12,
  },
  streamItem: {
    flexDirection: 'row',
    height: 80,
  },
  streamImageContainer: {
    width: 120,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  streamImage: {
    width: '100%',
    height: '100%',
  },
  liveIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#FF0000',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  streamInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  streamTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  streamMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streamMetaText: {
    fontSize: 12,
    marginLeft: 6,
  },
});