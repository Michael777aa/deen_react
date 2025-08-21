import api from "@/redux/features/api/apiSlice";
import { IPrayerTime, IPrayerTimes, IQiblaDirection } from "@/types/prayer";
// const accessToken = await tokenCache?.getToken("accessToken");

export const getPrayerTimes = async (
  latitude: number,
  longitude: number
): Promise<IPrayerTimes> => {
  try {
    const response = await api.get(`/prayer/prayer-times`, {
      params: { latitude, longitude },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    throw error;
  }
};

export const getNextPrayer = async (
  latitude: number,
  longitude: number
): Promise<IPrayerTime> => {
  try {
    const response = await api.get(`/prayer/prayer-times/next`, {
      params: { latitude, longitude },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching next prayer:", error);
    throw error;
  }
};
export const getQiblaDirection = async (
  latitude: number,
  longitude: number
): Promise<IQiblaDirection> => {
  try {
    const response = await api.get(`/qibla/direction`, {
      params: { latitude, longitude },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching qibla direction:", error);
    throw error;
  }
};
