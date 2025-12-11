import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  SafeAreaView,
  Share,
  Alert,
  Modal,
  Dimensions,
} from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { useSettingsStore } from "@/store/useSettingsStore";
import { colors } from "@/constants/colors";
import { Card } from "@/components/Card";
import {
  Bookmark,
  Share2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Volume2,
  RotateCcw,
} from "lucide-react-native";
import { quranSurahs, getQuranVerses, quranReciters } from "@/mocks/quranData";
import { Audio } from "expo-av";

const { width } = Dimensions.get("window");

export default function SurahDetailScreen() {
  const params = useLocalSearchParams();
  const surahNumber = parseInt((params.surah as string) || "1");
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? "dark" : "light";
  const [isLoading, setIsLoading] = useState(true);
  const [verses, setVerses] = useState<any[]>([]);
  const [surahInfo, setSurahInfo] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fontSize, setFontSize] = useState(20);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [bookmarkedVerses, setBookmarkedVerses] = useState<number[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentVerse, setCurrentVerse] = useState<number | null>(null);
  const [selectedReciter, setSelectedReciter] = useState(quranReciters[0]);
  const [showReciterModal, setShowReciterModal] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const playbackInterval: any = useRef<NodeJS.Timeout | null>(null);

  // Theme-aware styles
  const themeStyles = {
    settingButton: {
      backgroundColor: theme === "dark" ? colors.dark.card : "#f0f0f0",
    },
    settingButtonActive: {
      backgroundColor: colors[theme].primary,
    },
    settingButtonText: {
      color: theme === "dark" ? colors.dark.text : "#333333",
    },
    settingButtonTextActive: {
      color: "#FFFFFF",
    },
    verseCard: {
      backgroundColor: theme === "dark" ? colors.dark.card : "#FFFFFF",
    },
    verseActionButton: {
      backgroundColor:
        theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
    },
    audioPlayer: {
      backgroundColor:
        theme === "dark"
          ? "rgba(74, 144, 226, 0.2)"
          : "rgba(74, 144, 226, 0.1)",
    },
    reciterOption: {
      backgroundColor:
        theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
    },
    navigationButton: {
      backgroundColor:
        theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
    },
  };

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Get audio URL based on reciter pattern
  const getAudioUrl = (verseNumber?: number) => {
    const formattedSurahNumber = surahNumber.toString().padStart(3, "0");

    if (selectedReciter.pattern === "verse" && verseNumber) {
      const formattedVerseNumber = verseNumber.toString().padStart(3, "0");
      return `${selectedReciter.baseUrl}${formattedSurahNumber}${formattedVerseNumber}.mp3`;
    } else {
      return `${selectedReciter.baseUrl}${formattedSurahNumber}.mp3`;
    }
  };

  // Playback status update handler
  const onPlaybackStatusUpdate = (status: any) => {
    if (!status.isLoaded) {
      if (status.error) {
        console.error("Playback error:", status.error);
        setIsPlaying(false);
        setCurrentVerse(null);
        Alert.alert(
          "Playback Error",
          "Could not play audio. Please try another reciter."
        );
      }
      return;
    }

    if (status.didJustFinish) {
      setIsPlaying(false);
      setCurrentVerse(null);
      setCurrentPosition(0);
    } else if (status.positionMillis !== undefined) {
      setCurrentPosition(status.positionMillis / 1000);
    }

    if (status.durationMillis !== undefined) {
      setDuration(status.durationMillis / 1000);
    }
  };

  // Setup playback interval to update position
  useEffect(() => {
    if (isPlaying && !playbackInterval.current) {
      playbackInterval.current = setInterval(() => {
        if (sound && !isSeeking) {
          sound.getStatusAsync().then((status) => {
            if (status.isLoaded) {
              setCurrentPosition(status.positionMillis / 1000);
            }
          });
        }
      }, 500);
    } else if (!isPlaying && playbackInterval.current) {
      clearInterval(playbackInterval.current);
      playbackInterval.current = null;
    }

    return () => {
      if (playbackInterval.current) {
        clearInterval(playbackInterval.current);
        playbackInterval.current = null;
      }
    };
  }, [isPlaying, isSeeking]);

  // Audio playback functions
  const loadAudio = async (verseNumber?: number) => {
    try {
      // Stop current playback if any
      if (sound) {
        await sound.unloadAsync();
      }

      const audioUri = getAudioUrl(verseNumber);
      console.log("Loading audio from:", audioUri);

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      setIsPlaying(true);
      if (verseNumber) setCurrentVerse(verseNumber);
    } catch (error) {
      console.error("Error loading audio:", error);
      Alert.alert(
        "Error",
        "Could not play audio. Please try another reciter or check your internet connection."
      );
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await sound?.pauseAsync();
      setIsPlaying(false);
    } else {
      if (sound) {
        await sound.playAsync();
        setIsPlaying(true);
      } else {
        // If no sound is loaded, load the full surah audio
        await loadAudio();
      }
    }
  };

  const playVerse = async (verseNumber: number) => {
    // If the same verse is already playing, toggle pause/play
    if (currentVerse === verseNumber && sound) {
      await togglePlayPause();
    } else {
      // Otherwise load and play the new verse
      await loadAudio(verseNumber);
    }
  };

  // Seek to position
  const seekToPosition = async (position: number) => {
    if (sound) {
      setIsSeeking(true);
      await sound.setPositionAsync(position * 1000);
      setCurrentPosition(position);
      setIsSeeking(false);
    }
  };

  // Skip forward/backward
  const skipForward = async () => {
    if (sound && duration) {
      const newPosition = Math.min(currentPosition + 10, duration);
      await seekToPosition(newPosition);
    }
  };

  const skipBackward = async () => {
    if (sound) {
      const newPosition = Math.max(currentPosition - 10, 0);
      await seekToPosition(newPosition);
    }
  };

  const selectReciter = (reciter: any) => {
    setSelectedReciter(reciter);
    setShowReciterModal(false);

    // If audio is currently playing, restart with new reciter
    if (isPlaying && sound) {
      const currentVerseToPlay = currentVerse;
      sound.unloadAsync().then(() => {
        setSound(null);
        if (currentVerseToPlay) {
          loadAudio(currentVerseToPlay);
        } else {
          loadAudio();
        }
      });
    }
  };

  // Share functions
  const shareSurah = async () => {
    try {
      await Share.share({
        message: `Check out Surah ${surahInfo.englishName} from the Deen Daily app!`,
        url: "http://playspot.uz",
        title: `Surah ${surahInfo.englishName}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const shareVerse = async (verse: any) => {
    try {
      await Share.share({
        message: `"${verse.arabic}"\n\n${verse.translation}\n\n- Surah ${surahInfo.englishName}, Verse ${verse.number}`,
        title: `Quran Verse ${verse.number}`,
      });
    } catch (error) {
      console.error("Error sharing verse:", error);
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (playbackInterval.current) {
        clearInterval(playbackInterval.current);
      }
    };
  }, [sound]);

  useEffect(() => {
    const loadSurah = async () => {
      setIsLoading(true);
      try {
        // Find surah info
        const info = quranSurahs.find((s) => s.number === surahNumber);
        if (!info) {
          throw new Error("Surah not found");
        }
        setSurahInfo(info);

        // Get verses (mock data)
        const surahVerses: any = getQuranVerses(surahNumber);
        setVerses(surahVerses);

        setTimeout(() => {
          setIsLoading(false);

          // Fade in animation
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }).start();
        }, 800);
      } catch (error) {
        console.error("Error loading surah:", error);
        setIsLoading(false);
      }
    };

    if (surahNumber && !isNaN(surahNumber)) {
      loadSurah();
    } else {
      setIsLoading(false);
    }
  }, [surahNumber]);

  const toggleBookmark = (verseNumber: number) => {
    if (bookmarkedVerses.includes(verseNumber)) {
      setBookmarkedVerses(bookmarkedVerses.filter((v) => v !== verseNumber));
    } else {
      setBookmarkedVerses([...bookmarkedVerses, verseNumber]);
    }
  };

  const navigateToPreviousSurah = () => {
    if (surahNumber > 1) {
      router.push(`/quran/${surahNumber - 1}`);
    }
  };

  const navigateToNextSurah = () => {
    if (surahNumber < 114) {
      router.push(`/quran/${surahNumber + 1}`);
    }
  };

  const goBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors[theme].background },
        ]}
      >
        <ActivityIndicator size="large" color={colors[theme].primary} />
        <Text style={[styles.loadingText, { color: colors[theme].text }]}>
          Loading Surah...
        </Text>
      </View>
    );
  }

  if (!surahInfo) {
    return (
      <View
        style={[
          styles.errorContainer,
          { backgroundColor: colors[theme].background },
        ]}
      >
        <Text style={[styles.errorText, { color: colors[theme].text }]}>
          Surah not found
        </Text>
        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: colors[theme].primary },
          ]}
          onPress={goBack}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors[theme].background }]}
    >
      <Stack.Screen
        options={{
          title: `Surah ${surahInfo.englishName}`,
          headerShown: false,
        }}
      />

      {/* Custom Header */}
      <View
        style={[styles.customHeader, { backgroundColor: colors[theme].card }]}
      >
        <TouchableOpacity onPress={goBack} style={styles.headerButton}>
          <ArrowLeft size={24} color={colors[theme].text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors[theme].text }]}>
          Surah {surahInfo.englishName}
        </Text>
        <TouchableOpacity style={styles.headerButton} onPress={shareSurah}>
          <Share2 size={24} color={colors[theme].text} />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Simplified Surah Header */}
        <View style={styles.surahHeader}>
          <View style={styles.surahHeaderContent}>
            <Text style={[styles.surahName, { color: colors[theme].text }]}>
              {surahInfo.englishName}
            </Text>
            <Text
              style={[styles.surahNameArabic, { color: colors[theme].text }]}
            >
              {surahInfo.name}
            </Text>
            <Text style={[styles.surahInfo, { color: colors[theme].inactive }]}>
              {surahInfo.revelationType} • {surahInfo.numberOfAyahs} verses
            </Text>
          </View>
        </View>

        {/* Audio Player Section */}
        <Card>
          <View style={styles.reciterHeader}>
            <Volume2 size={20} color={colors[theme].primary} />
            <Text style={[styles.playerText, { color: colors[theme].primary }]}>
              {selectedReciter.name}
            </Text>
            <TouchableOpacity
              style={styles.reciterChangeButton}
              onPress={() => setShowReciterModal(true)}
            >
              <Text
                style={[
                  styles.reciterChangeText,
                  { color: colors[theme].primary },
                ]}
              >
                Change
              </Text>
            </TouchableOpacity>
          </View>

          {/* Duration and Progress */}
          {duration > 0 && (
            <View style={styles.progressContainer}>
              <Text style={[styles.timeText, { color: colors[theme].primary }]}>
                {formatTime(currentPosition)}
              </Text>

              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: colors[theme].primary + "40" },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${(currentPosition / duration) * 100}%`,
                        backgroundColor: colors[theme].primary,
                      },
                    ]}
                  />
                </View>

                <TouchableOpacity
                  style={styles.seekTouchArea}
                  onPress={(e) => {
                    const { locationX } = e.nativeEvent;
                    const progressWidth = e.currentTarget.measure(
                      (x, y, width, height) => {
                        const newPosition = (locationX / width) * duration;
                        seekToPosition(newPosition);
                      }
                    );
                  }}
                />
              </View>

              <Text style={[styles.timeText, { color: colors[theme].primary }]}>
                {formatTime(duration)}
              </Text>
            </View>
          )}

          {/* Playback Controls */}
          <View style={styles.playbackControls}>
            <TouchableOpacity
              onPress={skipBackward}
              style={styles.controlButton}
            >
              <RotateCcw size={24} color={colors[theme].primary} />
              <Text
                style={[styles.controlText, { color: colors[theme].primary }]}
              >
                10s
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={togglePlayPause}
              style={[
                styles.playPauseButton,
                { backgroundColor: colors[theme].primary },
              ]}
            >
              {isPlaying ? (
                <Pause size={28} color="#FFFFFF" />
              ) : (
                <Play size={28} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={skipForward}
              style={styles.controlButton}
            >
              <Text
                style={[styles.controlText, { color: colors[theme].primary }]}
              >
                10s
              </Text>
              <RotateCcw
                size={24}
                color={colors[theme].primary}
                style={{ transform: [{ scaleX: -1 }] }}
              />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Settings Bar */}
        <View style={styles.settingsBar}>
          <TouchableOpacity
            style={[
              styles.settingButton,
              themeStyles.settingButton,
              showTranslation && [
                styles.settingButtonActive,
                themeStyles.settingButtonActive,
              ],
            ]}
            onPress={() => setShowTranslation(!showTranslation)}
          >
            <Text
              style={[
                styles.settingButtonText,
                themeStyles.settingButtonText,
                showTranslation && [
                  styles.settingButtonTextActive,
                  themeStyles.settingButtonTextActive,
                ],
              ]}
            >
              Translation
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.settingButton,
              themeStyles.settingButton,
              showTransliteration && [
                styles.settingButtonActive,
                themeStyles.settingButtonActive,
              ],
            ]}
            onPress={() => setShowTransliteration(!showTransliteration)}
          >
            <Text
              style={[
                styles.settingButtonText,
                themeStyles.settingButtonText,
                showTransliteration && [
                  styles.settingButtonTextActive,
                  themeStyles.settingButtonTextActive,
                ],
              ]}
            >
              Transliration
            </Text>
          </TouchableOpacity>

          <View style={styles.fontSizeControl}>
            <TouchableOpacity
              style={[
                styles.fontSizeButton,
                { backgroundColor: colors[theme].card },
              ]}
              onPress={() => setFontSize(Math.max(16, fontSize - 2))}
            >
              <Text style={{ color: colors[theme].text, fontSize: 16 }}>
                A-
              </Text>
            </TouchableOpacity>
            <Text style={[styles.fontSizeValue, { color: colors[theme].text }]}>
              {fontSize}
            </Text>
            <TouchableOpacity
              style={[
                styles.fontSizeButton,
                { backgroundColor: colors[theme].card },
              ]}
              onPress={() => setFontSize(Math.min(30, fontSize + 2))}
            >
              <Text style={{ color: colors[theme].text, fontSize: 16 }}>
                A+
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.versesContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Bismillah for all surahs except At-Tawbah (9) */}
          {surahNumber !== 9 && (
            <Card style={styles.bismillahCard}>
              <Text
                style={[styles.bismillahText, { color: colors[theme].text }]}
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </Text>
              <Text
                style={[
                  styles.bismillahTranslation,
                  { color: colors[theme].inactive },
                ]}
              >
                In the name of Allah, the Most Gracious, the Most Merciful
              </Text>
            </Card>
          )}

          {verses.map((verse, index) => (
            <Card key={index}>
              <View style={styles.verseHeader}>
                <View
                  style={[
                    styles.verseNumberContainer,
                    { backgroundColor: colors[theme].primary + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.verseNumber,
                      { color: colors[theme].primary },
                    ]}
                  >
                    {verse.number}
                  </Text>
                </View>

                <View style={styles.verseActions}>
                  <TouchableOpacity
                    style={[
                      styles.verseActionButton,
                      themeStyles.verseActionButton,
                    ]}
                    onPress={() => toggleBookmark(verse.number)}
                  >
                    <Bookmark
                      size={18}
                      color={
                        bookmarkedVerses.includes(verse.number)
                          ? colors[theme].primary
                          : colors[theme].inactive
                      }
                      fill={
                        bookmarkedVerses.includes(verse.number)
                          ? colors[theme].primary
                          : "transparent"
                      }
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.verseActionButton,
                      themeStyles.verseActionButton,
                    ]}
                    onPress={() => playVerse(verse.number)}
                  >
                    {isPlaying && currentVerse === verse.number ? (
                      <Pause size={18} color={colors[theme].primary} />
                    ) : (
                      <Play size={18} color={colors[theme].inactive} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.verseActionButton,
                      themeStyles.verseActionButton,
                    ]}
                    onPress={() => shareVerse(verse)}
                  >
                    <Share2 size={18} color={colors[theme].inactive} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text
                style={[
                  styles.verseArabic,
                  {
                    color: colors[theme].text,
                    fontSize: fontSize,
                  },
                ]}
              >
                {verse.arabic}
              </Text>

              {showTransliteration && (
                <Text
                  style={[
                    styles.verseTransliteration,
                    { color: colors[theme].text },
                  ]}
                >
                  {verse.transliteration}
                </Text>
              )}

              {showTranslation && (
                <Text
                  style={[
                    styles.verseTranslation,
                    { color: colors[theme].inactive },
                  ]}
                >
                  {verse.translation}
                </Text>
              )}
            </Card>
          ))}
        </ScrollView>

        {/* Reciter Selection Modal */}
        <Modal
          visible={showReciterModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowReciterModal(false)}
        >
          <View
            style={[
              styles.reciterModal,
              { backgroundColor: "rgba(0, 0, 0, 0.5)" },
            ]}
          >
            <View
              style={[
                styles.reciterModalContent,
                { backgroundColor: colors[theme].card },
              ]}
            >
              <Text
                style={[
                  styles.reciterModalTitle,
                  { color: colors[theme].text },
                ]}
              >
                Select Reciter
              </Text>

              <ScrollView style={styles.reciterList}>
                {quranReciters.map((reciter) => (
                  <TouchableOpacity
                    key={reciter.id}
                    style={[
                      styles.reciterOption,
                      themeStyles.reciterOption,
                      selectedReciter.id === reciter.id && [
                        styles.reciterOptionSelected,
                        { backgroundColor: colors[theme].primary + "20" },
                      ],
                    ]}
                    onPress={() => selectReciter(reciter)}
                  >
                    <Text
                      style={[
                        styles.reciterName,
                        { color: colors[theme].text },
                        selectedReciter.id === reciter.id && {
                          color: colors[theme].primary,
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      {reciter.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={[
                  styles.closeButton,
                  { backgroundColor: colors[theme].primary },
                ]}
                onPress={() => setShowReciterModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Navigation Bar */}
        <View
          style={[
            styles.navigationBar,
            { backgroundColor: colors[theme].card },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.navigationButton,
              themeStyles.navigationButton,
              surahNumber === 1 && styles.navigationButtonDisabled,
            ]}
            onPress={navigateToPreviousSurah}
            disabled={surahNumber === 1}
          >
            <ChevronLeft
              size={20}
              color={
                surahNumber === 1 ? colors[theme].inactive : colors[theme].text
              }
            />
            <Text
              style={[
                styles.navigationText,
                {
                  color:
                    surahNumber === 1
                      ? colors[theme].inactive
                      : colors[theme].text,
                },
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          <View style={styles.navigationInfo}>
            <Text
              style={[styles.navigationSurah, { color: colors[theme].text }]}
            >
              {surahInfo.englishName}
            </Text>
            <Text
              style={[
                styles.navigationNumber,
                { color: colors[theme].inactive },
              ]}
            >
              {surahInfo.number}/114
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.navigationButton,
              themeStyles.navigationButton,
              surahNumber === 114 && styles.navigationButtonDisabled,
            ]}
            onPress={navigateToNextSurah}
            disabled={surahNumber === 114}
          >
            <Text
              style={[
                styles.navigationText,
                {
                  color:
                    surahNumber === 114
                      ? colors[theme].inactive
                      : colors[theme].text,
                },
              ]}
            >
              Next
            </Text>
            <ChevronRight
              size={20}
              color={
                surahNumber === 114
                  ? colors[theme].inactive
                  : colors[theme].text
              }
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 35,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  surahHeader: {
    alignItems: "center",
  },
  surahHeaderContent: {
    alignItems: "center",
  },
  surahName: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
  },
  surahNameArabic: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 8,
  },
  surahInfo: {
    fontSize: 14,
    marginTop: 8,
  },
  audioPlayer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  reciterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  playerText: {
    fontSize: 14,
    fontWeight: "500",
    marginHorizontal: 8,
  },
  reciterChangeButton: {
    padding: 4,
  },
  reciterChangeText: {
    fontSize: 12,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "500",
    minWidth: 40,
  },
  progressBarContainer: {
    flex: 1,
    height: 20,
    justifyContent: "center",
    marginHorizontal: 8,
    position: "relative",
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  seekTouchArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  playbackControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  controlText: {
    fontSize: 12,
    marginHorizontal: 4,
  },
  playPauseButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  settingButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  settingButtonActive: {
    backgroundColor: "#4a90e2",
  },
  settingButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  settingButtonTextActive: {
    color: "#FFFFFF",
  },
  fontSizeControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  fontSizeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  fontSizeValue: {
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  versesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bismillahCard: {
    alignItems: "center",
    marginBottom: 16,
    padding: 16,
  },
  bismillahText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  bismillahTranslation: {
    fontSize: 14,
    fontStyle: "italic",
  },
  verseCard: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  verseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  verseNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  verseNumber: {
    fontSize: 14,
    fontWeight: "bold",
  },
  verseActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  verseActionButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 20,
  },
  verseArabic: {
    textAlign: "right",
    lineHeight: 40,
    marginBottom: 12,
    fontWeight: "500",
  },
  verseTransliteration: {
    fontSize: 16,
    marginBottom: 8,
    fontStyle: "italic",
  },
  verseTranslation: {
    fontSize: 14,
    lineHeight: 22,
  },
  reciterModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  reciterModalContent: {
    width: "85%",
    borderRadius: 16,
    padding: 20,
    maxHeight: "70%",
  },
  reciterModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  reciterList: {
    maxHeight: "70%",
  },
  reciterOption: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  reciterOptionSelected: {
    backgroundColor: "rgba(74, 144, 226, 0.15)",
  },
  reciterName: {
    fontSize: 16,
  },
  closeButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 0,
    elevation: 10, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.1,
    paddingBottom: 40,
  },
  navigationButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
  },
  navigationButtonDisabled: {
    opacity: 0.5,
  },
  navigationText: {
    fontSize: 14,
    fontWeight: "500",
    marginHorizontal: 4,
  },
  navigationInfo: {
    alignItems: "center",
  },
  navigationSurah: {
    fontSize: 14,
    fontWeight: "bold",
  },
  navigationNumber: {
    fontSize: 12,
  },
});
