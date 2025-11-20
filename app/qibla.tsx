// app/qibla-immersive-3d.tsx
import React, {  useEffect, useRef, useState } from "react";
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

export default function QiblaImmersive3D() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <RNText style={{ color: "#fff" }}>HELLO WORLD</RNText>
    </View>
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
