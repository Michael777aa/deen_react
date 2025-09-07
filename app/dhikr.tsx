import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Vibration,
  Platform,
  Animated,
  Dimensions,
  Share,
} from "react-native";
import { router, Stack } from "expo-router";
import { useSettingsStore } from "@/store/useSettingsStore";
import { colors } from "@/constants/colors";
import { Card } from "@/components/Card";
import {
  RefreshCw,
  Plus,
  Minus,
  Save,
  Award,
  Clock,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Share2,
  ArrowLeft,
} from "lucide-react-native";
import { dhikrList } from "@/mocks/dhikrData";

const { width } = Dimensions.get("window");
const COUNTER_SIZE = Math.min(width * 0.6, 240);

export default function DhikrScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? "dark" : "light";
  const [count, setCount] = useState(0);
  const [selectedDhikr, setSelectedDhikr] = useState(dhikrList[0]);
  const [savedCounts, setSavedCounts] = useState<
    { date: string; count: number; dhikr: string }[]
  >([]);
  const [targetCount, setTargetCount] = useState(33);
  const [streak, setStreak] = useState(5); // Mock streak count
  const [showHistory, setShowHistory] = useState(false);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Update progress animation when count changes
    Animated.timing(progressAnim, {
      toValue: count / targetCount,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [count, targetCount]);

  const incrementCount = () => {
    if (count < 999) {
      setCount(count + 1);

      // Rotate animation
      Animated.timing(rotateAnim, {
        toValue: (count + 1) % 33 === 0 ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        rotateAnim.setValue(0);
      });

      // Scale animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      if (Platform.OS !== "web") {
        Vibration.vibrate(10);
      }

      // Vibrate differently when target is reached
      if (count + 1 === targetCount && Platform.OS !== "web") {
        Vibration.vibrate([0, 100, 50, 100]);
      }
    }
  };

  const decrementCount = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const resetCount = () => {
    setCount(0);
  };

  const saveCount = () => {
    if (count > 0) {
      const newSavedCount = {
        date: new Date().toISOString(),
        count,
        dhikr: selectedDhikr.name,
      };
      setSavedCounts([newSavedCount, ...savedCounts]);
      resetCount();

      if (Platform.OS !== "web") {
        Vibration.vibrate([0, 50, 30, 50]);
      }
    }
  };

  const selectDhikr = (dhikr: (typeof dhikrList)[0]) => {
    setSelectedDhikr(dhikr);
    resetCount();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const progressCircle = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const getProgressColor = () => {
    if (count / targetCount >= 1) return colors[theme].primary;
    if (count / targetCount >= 0.5) return "#FF9800";
    return colors[theme].inactive;
  };

  const onShare = async () => {
    try {
      const message = `📿 Dhikr Progress\n\nDhikr: ${selectedDhikr.name}\nCount: ${count}/${targetCount}\n\nKeep going! ✨`;
      await Share.share({
        message,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };
  return (
    <>
      <Stack.Screen options={{ title: "Dhikr Counter" }} />
      <View
        style={[
          styles.container,
          { backgroundColor: colors[theme].background },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
        
          <View style={styles.streakContainer}>
            <Card style={styles.streakCard}>
              <View style={styles.streakContent}>
              <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <ArrowLeft size={24} color={colors[theme].text} />
            </TouchableOpacity>
                <View style={styles.streakInfo}>
                  
                  <Text
                    style={[styles.streakTitle, { color: colors[theme].text }]}
                  >
                    Your Dhikr Streak
                  </Text>
                  <Text
                    style={[
                      styles.streakSubtitle,
                      { color: colors[theme].inactive },
                    ]}
                  >
                    Keep it going!
                  </Text>
                </View>
                <View
                  style={[
                    styles.streakBadge,
                    { backgroundColor: colors[theme].primary },
                  ]}
                >
                  <Award size={16} color="#FFFFFF" />
                  <Text style={styles.streakCount}>{streak} days</Text>
                </View>
              </View>
            </Card>
          </View>

          <Card style={styles.dhikrCard}>
            <Text style={[styles.dhikrArabic, { color: colors[theme].text }]}>
              {selectedDhikr.arabic}
            </Text>
            <Text
              style={[
                styles.dhikrTransliteration,
                { color: colors[theme].text },
              ]}
            >
              {selectedDhikr.transliteration}
            </Text>
            <Text
              style={[
                styles.dhikrTranslation,
                { color: colors[theme].inactive },
              ]}
            >
              {selectedDhikr.translation}
            </Text>
          </Card>

          <View style={styles.counterContainer}>
            <Animated.View
              style={[
                styles.counterWrapper,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <View
                style={[
                  styles.countDisplay,
                  {
                    backgroundColor: colors[theme].card,
                    borderColor:
                      count >= targetCount
                        ? colors[theme].primary
                        : colors[theme].border,
                  },
                ]}
              >
                {/* Progress Circle */}
                <View style={styles.progressCircle}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: getProgressColor(),
                        width: COUNTER_SIZE / 2,
                        height: COUNTER_SIZE,
                        borderTopRightRadius: COUNTER_SIZE / 2,
                        borderBottomRightRadius: COUNTER_SIZE / 2,
                        transform: [
                          { translateX: -COUNTER_SIZE / 4 },
                          { rotate: progressCircle },
                          { translateX: COUNTER_SIZE / 4 },
                        ],
                      },
                    ]}
                  />
                </View>

                <Animated.View
                  style={[
                    styles.countTextContainer,
                    { transform: [{ rotate: spin }] },
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      {
                        color:
                          count >= targetCount
                            ? colors[theme].primary
                            : colors[theme].text,
                        fontSize: count >= 100 ? 60 : 80,
                      },
                    ]}
                  >
                    {count}
                  </Text>
                </Animated.View>

                <Text
                  style={[styles.targetText, { color: colors[theme].inactive }]}
                >
                  Target: {targetCount}
                </Text>
              </View>
            </Animated.View>

            <View style={styles.counterButtons}>
              <TouchableOpacity
                style={[
                  styles.counterButton,
                  { backgroundColor: colors[theme].card },
                ]}
                onPress={decrementCount}
              >
                <Minus size={24} color={colors[theme].text} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.mainCounterButton,
                  { backgroundColor: colors[theme].primary },
                ]}
                onPress={incrementCount}
              >
                <Plus size={32} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.counterButton,
                  { backgroundColor: colors[theme].card },
                ]}
                onPress={resetCount}
              >
                <RefreshCw size={24} color={colors[theme].text} />
              </TouchableOpacity>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  {
                    backgroundColor:
                      count > 0
                        ? colors[theme].primary
                        : colors[theme].inactive,
                    opacity: count > 0 ? 1 : 0.5,
                  },
                ]}
                onPress={saveCount}
                disabled={count === 0}
              >
                <Save size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Count</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.shareButton,
                  { backgroundColor: colors[theme].card },
                ]}
                onPress={onShare} 
              >
                <Share2 size={20} color={colors[theme].text} />
                <Text
                  style={[
                    styles.shareButtonText,
                    { color: colors[theme].text },
                  ]}
                >
                  Share
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
            Select Dhikr
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dhikrSelector}
          >
            {dhikrList.map((dhikr, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dhikrOption,
                  {
                    backgroundColor:
                      selectedDhikr.id === dhikr.id
                        ? colors[theme].primary
                        : colors[theme].card,
                  },
                ]}
                onPress={() => selectDhikr(dhikr)}
              >
                <Text
                  style={[
                    styles.dhikrOptionText,
                    {
                      color:
                        selectedDhikr.id === dhikr.id
                          ? "#FFFFFF"
                          : colors[theme].text,
                    },
                  ]}
                >
                  {dhikr.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
            Target Count
          </Text>

          <View style={styles.targetSelector}>
            {[33, 99, 100, 500].map((target) => (
              <TouchableOpacity
                key={target}
                style={[
                  styles.targetOption,
                  {
                    backgroundColor:
                      targetCount === target
                        ? colors[theme].primary
                        : colors[theme].card,
                  },
                ]}
                onPress={() => setTargetCount(target)}
              >
                <Text
                  style={[
                    styles.targetOptionText,
                    {
                      color:
                        targetCount === target ? "#FFFFFF" : colors[theme].text,
                    },
                  ]}
                >
                  {target}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.historyHeader}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors[theme].text, marginBottom: 0 },
              ]}
            >
              History
            </Text>
            <TouchableOpacity onPress={() => setShowHistory(!showHistory)}>
              <Text
                style={[
                  styles.toggleHistoryText,
                  { color: colors[theme].primary },
                ]}
              >
                {showHistory ? "Hide" : "Show All"}
              </Text>
            </TouchableOpacity>
          </View>

          {savedCounts.length > 0 ? (
            <>
              {(showHistory ? savedCounts : savedCounts.slice(0, 3)).map(
                (saved, index) => (
                  <Card key={index} style={styles.historyCard}>
                    <View style={styles.historyItem}>
                      <View style={styles.historyLeft}>
                        <View
                          style={[
                            styles.historyCountBadge,
                            { backgroundColor: colors[theme].primary + "20" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.historyCount,
                              { color: colors[theme].primary },
                            ]}
                          >
                            {saved.count}
                          </Text>
                        </View>
                        <View style={styles.historyInfo}>
                          <Text
                            style={[
                              styles.historyDhikr,
                              { color: colors[theme].text },
                            ]}
                          >
                            {saved.dhikr}
                          </Text>
                          <Text
                            style={[
                              styles.historyDate,
                              { color: colors[theme].inactive },
                            ]}
                          >
                            {formatDate(saved.date)}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.historyAction}>
                        <ChevronRight
                          size={20}
                          color={colors[theme].inactive}
                        />
                      </TouchableOpacity>
                    </View>
                  </Card>
                )
              )}

              {!showHistory && savedCounts.length > 3 && (
                <TouchableOpacity
                  style={[
                    styles.viewAllButton,
                    { borderColor: colors[theme].border },
                  ]}
                  onPress={() => setShowHistory(true)}
                >
                  <Text
                    style={[styles.viewAllText, { color: colors[theme].text }]}
                  >
                    View All History
                  </Text>
                  <ChevronRight size={16} color={colors[theme].text} />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View style={styles.emptyHistoryContainer}>
              <Calendar size={48} color={colors[theme].inactive} />
              <Text
                style={[styles.emptyHistoryText, { color: colors[theme].text }]}
              >
                No history yet
              </Text>
              <Text
                style={[
                  styles.emptyHistorySubtext,
                  { color: colors[theme].inactive },
                ]}
              >
                Your saved dhikr counts will appear here
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 40
  },
  streakContainer: {
    marginBottom: 16,
  },
  streakCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  streakContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakInfo: {
    flex: 1,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  streakSubtitle: {
    fontSize: 14,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  streakCount: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 6,
  },
  dhikrCard: {
    alignItems: "center",
    marginBottom: 24,
  },
  dhikrArabic: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  dhikrTransliteration: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 8,
  },
  dhikrTranslation: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  counterContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  counterWrapper: {
    marginBottom: 16,
  },
  countDisplay: {
    width: COUNTER_SIZE,
    height: COUNTER_SIZE,
    borderRadius: COUNTER_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    overflow: "hidden",
  },
  progressCircle: {
    position: "absolute",
    width: COUNTER_SIZE,
    height: COUNTER_SIZE,
    borderRadius: COUNTER_SIZE / 2,
    overflow: "hidden",
  },
  progressFill: {
    position: "absolute",
    left: COUNTER_SIZE / 2,
    top: 0,
  },
  countTextContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    fontSize: 80,
    fontWeight: "bold",
  },

  headerButton: { padding: 8, borderRadius: 50 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },

  targetText: {
    fontSize: 14,
    marginTop: 8,
    position: "absolute",
    bottom: 20,
  },
  counterButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  counterButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 12,
  },
  mainCounterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: 12,
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  dhikrSelector: {
    flexDirection: "row",
    marginBottom: 24,
  },
  dhikrOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginRight: 12,
  },
  dhikrOptionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  targetSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  targetOption: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  targetOptionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  toggleHistoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  historyCard: {
    marginBottom: 8,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  historyCountBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  historyCount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  historyInfo: {
    flex: 1,
  },
  historyDhikr: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
  },
  historyAction: {
    padding: 8,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 16,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  emptyHistoryContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyHistoryText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
});
