import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Share,
} from "react-native";
import { Stack, router } from "expo-router";
import * as Location from "expo-location";
import { colors } from "@/constants/colors";
import { Card } from "@/components/Card";
import {
  MapPin,
  ArrowLeft,
  Zap,
  Share2,
  AlertTriangle,
} from "lucide-react-native";

const { width } = Dimensions.get("window");
const COMPASS_SIZE = Math.min(width * 0.85, 320);
const ARROW_IMAGE = {
  uri: "https://cdn-icons-png.flaticon.com/512/271/271226.png",
};

// Offline Qibla calculation
function calculateQibla(lat: number, lon: number) {
  const kaabaLat = 21.4225;
  const kaabaLon = 39.8262;
  const phiK = (kaabaLat * Math.PI) / 180;
  const lambdaK = (kaabaLon * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const lambda = (lon * Math.PI) / 180;

  const deltaLambda = lambdaK - lambda;
  const x = Math.sin(deltaLambda);
  const y =
    Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(deltaLambda);
  const qibla = Math.atan2(x, y) * (180 / Math.PI);
  return (qibla + 360) % 360;
}

const QiblaScreen = () => {
  const [darkMode, setDarkMode] = useState(false);
  const theme = darkMode ? "dark" : "light";
  const [isLoading, setIsLoading] = useState(true);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [locationName, setLocationName] = useState("");
  const [accuracy, setAccuracy] = useState<"high" | "medium" | "low">("high");
  const [error, setError] = useState<string | null>(null);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const spin = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const fetchQibla = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") throw new Error("Location permission denied");

      const loc:any = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const qibla = calculateQibla(loc.coords.latitude, loc.coords.longitude);
      setQiblaDirection(qibla);

      if (loc.coords.accuracy < 10) setAccuracy("high");
      else if (loc.coords.accuracy < 50) setAccuracy("medium");
      else setAccuracy("low");

      const address = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setLocationName(address[0]?.city || "Current Location");

      Animated.timing(rotateAnim, {
        toValue: qibla,
        duration: 1000,
        useNativeDriver: true,
      }).start();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      if (Platform.OS !== "web") Vibration.vibrate(50);
    } catch (err: any) {
      setError(err.message || "Failed to get Qibla");
      if (Platform.OS !== "web") Vibration.vibrate([100, 200, 100]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQibla();
  }, []);

  const shareQibla = useCallback(() => {
    Share.share({
      message: `My Qibla direction is ${Math.round(
        qiblaDirection
      )}° from ${locationName}`,
      title: "Qibla Direction",
    });
  }, [qiblaDirection, locationName]);

  const accuracyColor =
    accuracy === "high"
      ? "#4CAF50"
      : accuracy === "medium"
      ? "#FF9800"
      : "#F44336";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors[theme].background }]}
    >
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors[theme].card }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <ArrowLeft size={24} color={colors[theme].text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors[theme].text }]}>
          Qibla Compass
        </Text>
        <TouchableOpacity onPress={shareQibla} style={styles.headerButton}>
          <Share2 size={22} color={colors[theme].text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {error && (
          <Card >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <AlertTriangle size={20} color="#F44336" />
              <Text style={{ marginLeft: 8, color: colors[theme].text }}>
                {error}
              </Text>
            </View>
            <TouchableOpacity onPress={fetchQibla}>
              <Text style={{ color: colors[theme].primary, marginTop: 8 }}>
                Try Again
              </Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* Location Card */}
        <Card style={styles.locationCard}>
          <View style={styles.locationContainer}>
            <View
              style={[
                styles.locationIcon,
                { backgroundColor: colors[theme].primary + "20" },
              ]}
            >
              <MapPin size={20} color={colors[theme].primary} />
            </View>
            <View style={styles.locationInfo}>
              <Text
                style={[
                  styles.locationLabel,
                  { color: colors[theme].inactive },
                ]}
              >
                Current Location
              </Text>
              <Text
                style={[styles.locationText, { color: colors[theme].inactive }]}
              >
                {locationName}
              </Text>
            </View>
          </View>
        </Card>

        {/* Compass */}
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
              <Animated.View
                style={[styles.compassWrapper, { opacity: fadeAnim }]}
              >
                <View
                  style={[
                    styles.compassBackground,
                    { backgroundColor: colors[theme].card },
                  ]}
                >
                  {Array.from({ length: 24 }).map((_, i) => (
                    <View
                      key={`tick-${i}`}
                      style={[
                        styles.compassTick,
                        {
                          height: i % 6 === 0 ? 20 : 10,
                          backgroundColor:
                            i % 6 === 0
                              ? colors[theme].primary
                              : colors[theme].border,
                          transform: [{ rotate: `${i * 15}deg` }],
                        },
                      ]}
                    />
                  ))}
                  <Text
                    style={[
                      styles.directionLabel,
                      styles.northLabel,
                      { color: colors[theme].primary },
                    ]}
                  >
                    N
                  </Text>
                  <Text
                    style={[
                      styles.directionLabel,
                      styles.southLabel,
                      { color: colors[theme].text },
                    ]}
                  >
                    S
                  </Text>
                  <Text
                    style={[
                      styles.directionLabel,
                      styles.eastLabel,
                      { color: colors[theme].text },
                    ]}
                  >
                    E
                  </Text>
                  <Text
                    style={[
                      styles.directionLabel,
                      styles.westLabel,
                      { color: colors[theme].text },
                    ]}
                  >
                    W
                  </Text>

                  <Animated.View
                    style={[
                      styles.qiblaArrowContainer,
                      { transform: [{ rotate: spin }, { scale: pulseAnim }] },
                    ]}
                  >
                    <Image
                      source={ARROW_IMAGE}
                      style={[
                        styles.qiblaArrowImage,
                        { tintColor: colors[theme].primary },
                      ]}
                      resizeMode="contain"
                    />
                    <Animated.View
                      style={[
                        styles.arrowGlow,
                        {
                          backgroundColor: colors[theme].primary,
                          transform: [{ scale: pulseAnim }],
                        },
                      ]}
                    />
                  </Animated.View>

                  <View style={styles.compassCenter}>
                    <Animated.View
                      style={[
                        styles.compassCenterDot,
                        {
                          backgroundColor: colors[theme].primary,
                          transform: [{ scale: pulseAnim }],
                        },
                      ]}
                    />
                  </View>
                </View>
              </Animated.View>

              <Card style={styles.directionCard}>
                <View style={styles.directionInfo}>
                  <Text
                    style={[
                      styles.directionText,
                      { color: colors[theme].primary },
                    ]}
                  >
                    {Math.round(qiblaDirection)}°
                  </Text>
                  <View
                    style={[
                      styles.accuracyIndicator,
                      { backgroundColor: accuracyColor + "20" },
                    ]}
                  >
                    <Zap size={16} color={accuracyColor} />
                    <Text
                      style={[styles.accuracyText, { color: accuracyColor }]}
                    >
                      {accuracy === "high"
                        ? "High"
                        : accuracy === "medium"
                        ? "Medium"
                        : "Low"}{" "}
                      Accuracy
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.directionHelp,
                    { color: colors[theme].inactive },
                  ]}
                >
                  Face the green arrow towards the Kaaba in Mecca
                </Text>
              </Card>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  content: { flex: 1, padding: 16 },
  locationCard: { marginBottom: 20 },
  locationContainer: { flexDirection: "row", alignItems: "center" },
  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  locationInfo: { flex: 1 },
  locationLabel: { fontSize: 12, fontWeight: "500", marginBottom: 2 },
  locationText: { fontSize: 16,marginTop:5, fontWeight: "600" },
  compassContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  compassWrapper: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },
  compassBackground: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  compassTick: {
    position: "absolute",
    width: 2,
    top: 10,
    left: "50%",
    marginLeft: -1,
  },
  directionLabel: {
    position: "absolute",
    fontSize: 18,
    fontWeight: "700",
    width: 20,
    textAlign: "center",
  },
  northLabel: { top: 18, left: "50%", marginLeft: -10 },
  eastLabel: { top: "50%", right: 18, marginTop: -10 },
  westLabel: { top: "50%", left: 18, marginTop: -10 },
  southLabel: { bottom: 18, left: "50%", marginLeft: -10 },
  qiblaArrowContainer: {
    position: "absolute",
    width: COMPASS_SIZE * 0.7,
    height: COMPASS_SIZE * 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
  qiblaArrowImage: { width: "100%", height: "100%" },
  arrowGlow: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    opacity: 0.3,
  },
  compassCenter: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  compassCenterDot: { width: 18, height: 18, borderRadius: 9 },
  directionCard: { marginBottom: 16, padding: 18, borderRadius: 18 },
  directionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  directionText: { fontSize: 38, fontWeight: "700" },
  accuracyIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
  },
  accuracyText: { fontSize: 12, fontWeight: "600", marginLeft: 6 },
  directionHelp: { fontSize: 14, textAlign: "center" },
  loadingContainer: {
    height: COMPASS_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { fontSize: 16, marginTop: 16 },
  alertCard: { marginBottom: 16, borderLeftWidth: 4, padding: 14 },
});

export default QiblaScreen;
