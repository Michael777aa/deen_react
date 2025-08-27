// app/qibla-immersive-3d.tsx
import React, { JSX, useEffect, useRef, useState } from "react";
import {
  View,
  Text as RNText,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  Vibration,
  Animated,
  Image,
} from "react-native";
import { Stack, router } from "expo-router";
import * as Location from "expo-location";
import { magnetometer, accelerometer, SensorTypes, setUpdateIntervalForType } from "react-native-sensors";
import LPF from "lpf";
import Svg, { Circle, G, Line, Path, Text as SvgText } from "react-native-svg";
import { ArrowLeft, AlertTriangle } from "lucide-react-native";

const { width, height } = Dimensions.get("window");
const COMPASS_SIZE = Math.min(width - 40, 420);
const R = COMPASS_SIZE / 2;

LPF.init([]);
LPF.smoothing = 0.18;

// helpers
const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

function calculateQibla(lat: number, lon: number) {
  const kaabaLat = toRad(21.4225);
  const kaabaLon = toRad(39.8262);
  const φ = toRad(lat);
  const λ = toRad(lon);
  const Δλ = kaabaLon - λ;

  const x = Math.sin(Δλ);
  const y = Math.cos(φ) * Math.tan(kaabaLat) - Math.sin(φ) * Math.cos(Δλ);
  const bearing = (toDeg(Math.atan2(x, y)) + 360) % 360;
  return bearing;
}

// produce heading from magnetometer (x,y)
function headingFromMag(x: number, y: number) {
  let raw = Math.atan2(y, x) * (180 / Math.PI);
  if (raw < 0) raw += 360;
  const heading = (raw + 270) % 360;
  return Math.round(LPF.next(heading));
}

// small clamp util
const clamp = (v: number, a = -1, b = 1) => Math.max(a, Math.min(b, v));

export default function QiblaImmersive3D(): JSX.Element {
  const [heading, setHeading] = useState<number>(0);
  const [qibla, setQibla] = useState<number>(0);
  const [locationName, setLocationName] = useState<string>("N/A");
  const [accuracy, setAccuracy] = useState<"high" | "medium" | "low">("high");
  const [error, setError] = useState<string | null>(null);

  // sensor refs
  const magSub = useRef<any>(null);
  const accSub = useRef<any>(null);

  // use animated values for smooth rotation and tilt
  const plateRotate = useRef(new Animated.Value(0)).current; // deg
  const arrowRotate = useRef(new Animated.Value(0)).current; // deg
  const tiltX = useRef(new Animated.Value(0)).current; // for parallax tilt
  const tiltY = useRef(new Animated.Value(0)).current;

  // pulse center
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  // fetch location + qibla
  const fetchQibla = async () => {
    try {
      setError(null);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") throw new Error("Location permission denied");

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const acc = loc.coords.accuracy ?? 999;
      if (acc < 10) setAccuracy("high");
      else if (acc < 50) setAccuracy("medium");
      else setAccuracy("low");

      const address = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      setLocationName(address[0]?.city || address[0]?.region || "Current Location");
      const q = calculateQibla(loc.coords.latitude, loc.coords.longitude);
      setQibla(q);

      if (Platform.OS !== "web") Vibration.vibrate(50);
    } catch (e: any) {
      setError(e?.message || "Failed to get Qibla");
      if (Platform.OS !== "web") Vibration.vibrate([80, 120, 80]);
    }
  };

  // subscribe sensors
  useEffect(() => {
    fetchQibla();

    // magnetometer
    setUpdateIntervalForType(SensorTypes.magnetometer, 32);
    magSub.current = magnetometer.subscribe(
      (data: any) => {
        const deg = headingFromMag(data.x, data.y);
        setHeading(deg);
      },
      (e: any) => {
        console.warn("Magnetometer error", e);
      }
    );

    // accelerometer (for tilt/parallax)
    setUpdateIntervalForType(SensorTypes.accelerometer, 80);
    accSub.current = accelerometer.subscribe(
      (acc: any) => {
        // accelerometer x,y ~ tilt axes; normalize to [-1..1]
        const nx = clamp(acc.x / 9.81, -0.7, 0.7);
        const ny = clamp(acc.y / 9.81, -0.7, 0.7);
        Animated.spring(tiltX, { toValue: nx, useNativeDriver: true, tension: 20, friction: 5 }).start();
        Animated.spring(tiltY, { toValue: ny, useNativeDriver: true, tension: 20, friction: 5 }).start();
      },
      (e: any) => console.warn("accelerometer error", e)
    );

    return () => {
      magSub.current && magSub.current.unsubscribe();
      accSub.current && accSub.current.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // animate rotations when heading/qibla change
  useEffect(() => {
    const plateDeg = -heading; // plate rotates opposite device heading
    const arrowDeg = ((qibla - heading + 360) % 360);

    Animated.timing(plateRotate, { toValue: plateDeg, duration: 180, useNativeDriver: true }).start();
    Animated.timing(arrowRotate, { toValue: arrowDeg, duration: 180, useNativeDriver: true }).start();
  }, [heading, qibla, plateRotate, arrowRotate]);

  // pulse style
  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] });
  const pulseOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0.12] });

  // derived transforms
  const tiltInterpolateX = tiltX.interpolate({ inputRange: [-1, 1], outputRange: ["15deg", "-15deg"] });
  const tiltInterpolateY = tiltY.interpolate({ inputRange: [-1, 1], outputRange: ["-10deg", "10deg"] });

  // path distance placeholder (would be computed via haversine if we had coords)
  const distanceLabel = "N/A";

  // asset placeholders (put your images in assets/images)
  const MARBLE = require("../assets/images/marble2.jpg"); // tiled floor texture
  const KAABA = require("../assets/images/3860026.jpg"); // marker icon

  // rotate animated value -> transform strings (use interpolate for rotate)
  const plateRotateStr = plateRotate.interpolate({ inputRange: [-360, 360], outputRange: ["-360deg", "360deg"] });
  const arrowRotateStr = arrowRotate.interpolate({ inputRange: [0, 360], outputRange: ["0deg", "360deg"] });

  return (
    <SafeAreaView style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.hBtn}>
          <ArrowLeft size={22} color="#EEE" />
        </TouchableOpacity>
        <RNText style={styles.hTitle}>Qibla Finder</RNText>
        <View style={styles.hBtn} />
      </View>

      {/* stage */}
      <View style={styles.stage}>
        {error ? (
          <View style={styles.errorBox}>
            <AlertTriangle size={18} color="#F44336" />
            <RNText style={styles.errorText}>{error}</RNText>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchQibla}>
              <RNText style={styles.retryText}>Try Again</RNText>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* 3D marble floor with perspective and rotating plate */}
        <Animated.View
          style={[
            styles.floorContainer,
            {
              transform: [
                { perspective: 1200 },
                { rotateX: tiltInterpolateY }, // tiltX -> rotateX
                { rotateY: tiltInterpolateX }, // tiltY -> rotateY
              ],
            },
          ]}
        >
          {/* tiled marble background (image scaled to cover) */}
          <Image source={MARBLE} style={styles.marbleBg} resizeMode="repeat" />

          {/* rotating compass plate (SVG) */}
          <Animated.View
            style={[
              styles.plateWrapper,
              {
                transform: [{ rotate: plateRotateStr }],
              },
            ]}
          >
            {/* decorative compass ring drawn with SVG so it's crisp */}
            <Svg width={COMPASS_SIZE} height={COMPASS_SIZE} style={{ position: "absolute" }}>
              <G>
                <Circle cx={R} cy={R} r={R - 2} fill="rgba(0,0,0,0.45)" />
                <Circle cx={R} cy={R} r={R * 0.84} fill="rgba(255,255,255,0.04)" />
                {/* ticks */}
                {[...Array(72)].map((_, i) => {
                  const ang = i * 5;
                  const isMajor = ang % 15 === 0;
                  const inner = R * 0.86;
                  const outer = inner + (isMajor ? 16 : 8);
                  const x1 = R + inner * Math.cos((ang * Math.PI) / 180);
                  const y1 = R + inner * Math.sin((ang * Math.PI) / 180);
                  const x2 = R + outer * Math.cos((ang * Math.PI) / 180);
                  const y2 = R + outer * Math.sin((ang * Math.PI) / 180);
                  return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000" strokeOpacity={isMajor ? 0.9 : 0.5} strokeWidth={isMajor ? 2 : 1} />;
                })}
                {/* cardinal letters */}
                {[
                  { l: "N", a: 0 },
                  { l: "E", a: 90 },
                  { l: "S", a: 180 },
                  { l: "W", a: 270 },
                ].map(({ l, a }) => {
                  const rad = (a * Math.PI) / 180;
                  const rr = R * 0.74;
                  const x = R + rr * Math.cos(rad);
                  const y = R + rr * Math.sin(rad) + 6;
                  return (
                    <SvgText key={l} x={x} y={y} fontSize={22} fill="#F5F5F5" fontWeight="700" textAnchor="middle">
                      {l}
                    </SvgText>
                  );
                })}
              </G>
            </Svg>

            {/* center plate overlay content */}
            <View style={styles.centerPlate}>
              <RNText style={styles.centerLogo}>MY ISLAM</RNText>
              <RNText style={styles.centerSub}>Location Service</RNText>
              <RNText style={styles.centerCity}>{locationName}</RNText>
            </View>
          </Animated.View>

          {/* fixed Qibla arrow + path (arrow rotates relative to phone) */}
          <Animated.View
            style={[
              styles.arrowContainer,
              { transform: [{ rotate: arrowRotateStr }] },
            ]}
            pointerEvents="none"
          >
            {/* dotted path */}
            <View style={styles.pathContainer}>
              {/* chevrons as a column */}
              {Array.from({ length: 10 }).map((_, i) => (
                <View key={i} style={styles.chevron} />
              ))}
            </View>

            {/* Kaaba marker at far end */}
            <View style={styles.kaabaWrap}>
              <Image source={KAABA} style={styles.kaabaIcon} resizeMode="contain" />
              <RNText style={styles.distanceLabel}>Distance {distanceLabel}</RNText>
            </View>

            {/* small compass N indicator at bottom of view */}
            <View style={styles.smallCompass}>
              <View style={styles.smallTriangle} />
              <RNText style={styles.smallN}>N</RNText>
            </View>
          </Animated.View>

          {/* pulsing center dot */}
          <Animated.View style={[styles.pulseDot, { transform: [{ scale: pulseScale }], opacity: pulseOpacity }]} />
          <View style={styles.centerDot} />
        </Animated.View>

        {/* readouts */}
        <RNText style={styles.readout}>
          Heading: {Math.round(heading)}°  |  Qibla: {Math.round(qibla)}°
        </RNText>
        <RNText style={[styles.readout, { color: accuracy === "high" ? "#4CAF50" : accuracy === "medium" ? "#FF9800" : "#F44336" }]}>
          Accuracy: {accuracy}
        </RNText>

        {/* calibrate */}
        <TouchableOpacity style={styles.calibrateBtn} onPress={fetchQibla}>
          <RNText style={styles.calibrateText}>Calibrate Compass</RNText>
        </TouchableOpacity>
      </View>

      {/* footer */}
      <View style={styles.footer}>
        <RNText style={styles.footerText}>Qibla Finder | Immersive Experience</RNText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0A0A0F" },

  header: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hBtn: { padding: 6 },
  hTitle: { color: "#F3F6F8", fontSize: 18, fontWeight: "700" },

  stage: { flex: 1, alignItems: "center", justifyContent: "center" },

  errorBox: {
    position: "absolute",
    top: 12,
    left: 18,
    right: 18,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#331818",
    borderWidth: 1,
    borderColor: "#5A2C2C",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 40,
  },
  errorText: { color: "#FFDCDC", marginLeft: 8, flex: 1 },
  retryBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: "#4D2F2F" },
  retryText: { color: "#FFDADA" },

  // floor
  floorContainer: {
    width: width,
    height: width * 0.9,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 6,
  },
  marbleBg: {
    position: "absolute",
    width: width * 1.7,
    height: width * 1.7,
    opacity: 1,
    top: - (width * 0.4),
    left: - (width * 0.35),
    transform: [{ rotate: "2deg" }],
  },

  plateWrapper: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  centerPlate: {
    position: "absolute",
    width: COMPASS_SIZE * 0.6,
    height: COMPASS_SIZE * 0.6,
    borderRadius: (COMPASS_SIZE * 0.6) / 2,
    backgroundColor: "rgba(5,5,5,0.75)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.06)",
  },
  centerLogo: {
    color: "#F3F6F8",
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 1,
  },
  centerSub: { color: "#E6E6E6", fontSize: 12, marginTop: 6, opacity: 0.85 },
  centerCity: { color: "#E6E6E6", fontSize: 14, marginTop: 4, fontWeight: "600" },

  // arrow + path that is fixed relative to phone (rotates by arrowRotate)
  arrowContainer: {
    position: "absolute",
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    alignItems: "center",
    justifyContent: "flex-start", // path points upward from center
    paddingTop: COMPASS_SIZE * 0.08,
  },

  pathContainer: {
    width: 6,
    alignItems: "center",
    justifyContent: "space-between",
    height: COMPASS_SIZE * 0.42,
  },
  chevron: {
    width: 12,
    height: 8,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    transform: [{ rotate: "-45deg" }],
    borderColor: "rgba(0,0,0,0.6)",
    marginVertical: 2,
    borderRadius: 2,
    opacity: 0.9,
  },

  kaabaWrap: {
    alignItems: "center",
    marginTop: 6,
  },
  kaabaIcon: { width: 46, height: 46, borderRadius: 6 },
  distanceLabel: { marginTop: 6, color: "#EAEAEA", fontSize: 12, opacity: 0.9 },

  smallCompass: { position: "absolute", bottom: 12, alignItems: "center" },
  smallTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 14,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#111",
    transform: [{ rotate: "0deg" }],
    opacity: 0.95,
  },
  smallN: { color: "#0B0B0B", marginTop: 4, fontSize: 12 },

  pulseDot: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#53FFA9",
    zIndex: 30,
  },
  centerDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#53FFA9",
    zIndex: 40,
  },

  readout: { color: "#FFFFFF", marginTop: 10, fontSize: 14 },

  calibrateBtn: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#111318",
    borderWidth: 1,
    borderColor: "#2C2C34",
  },
  calibrateText: { color: "#EDEDED", fontSize: 12, fontWeight: "600" },

  footer: {
    alignItems: "center",
    paddingVertical: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.04)",
  },
  footerText: { color: "#EDEDED", opacity: 0.85, fontSize: 14 },
});
