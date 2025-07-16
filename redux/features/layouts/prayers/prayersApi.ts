import axios from "axios";
import { API_BASE_URL } from "@/redux/features/api/apiSlice";
import { IPrayerTime, IPrayerTimes, IQiblaDirection } from "@/types/prayer";

export const getPrayerTimes = async (
  latitude: number,
  longitude: number
): Promise<IPrayerTimes> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/prayer/prayer-times`, {
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
    const response = await axios.get(
      `${API_BASE_URL}/prayer/prayer-times/next`,
      {
        params: { latitude, longitude },
      }
    );
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
    const response = await axios.get(`${API_BASE_URL}/qibla/direction`, {
      params: { latitude, longitude },
    });
    console.log("GET QIBLA", response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching qibla direction:", error);
    throw error;
  }
};
