import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Share, ActivityIndicator } from "react-native";
import { Card } from "@/components/Card";
import { Heart, MessageCircle } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useSettingsStore } from "@/store/useSettingsStore";
import { getInspiration } from "@/redux/features/inspiration/inspirationApi";

export const DailyInspiration: React.FC = () => {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? "dark" : "light";

  const [inspiration, setInspiration] = useState<{ quote: string; attribution: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const shareInspiration = useCallback(async () => {
    try {
      if (!inspiration) return; // nothing to share
      const message = `"${inspiration.quote}"\n\n- ${inspiration.attribution}\n\nShared via Deen Daily App`;

      await Share.share({
        message,
        title: "Daily Islamic Inspiration",
      });
    } catch (err) {
      console.error("Error sharing inspiration:", err);
    }
  }, [inspiration]);

  useEffect(() => {
    const fetchInspiration = async () => {
      try {
        setIsLoading(true);
        const data = await getInspiration();
        setInspiration(data);
      } catch (error) {
        console.error("Failed to fetch inspiration:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInspiration();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.quoteContainer, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={colors[theme].primary} />
      </View>
    );
  }

  if (!inspiration) {
    return (
      <View style={styles.quoteContainer}>
        <Text style={{ color: colors[theme].text }}>No inspiration available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.quoteContainer}>
      <Card style={styles.quoteCard}>
        <View style={styles.quoteHeader}>
          <Heart size={20} color={colors[theme].primary} />
          <Text style={[styles.quoteLabel, { color: colors[theme].primary }]}>
            Daily Inspiration
          </Text>
        </View>
        <Text style={[styles.quoteText, { color: colors[theme].text }]}>
          {inspiration.quote}
        </Text>
        <Text style={[styles.quoteSource, { color: colors[theme].inactive }]}>
          - {inspiration.attribution || "unknown"}
        </Text>
        <View style={styles.quoteActions}>
          <TouchableOpacity style={styles.quoteAction}>
            <Heart size={16} color={colors[theme].primary} />
            <Text style={[styles.quoteActionText, { color: colors[theme].primary }]}>
              Save
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quoteAction} onPress={shareInspiration}>
            <MessageCircle size={16} color={colors[theme].inactive} />
            <Text style={[styles.quoteActionText, { color: colors[theme].inactive }]}>
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  quoteContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  quoteCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  quoteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  quoteLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    lineHeight: 24,
    marginBottom: 8,
  },
  quoteSource: {
    fontSize: 14,
    marginBottom: 12,
  },
  quoteActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 12,
    marginTop: 4,
  },
  quoteAction: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  quoteActionText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
});
