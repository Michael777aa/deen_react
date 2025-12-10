// app/qibla.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import * as Location from "expo-location";
import { Magnetometer } from "expo-sensors";

export default function Qibla() {
  const [heading, setHeading] = useState(0);
  const [qibla, setQibla] = useState(0);
  const [loading, setLoading] = useState(true);

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

  // Get location
  useEffect(() => {
    const load = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission is required");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const dir = getQiblaDirection(loc.coords.latitude, loc.coords.longitude);
      setQibla(dir);

      setLoading(false);
    };

    load();
  }, []);

  // Magnetometer heading
  useEffect(() => {
    Magnetometer.setUpdateInterval(200);

    const subscription = Magnetometer.addListener((data) => {
      let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
      angle = angle < 0 ? angle + 360 : angle;
      setHeading(angle);
    });

    return () => subscription.remove();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: "#fff", marginTop: 12 }}>Loading Qibla…</Text>
      </View>
    );
  }

  // Rotation difference
  const rotate = qibla - heading;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qibla Direction</Text>

      <View style={styles.arrowContainer}>
        <Image
          source={{ uri: "https://i.imgur.com/ihxW5hS.png" }} // simple arrow icon
          style={[
            styles.arrow,
            { transform: [{ rotate: `${rotate}deg` }] },
          ]}
        />
      </View>

      <Text style={styles.label}>Point your phone toward the arrow</Text>

      <Text style={styles.info}>Phone Heading: {heading.toFixed(0)}°</Text>
      <Text style={styles.info}>Qibla Direction: {qibla.toFixed(0)}°</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0F",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  title: { fontSize: 24, color: "#fff", marginBottom: 30, fontWeight: "700" },
  arrowContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    width: 180,
    height: 180,
    tintColor: "#53FFA9",
  },
  label: { color: "#fff", marginTop: 20, fontSize: 16 },
  info: { color: "#bbb", marginTop: 10 },
});
