import { useEffect, useState, useCallback } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationResult {
  coords: Coordinates;
  timestamp: number;
}

export const useLocation = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLocation = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Check permissions first
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Get last known position first (faster)
      const lastPosition = await Location.getLastKnownPositionAsync();
      if (lastPosition) {
        setLocation({
          latitude: lastPosition.coords.latitude,
          longitude: lastPosition.coords.longitude,
        });
      }

      // Then get fresh position
      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // Balanced accuracy for better battery life
      });

      setLocation({
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      });
    } catch (error) {
      console.error("Error getting location:", error);
      setErrorMsg("Could not get your current location");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return {
    location,
    errorMsg,
    isLoading,
    refreshLocation: fetchLocation,
  };
};
