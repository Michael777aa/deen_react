import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Animated,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

interface HomeHeaderProps {
  user: any;
  greeting: string;
  theme: "light" | "dark";
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  user,
  greeting,
  theme,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;


  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.headerContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Centered Logo */}
      <View style={styles.logoWrapper}>
        <Text style={styles.logo}>Deen Daily</Text>
      </View>

      <ImageBackground
        source={require("@/assets/images/header.jpg")}
        style={styles.headerBackground}
        imageStyle={styles.headerBackgroundImage}
      >
        <View style={styles.headerOverlay}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>{greeting},</Text>
              <Text style={styles.name}>{user.name}</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/settings")}
              style={styles.avatarContainer}
            >
              <Image
                source={{
                  uri:
                    user.picture?.replace("http://", "https://") ||
                    "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
                }}
                style={styles.avatar}
              />
              <View style={styles.onlineIndicator} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 100, // adjust to push header down
    height: 200, // taller to fit bigger logo
    marginBottom: 20,
  },
  logoWrapper: {
    position: "absolute",
    top: -55,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "rgba(23, 142, 60, 0.5)",
    textShadowColor: "rgba(94, 93, 93, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  headerBackground: {
    width: "100%",
    height: "100%",
  },
  headerBackgroundImage: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    justifyContent: "flex-end",
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.8,
    marginTop: 4,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});
