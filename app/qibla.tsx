import React, { useState, useEffect, useRef } from 'react';
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
  StatusBar
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
  Check,
  Moon,
  Sun
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const COMPASS_SIZE = Math.min(width * 0.85, 320);

export default function QiblaScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? 'dark' : 'light';
  const [isLoading, setIsLoading] = useState(false);
  const [qiblaDirection, setQiblaDirection] = useState(65);
  const [userLocation, setUserLocation] = useState('New York, NY');
  const [showInfo, setShowInfo] = useState(false);
  const [calibrationNeeded, setCalibrationNeeded] = useState(false);
  const [calibrationSuccess, setCalibrationSuccess] = useState(false);
  const [accuracy, setAccuracy] = useState('high'); // 'high', 'medium', 'low'
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('day');
  
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const calibrationAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const requestLocationPermission = async () => {
    setIsLoading(true);
    setCalibrationNeeded(false);
    setCalibrationSuccess(false);
    
    // Simulate location permission request and compass calculation
    setTimeout(() => {
      // Simulate a new qibla direction
      const newDirection = Math.floor(Math.random() * 360);
      setQiblaDirection(newDirection);
      
      // Animate the compass rotation
      Animated.timing(rotateAnim, {
        toValue: newDirection,
        duration: 1000,
        useNativeDriver: true
      }).start();
      
      // Randomly decide if calibration is needed
      const needsCalibration = Math.random() > 0.7;
      setCalibrationNeeded(needsCalibration);
      
      // Set random accuracy
      const accuracyValues = ['high', 'medium', 'low'];
      const randomAccuracy = accuracyValues[Math.floor(Math.random() * accuracyValues.length)];
      setAccuracy(randomAccuracy);
      
      setIsLoading(false);
      
      if (Platform.OS !== 'web') {
        Vibration.vibrate(100);
      }
    }, 1500);
  };

  const calibrateCompass = () => {
    setIsLoading(true);
    
    // Start calibration animation
    Animated.loop(
      Animated.timing(calibrationAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true
      })
    ).start();
    
    // Simulate calibration process
    setTimeout(() => {
      calibrationAnim.stopAnimation();
      calibrationAnim.setValue(0);
      setIsLoading(false);
      setCalibrationNeeded(false);
      setCalibrationSuccess(true);
      setAccuracy('high');
      
      // Show success message briefly
      setTimeout(() => {
        setCalibrationSuccess(false);
      }, 3000);
      
      if (Platform.OS !== 'web') {
        Vibration.vibrate([0, 100, 50, 100]);
      }
    }, 3000);
  };

  useEffect(() => {
    requestLocationPermission();
    
    // Determine time of day
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

    // Scale in animation
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true
    }).start();
    
    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg']
  });
  
  const calibrationRotate = calibrationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const goBack = () => {
    router.back();
  };

  const getAccuracyColor = () => {
    switch(accuracy) {
      case 'high': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'low': return '#F44336';
      default: return '#4CAF50';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors[theme].background }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      <Stack.Screen 
        options={{ 
          title: "Qibla Compass",
          headerShown: false
        }} 
      />
      
      {/* Custom Header */}
      <View style={[styles.customHeader, { backgroundColor: colors[theme].card }]}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors[theme].text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors[theme].text }]}>
          Qibla Compass
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Share2 size={22} color={colors[theme].text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowInfo(!showInfo)}
          >
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
                {userLocation}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.refreshButton, { backgroundColor: colors[theme].primary }]}
              onPress={requestLocationPermission}
              disabled={isLoading}
            >
              <RefreshCw size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Calibration Alert */}
        {calibrationNeeded && (
          <Card style={[styles.alertCard, { borderLeftColor: '#FF9800' }]}>
            <View style={styles.alertContent}>
              <AlertTriangle size={20} color="#FF9800" />
              <View style={styles.alertTextContainer}>
                <Text style={[styles.alertTitle, { color: colors[theme].text }]}>
                  Calibration Needed
                </Text>
                <Text style={[styles.alertDescription, { color: colors[theme].inactive }]}>
                  Wave your device in a figure-8 pattern to improve compass accuracy
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.calibrateButton, { backgroundColor: '#FF9800' }]}
              onPress={calibrateCompass}
            >
              <Text style={styles.calibrateButtonText}>Calibrate</Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* Calibration Success */}
        {calibrationSuccess && (
          <Card style={[styles.alertCard, { borderLeftColor: '#4CAF50' }]}>
            <View style={styles.alertContent}>
              <Check size={20} color="#4CAF50" />
              <View style={styles.alertTextContainer}>
                <Text style={[styles.alertTitle, { color: colors[theme].text }]}>
                  Calibration Successful
                </Text>
                <Text style={[styles.alertDescription, { color: colors[theme].inactive }]}>
                  Your compass is now calibrated for better accuracy
                </Text>
              </View>
            </View>
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
              <Animated.View style={[styles.compassWrapper, { transform: [{ scale: scaleAnim }] }]}>
                {/* Sky background for day/night effect */}
                <View style={[
                  styles.skyBackground, 
                  { 
                    backgroundColor: timeOfDay === 'day' 
                      ? '#E3F2FD' 
                      : '#0D1B2A'
                  }
                ]}>
                  {timeOfDay === 'night' && (
                    <>
                      <View style={[styles.star, { top: '10%', left: '20%' }]} />
                      <View style={[styles.star, { top: '15%', left: '80%' }]} />
                      <View style={[styles.star, { top: '30%', left: '50%' }]} />
                      <View style={[styles.star, { top: '25%', left: '30%' }]} />
                      <View style={[styles.star, { top: '40%', left: '70%' }]} />
                      <View style={[styles.star, { top: '60%', left: '25%' }]} />
                      <View style={[styles.star, { top: '70%', left: '60%' }]} />
                      <View style={[styles.star, { top: '80%', left: '40%' }]} />
                      <View style={[styles.star, { top: '85%', left: '80%' }]} />
                      <View style={[styles.star, { top: '20%', left: '10%' }]} />
                      <View style={[styles.star, { top: '50%', left: '90%' }]} />
                    </>
                  )}
                  
                  {/* Day/Night Icon */}
                  <View style={styles.timeIcon}>
                    {timeOfDay === 'day' ? (
                      <Sun size={24} color="#FF9800" />
                    ) : (
                      <Moon size={24} color="#BBDEFB" />
                    )}
                  </View>
                  
                  <View style={[
                    styles.compassBackground, 
                    { 
                      backgroundColor: colors[theme].card,
                      shadowColor: timeOfDay === 'night' ? '#4FC3F7' : '#000'
                    }
                  ]}>
                    {/* Compass Background Pattern */}
                    <View style={styles.compassPattern}>
                      {Array(24).fill(0).map((_, i) => (
                        <View 
                          key={i} 
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
                    <View style={styles.compassDirections}>
                      <Text style={[styles.directionLabel, { color: colors[theme].primary, top: 20 }]}>N</Text>
                      <Text style={[styles.directionLabel, { color: colors[theme].text, top: COMPASS_SIZE/2 - 10, left: 20 }]}>W</Text>
                      <Text style={[styles.directionLabel, { color: colors[theme].text, top: COMPASS_SIZE/2 - 10, right: 20 }]}>E</Text>
                      <Text style={[styles.directionLabel, { color: colors[theme].text, bottom: 20 }]}>S</Text>
                    </View>
                    
                    {/* Qibla Arrow */}
                    <Animated.View 
                      style={[
                        styles.qiblaArrow,
                        { transform: [{ rotate: spin }] }
                      ]}
                    >
                      <Animated.View 
                        style={[
                          styles.arrowGlow,
                          { 
                            backgroundColor: colors[theme].primary,
                            opacity: glowAnim
                          }
                        ]} 
                      />
                      <View style={[styles.arrowHead, { backgroundColor: colors[theme].primary }]} />
                      <View style={[styles.arrowTail, { backgroundColor: colors[theme].inactive }]} />
                    </Animated.View>
                    
                    {/* Center Dot */}
                    <View style={styles.compassCenter}>
                      <Animated.View 
                        style={[
                          styles.compassCenterDot, 
                          { 
                            backgroundColor: colors[theme].primary,
                            transform: [{ scale: pulseAnim }]
                          }
                        ]} 
                      />
                    </View>
                    
                    {/* Kaaba Indicator */}
                    <View style={styles.kaabaIndicator}>
                      <Compass size={20} color="#FFFFFF" />
                      <Text style={styles.kaabaText}>Kaaba</Text>
                    </View>
                    
                    {/* Calibration Overlay */}
                    {isLoading && calibrationNeeded && (
                      <Animated.View 
                        style={[
                          styles.calibrationOverlay,
                          { transform: [{ rotate: calibrationRotate }] }
                        ]}
                      >
                        <View style={styles.calibrationPattern}>
                          <View style={[styles.calibrationLine, { borderColor: '#FF9800' }]} />
                          <View style={[styles.calibrationLine, { borderColor: '#FF9800', transform: [{ rotate: '90deg' }] }]} />
                        </View>
                      </Animated.View>
                    )}
                  </View>
                </View>
              </Animated.View>
              
              {/* Direction Info */}
              <Card style={styles.directionCard}>
                <View style={styles.directionInfo}>
                  <View style={styles.directionMain}>
                    <Text style={[styles.directionText, { color: colors[theme].primary }]}>
                      {qiblaDirection}°
                    </Text>
                    <Text style={[styles.directionSubtext, { color: colors[theme].text }]}>
                      {qiblaDirection > 0 && qiblaDirection < 90 ? 'Northeast' : 
                       qiblaDirection >= 90 && qiblaDirection < 180 ? 'Southeast' :
                       qiblaDirection >= 180 && qiblaDirection < 270 ? 'Southwest' : 'Northwest'}
                    </Text>
                  </View>
                  <View style={[
                    styles.accuracyIndicator, 
                    { backgroundColor: getAccuracyColor() + '20' }
                  ]}>
                    <Zap size={16} color={getAccuracyColor()} />
                    <Text style={[styles.accuracyText, { color: getAccuracyColor() }]}>
                      {accuracy === 'high' ? 'High' : accuracy === 'medium' ? 'Medium' : 'Low'} Accuracy
                    </Text>
                  </View>
                </View>
                <Text style={[styles.directionHelp, { color: colors[theme].inactive }]}>
                  Point the green arrow towards the Qibla direction
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
                About Qibla
              </Text>
            </View>
            <Text style={[styles.infoText, { color: colors[theme].text }]}>
              The Qibla is the direction that Muslims face during prayer. It points toward the Kaaba in Mecca, Saudi Arabia, which is the most sacred site in Islam.
            </Text>
            <Text style={[styles.infoText, { color: colors[theme].text, marginTop: 12 }]}>
              For accurate results, please ensure your device's compass is calibrated and you are away from magnetic interference.
            </Text>
            
            <View style={styles.infoTips}>
              <Text style={[styles.infoTipsTitle, { color: colors[theme].primary }]}>
                Tips for Better Accuracy:
              </Text>
              <View style={styles.infoTipItem}>
                <View style={[styles.infoTipBullet, { backgroundColor: colors[theme].primary }]} />
                <Text style={[styles.infoTipText, { color: colors[theme].text }]}>
                  Keep away from electronic devices and metal objects
                </Text>
              </View>
              <View style={styles.infoTipItem}>
                <View style={[styles.infoTipBullet, { backgroundColor: colors[theme].primary }]} />
                <Text style={[styles.infoTipText, { color: colors[theme].text }]}>
                  Calibrate your compass by moving your device in a figure-8 pattern
                </Text>
              </View>
              <View style={styles.infoTipItem}>
                <View style={[styles.infoTipBullet, { backgroundColor: colors[theme].primary }]} />
                <Text style={[styles.infoTipText, { color: colors[theme].text }]}>
                  Hold your device flat and parallel to the ground
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.mainActionButton, { backgroundColor: colors[theme].primary }]}
            onPress={requestLocationPermission}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Navigation size={20} color="#FFFFFF" />
                <Text style={styles.mainActionButtonText}>
                  Recalibrate
                </Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.secondaryActionButton, { backgroundColor: colors[theme].card }]}
          >
            <Text style={[styles.secondaryActionButtonText, { color: colors[theme].text }]}>
              Share Location
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customHeader: {
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
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
    borderRadius: COMPASS_SIZE / 2,
    overflow: 'hidden',
  },
  skyBackground: {
    width: '100%',
    height: '100%',
    borderRadius: COMPASS_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
  },
  timeIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  compassBackground: {
    width: COMPASS_SIZE * 0.85,
    height: COMPASS_SIZE * 0.85,
    borderRadius: (COMPASS_SIZE * 0.85) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
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
    height: 20,
    top: 10,
    left: COMPASS_SIZE * 0.85 / 2 - 1,
  },
  compassDirections: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  directionLabel: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    width: 20,
    textAlign: 'center',
    left: COMPASS_SIZE * 0.85 / 2 - 10,
  },
  qiblaArrow: {
    position: 'absolute',
    width: COMPASS_SIZE * 0.6,
    height: COMPASS_SIZE * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowGlow: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    top: 0,
    marginTop: -10,
    opacity: 0.5,
  },
  arrowHead: {
    position: 'absolute',
    width: 6,
    height: COMPASS_SIZE * 0.3,
    borderRadius: 3,
    top: 0,
  },
  arrowTail: {
    position: 'absolute',
    width: 4,
    height: COMPASS_SIZE * 0.3,
    borderRadius: 2,
    bottom: 0,
  },
  compassCenter: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  compassCenterDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
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
  calibrationOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calibrationPattern: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  calibrationLine: {
    position: 'absolute',
    width: '100%',
    height: 0,
    borderWidth: 1,
    borderStyle: 'dashed',
    top: '50%',
    left: 0,
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