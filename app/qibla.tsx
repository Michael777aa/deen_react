import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Image,
  Dimensions,
  Animated,
  Vibration,
  SafeAreaView,
  StatusBar,
  Share
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { 
  MapPin, 
  RefreshCw, 
  Info, 
  ArrowLeft, 
  Compass, 
  Navigation, 
  Zap,
  Share2,
  AlertTriangle,
  Check
} from 'lucide-react-native';
import * as Location from 'expo-location';
import { getQiblaDirection } from '@/redux/features/layouts/prayers/prayersApi';
import { IQiblaDirection } from '@/types/prayer';
import { useLocation } from '@/context/useLocation';

const { width } = Dimensions.get('window');
const COMPASS_SIZE = Math.min(width * 0.85, 320);
const ARROW_IMAGE = { uri: 'https://cdn-icons-png.flaticon.com/512/271/271226.png' };

const QiblaScreen = () => {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  const [isLoading, setIsLoading] = useState(true);
  const [qiblaData, setQiblaData] = useState<IQiblaDirection>({
    direction: 0,
    location: { latitude: 0, longitude: 0 },
    locationName: ''
  });
  const [showInfo, setShowInfo] = useState(false);
  const [accuracy, setAccuracy] = useState<'high' | 'medium' | 'low'>('high');
  const [error, setError] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('day');
  
  // Animation refs
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Determine time of day
  useEffect(() => {
    const hour = new Date().getHours();
    setTimeOfDay(hour >= 6 && hour < 18 ? 'day' : 'night');
    
    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  // Memoized function to get direction text
  const getDirectionText = useCallback((degrees: number) => {
    const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
    const index = Math.round(((degrees % 360) / 45)) % 8;
    return directions[index];
  }, []);

  // Share location function
  const shareLocation = useCallback(async () => {
    try {
      const message = `My current location: ${qiblaData.locationName}\n` +
        `Qibla direction: ${Math.round(qiblaData.direction)}° (${getDirectionText(qiblaData.direction)})\n` +
        `Coordinates: ${qiblaData.location.latitude.toFixed(4)}, ${qiblaData.location.longitude.toFixed(4)}`;
      
      await Share.share({
        message,
        title: 'My Qibla Direction'
      });
    } catch (err) {
      console.error('Error sharing location:', err);
    }
  }, [qiblaData]);

  // Fetch Qibla direction with proper error handling
  const fetchQiblaDirection = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check and request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      // Get current position with high accuracy
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      // Fetch Qibla direction from API
      const qiblaResponse = await getQiblaDirection(
        location.coords.latitude,
        location.coords.longitude
      );

      // Update accuracy based on location accuracy
      const acc:any = location.coords.accuracy;
      if (acc < 10) setAccuracy('high');
      else if (acc < 50) setAccuracy('medium');
      else setAccuracy('low');

      // Update state with new data
      setQiblaData({
        direction: qiblaResponse.direction,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        locationName: qiblaResponse.locationName || 'Current Location'
      });

      // Animate the compass rotation smoothly
      Animated.timing(rotateAnim, {
        toValue: qiblaResponse.direction,
        duration: 1000,
        useNativeDriver: true
      }).start();

      // Fade in the compass
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();

      // Haptic feedback on success
      if (Platform.OS !== 'web') {
        Vibration.vibrate(50);
      }
    } catch (err: any) {
      console.error('Qibla direction error:', err);
      setError(err.message || 'Failed to get Qibla direction');
      setQiblaData(prev => ({
        ...prev,
        locationName: 'Location unavailable'
      }));
      
      // Error vibration pattern
      if (Platform.OS !== 'web') {
        Vibration.vibrate([100, 200, 100]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchQiblaDirection();
  }, []);

  // Spin interpolation for compass arrow
  const spin = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg']
  });

  // Accuracy color
  const accuracyColor = accuracy === 'high' ? '#4CAF50' : accuracy === 'medium' ? '#FF9800' : '#F44336';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors[theme].background }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors[theme].card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={24} color={colors[theme].text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors[theme].text }]}>Qibla Compass</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={shareLocation} style={styles.headerButton}>
            <Share2 size={22} color={colors[theme].text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowInfo(!showInfo)} style={styles.headerButton}>
            <Info size={22} color={colors[theme].text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Location Card */}
        <Card style={styles.locationCard}>
          <View style={styles.locationContainer}>
            <View style={[styles.locationIcon, { backgroundColor: colors[theme].primary + '20' }]}>
              <MapPin size={20} color={colors[theme].primary} />
            </View>
            <View style={styles.locationInfo}>
              <Text style={[styles.locationLabel, { color: colors[theme].inactive }]}>
                Current Location
              </Text>
              <Text style={[styles.locationText, { color: colors[theme].text }]}>
                {qiblaData.locationName}
              </Text>
            </View>
          
          </View>
        </Card>

        {/* Error Message */}
        {error && (
          <Card style={[styles.alertCard, { borderLeftColor: '#F44336' }]}>
            <View style={styles.alertContent}>
              <AlertTriangle size={20} color="#F44336" />
              <View style={styles.alertTextContainer}>
                <Text style={[styles.alertTitle, { color: colors[theme].text }]}>
                  Error Getting Qibla Direction
                </Text>
                <Text style={[styles.alertDescription, { color: colors[theme].inactive }]}>
                  {error}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.calibrateButton, { backgroundColor: colors[theme].primary }]}
              onPress={fetchQiblaDirection}
            >
              <Text style={styles.calibrateButtonText}>Try Again</Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* Compass Container */}
        <View style={styles.compassContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors[theme].primary} />
              <Text style={[styles.loadingText, { color: colors[theme].text }]}>
                Finding Qibla direction...
              </Text>
            </View>
          ) : (
            <>
              <Animated.View style={[
                styles.compassWrapper, 
                { 
                  opacity: fadeAnim,
                  transform: [{ scale: fadeAnim }] 
                }
              ]}>
                {/* Compass Background */}
                <View style={[
                  styles.compassBackground, 
                  { 
                    backgroundColor: colors[theme].card,
                    shadowColor: timeOfDay === 'night' ? '#4FC3F7' : '#000'
                  }
                ]}>
                  {/* Compass ticks */}
                  <View style={styles.compassPattern}>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <View 
                        key={`tick-${i}`}
                        style={[
                          styles.compassTick, 
                          { 
                            backgroundColor: i % 6 === 0 ? colors[theme].primary : colors[theme].border,
                            height: i % 6 === 0 ? 20 : 10,
                            transform: [{ rotate: `${i * 15}deg` }]
                          }
                        ]} 
                      />
                    ))}
                  </View>
                  
                  {/* Direction Labels */}
                  <Text style={[styles.directionLabel, styles.northLabel, { color: colors[theme].primary }]}>N</Text>
                  <Text style={[styles.directionLabel, styles.westLabel, { color: colors[theme].text }]}>W</Text>
                  <Text style={[styles.directionLabel, styles.eastLabel, { color: colors[theme].text }]}>E</Text>
                  <Text style={[styles.directionLabel, styles.southLabel, { color: colors[theme].text }]}>S</Text>
                  
                  {/* Kaaba Indicator */}
                  <View style={styles.kaabaIndicator}>
                    <Compass size={20} color="#FFFFFF" />
                    <Text style={styles.kaabaText}>Kaaba</Text>
                  </View>
                  
                  {/* Qibla Arrow */}
                  <Animated.View style={[
                    styles.qiblaArrowContainer,
                    { transform: [{ rotate: spin }] }
                  ]}>
                    <Image 
                      source={ARROW_IMAGE} 
                      style={[styles.qiblaArrowImage, { tintColor: colors[theme].primary }]}
                      resizeMode="contain"
                    />
                    <Animated.View style={[
                      styles.arrowGlow, 
                      { 
                        backgroundColor: colors[theme].primary,
                        transform: [{ scale: pulseAnim }]
                      }
                    ]} />
                  </Animated.View>
                  
                  {/* Center Dot */}
                  <View style={styles.compassCenter}>
                    <Animated.View style={[
                      styles.compassCenterDot, 
                      { 
                        backgroundColor: colors[theme].primary,
                        transform: [{ scale: pulseAnim }]
                      }
                    ]} />
                  </View>
                </View>
              </Animated.View>
              
              {/* Direction Info */}
              <Card style={styles.directionCard}>
                <View style={styles.directionInfo}>
                  <View style={styles.directionMain}>
                    <Text style={[styles.directionText, { color: colors[theme].primary }]}>
                      {Math.round(qiblaData.direction)}°
                    </Text>
                    <Text style={[styles.directionSubtext, { color: colors[theme].text }]}>
                      {getDirectionText(qiblaData.direction)}
                    </Text>
                  </View>
                  <View style={[
                    styles.accuracyIndicator, 
                    { backgroundColor: accuracyColor + '20' }
                  ]}>
                    <Zap size={16} color={accuracyColor} />
                    <Text style={[styles.accuracyText, { color: accuracyColor }]}>
                      {accuracy === 'high' ? 'High' : accuracy === 'medium' ? 'Medium' : 'Low'} Accuracy
                    </Text>
                  </View>
                </View>
                <Text style={[styles.directionHelp, { color: colors[theme].inactive }]}>
                  Face the green arrow towards the Kaaba in Mecca
                </Text>
              </Card>
            </>
          )}
        </View>

        {/* Info Card */}
        {showInfo && (
          <Card style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Compass size={20} color={colors[theme].primary} />
              <Text style={[styles.infoTitle, { color: colors[theme].text }]}>
                About Qibla Direction
              </Text>
            </View>
            <Text style={[styles.infoText, { color: colors[theme].text }]}>
              The Qibla is the direction Muslims face during prayer, pointing toward the Kaaba in Mecca. This compass shows the exact direction based on your current location.
            </Text>
            
            <View style={styles.infoTips}>
              <Text style={[styles.infoTipsTitle, { color: colors[theme].primary }]}>
                For Best Results:
              </Text>
              <View style={styles.infoTipItem}>
                <View style={[styles.infoTipBullet, { backgroundColor: colors[theme].primary }]} />
                <Text style={[styles.infoTipText, { color: colors[theme].text }]}>
                  Hold your device flat and parallel to the ground
                </Text>
              </View>
              <View style={styles.infoTipItem}>
                <View style={[styles.infoTipBullet, { backgroundColor: colors[theme].primary }]} />
                <Text style={[styles.infoTipText, { color: colors[theme].text }]}>
                  Move away from electronic devices and metal objects
                </Text>
              </View>
              <View style={styles.infoTipItem}>
                <View style={[styles.infoTipBullet, { backgroundColor: colors[theme].primary }]} />
                <Text style={[styles.infoTipText, { color: colors[theme].text }]}>
                  Ensure location services are enabled for best accuracy
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.mainActionButton, { backgroundColor: colors[theme].primary }]}
            onPress={fetchQiblaDirection}
            disabled={isLoading}
          >
            <Navigation size={20} color="#FFFFFF" />
            <Text style={styles.mainActionButtonText}>
              {isLoading ? 'Locating...' : 'Refresh Direction'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.secondaryActionButton, { backgroundColor: colors[theme].card }]}
            onPress={shareLocation}
          >
            <Text style={[styles.secondaryActionButtonText, { color: colors[theme].text }]}>
              Share Location
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  locationCard: {
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertCard: {
    marginBottom: 16,
    borderLeftWidth: 4,
    padding: 12,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
  },
  calibrateButton: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  calibrateButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  compassContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  compassWrapper: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  compassBackground: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  compassPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  compassTick: {
    position: 'absolute',
    width: 2,
    top: 10,
    left: '50%',
    marginLeft: -1,
  },
  directionLabel: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    width: 20,
    textAlign: 'center',
  },
  northLabel: {
    top: 20,
    left: '50%',
    marginLeft: -10,
  },
  eastLabel: {
    top: '50%',
    right: 20,
    marginTop: -10,
  },
  westLabel: {
    top: '50%',
    left: 20,
    marginTop: -10,
  },
  southLabel: {
    bottom: 20,
    left: '50%',
    marginLeft: -10,
  },
  qiblaArrowContainer: {
    position: 'absolute',
    width: COMPASS_SIZE * 0.7,
    height: COMPASS_SIZE * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qiblaArrowImage: {
    width: '100%',
    height: '100%',
  },
  arrowGlow: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.3,
  },
  compassCenter: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  compassCenterDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  kaabaIndicator: {
    position: 'absolute',
    top: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  kaabaText: {
    color: '#FFFFFF',
    marginLeft: 6,
    fontWeight: 'bold',
    fontSize: 14,
  },
  directionCard: {
    marginBottom: 16,
  },
  directionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  directionMain: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  directionText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  directionSubtext: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  accuracyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  accuracyText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  directionHelp: {
    fontSize: 14,
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
  infoTips: {
    marginTop: 16,
  },
  infoTipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoTipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoTipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 8,
  },
  infoTipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  mainActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  mainActionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryActionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  secondaryActionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    height: COMPASS_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default QiblaScreen;