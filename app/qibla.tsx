// app/qibla.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
  Dimensions,
  SafeAreaView,
} from "react-native";
import * as Location from "expo-location";
import { Magnetometer, MagnetometerMeasurement } from "expo-sensors";
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function Qibla() {
  const [heading, setHeading] = useState(0);
  const [qibla, setQibla] = useState(0);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
//dsafdsfas
  // Animation values
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const compassRotation = useRef(new Animated.Value(0)).current;

  // Convert degrees to radians
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Qibla calculation
  function getQiblaDirection(lat: number, lon: number) {
    const kaabaLat = toRad(21.4225);
    const kaabaLon = toRad(39.8262);

    const φ = toRad(lat);
    const λ = toRad(lon);
    const Δλ = kaabaLon - λ;

    const y = Math.sin(Δλ);
    const x =
      Math.cos(φ) * Math.tan(kaabaLat) -
      Math.sin(φ) * Math.cos(Δλ);

    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    return (bearing + 360) % 360;
  }

  // Smooth rotation animation
  const animateRotation = (toValue: number) => {
    Animated.timing(rotationAnim, {
      toValue,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  // Pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Get location
  useEffect(() => {
    const load = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Location permission is required for Qibla direction");
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        
        setLocation({
          lat: loc.coords.latitude,
          lon: loc.coords.longitude,
        });
        
        const dir = getQiblaDirection(loc.coords.latitude, loc.coords.longitude);
        setQibla(dir);
        
        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();

        setLoading(false);
      } catch (err) {
        setError("Unable to get location");
        setLoading(false);
      }
    };

    load();
  }, []);

  // Magnetometer heading with smoothing
  useEffect(() => {
    let lastHeading = 0;
    const smoothingFactor = 0.3;

    const onMagnetometerUpdate = (data: MagnetometerMeasurement) => {
      let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
      angle = angle < 0 ? angle + 360 : angle;
      
      // Smooth the heading
      const smoothed = lastHeading + smoothingFactor * (angle - lastHeading);
      lastHeading = smoothed;
      
      setHeading(smoothed);
      
      // Animate compass ring
      Animated.timing(compassRotation, {
        toValue: -smoothed,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    };

    Magnetometer.setUpdateInterval(100);
    const subscription = Magnetometer.addListener(onMagnetometerUpdate);

    return () => subscription.remove();
  }, []);

  // Update rotation when heading or qibla changes
  useEffect(() => {
    if (!loading) {
      const rotate = (qibla - heading + 360) % 360;
      animateRotation(rotate);
    }
  }, [heading, qibla, loading]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <MaterialIcons name="explore" size={80} color="#4CAF50" />
        </Animated.View>
        <Text style={styles.loadingText}>Finding Qibla Direction...</Text>
        <Text style={styles.loadingSubtext}>Ensure location services are enabled</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <MaterialIcons name="error-outline" size={60} color="#FF6B6B" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const rotate = (qibla - heading + 360) % 360;
  const distance = location ? calculateDistance(location.lat, location.lon, 21.4225, 39.8262) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <BlurView intensity={80} style={StyleSheet.absoluteFill} />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="mosque" size={28} color="#4CAF50" />
          <Text style={styles.title}>Qibla Direction</Text>
        </View>

        {/* Compass Circle */}
        <View style={styles.compassContainer}>
          {/* Outer Ring */}
          <Animated.View style={[styles.compassRing, {
            transform: [{ rotate: compassRotation.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg']
            }) }]
          }]}>
            {[...Array(36)].map((_, i) => (
              <View key={i} style={[styles.compassMark, { transform: [{ rotate: `${i * 10}deg` }] }]}>
                {i % 3 === 0 && (
                  <Text style={[styles.compassText, { transform: [{ rotate: `${-i * 10}deg` }] }]}>
                    {i * 10}
                  </Text>
                )}
              </View>
            ))}
          </Animated.View>

          {/* Qibla Arrow */}
          <Animated.View style={[
            styles.arrowContainer,
            { transform: [{ rotate: rotationAnim.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg']
            }) }] }
          ]}>
            <MaterialIcons name="navigation" size={60} color="#4CAF50" />
            <View style={styles.arrowLine} />
          </Animated.View>

          {/* Center Dot */}
          <View style={styles.centerDot}>
            <Animated.View style={[styles.pulseDot, { transform: [{ scale: pulseAnim }] }]} />
          </View>
        </View>

        {/* Qibla Indicator */}
        <View style={styles.qiblaIndicator}>
          <Text style={styles.qiblaDegrees}>{Math.round(rotate)}°</Text>
          <Text style={styles.qiblaLabel}>to Qibla</Text>
        </View>

        {/* Info Cards */}
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <MaterialIcons name="explore" size={24} color="#4CAF50" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Heading</Text>
              <Text style={styles.infoValue}>{Math.round(heading)}°</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <MaterialIcons name="place" size={24} color="#FF9800" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Qibla Direction</Text>
              <Text style={styles.infoValue}>{Math.round(qibla)}°</Text>
            </View>
          </View>
        </View>

        {/* Location Info */}
        {location && (
          <View style={styles.locationInfo}>
            <MaterialIcons name="location-on" size={16} color="#666" />
            <Text style={styles.locationText}>
              {location.lat.toFixed(4)}°N, {location.lon.toFixed(4)}°E • {Math.round(distance)}km
            </Text>
          </View>
        )}

        {/* Instructions */}
        <Text style={styles.instructions}>
          Point the green arrow toward the Qibla
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

// Helper function to calculate distance
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(deg: number) {
  return deg * (Math.PI / 180);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0A0F',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  loadingSubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 30,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
    marginLeft: 10,
  },
  compassContainer: {
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  compassRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: width * 0.4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  compassMark: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 2,
    height: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginLeft: -1,
  },
  compassText: {
    position: 'absolute',
    top: 20,
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontWeight: '500',
  },
  arrowContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowLine: {
    width: 2,
    height: width * 0.3,
    backgroundColor: '#4CAF50',
    marginTop: 10,
    opacity: 0.8,
  },
  centerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0A0A0F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  qiblaIndicator: {
    alignItems: 'center',
    marginTop: 30,
  },
  qiblaDegrees: {
    fontSize: 48,
    fontWeight: '700',
    color: '#4CAF50',
  },
  qiblaLabel: {
    fontSize: 16,
    color: '#888',
    marginTop: -5,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 40,
    paddingHorizontal: 10,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 15,
    borderRadius: 15,
    width: '48%',
  },
  infoContent: {
    marginLeft: 12,
  },
  infoLabel: {
    color: '#888',
    fontSize: 12,
  },
  infoValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 2,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  locationText: {
    color: '#666',
    fontSize: 12,
    marginLeft: 6,
  },
  instructions: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 30,
    textAlign: 'center',
  },
});