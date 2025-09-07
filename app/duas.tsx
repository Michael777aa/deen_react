import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Animated,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
  Share,
  Modal,
} from "react-native";
import { Stack } from "expo-router";
import { useSettingsStore } from "@/store/useSettingsStore";
import { colors } from "@/constants/colors";
import { Card } from "@/components/Card";
import {
  Search,
  Heart,
  Share2,
  Volume2,
  Download,
  X,
  MessageCircle,
  Smile,
  Frown,
  Meh,
  Plus,
} from "lucide-react-native";
import * as Speech from "expo-speech";
import * as FileSystem from "expo-file-system";
import {
  getAllDuas,
  createDua,
} from "@/redux/features/duas/duasApi";
import { useAuth } from "@/context/auth";

const { width } = Dimensions.get("window");

interface Dua {
  id: string;
  category: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}

export default function DuasScreen() {
  const { darkMode } = useSettingsStore();
  const { user } = useAuth();
  const theme = darkMode ? "dark" : "light";

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showEmotionModal, setShowEmotionModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [emotionDuas, setEmotionDuas] = useState<Dua[]>([]);
  const [duas, setDuas] = useState<Dua[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // New Dua Form State
  const [newDua, setNewDua] = useState({
    category: "",
    title: "",
    arabic: "",
    transliteration: "",
    translation: "",
    reference: "",
  });

  // Animation refs
  const modalAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Fetch all duas
  const fetchDuas = useCallback(async () => {
    try {
      setLoading(true);
      const allDuas = await getAllDuas();
      setDuas(allDuas);
    } catch (error) {
      console.error("Error fetching duas:", error);
      Alert.alert("Error", "Failed to load duas");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchDuas();
  }, [fetchDuas]);

  // Fade in animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Filter duas based on search
  const filteredDuas = useCallback(() => {
    return duas.filter(
      (dua) =>
        dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dua.arabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dua.translation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [duas, searchQuery]);

  // Handle search with debounce would be even better
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Toggle favorite
  const toggleFavorite = (duaId: string) => {
    if (favorites.includes(duaId)) {
      setFavorites(favorites.filter((id) => id !== duaId));
    } else {
      setFavorites([...favorites, duaId]);
    }
  };

  // Emotion modal handlers
  const openEmotionModal = () => {
    setShowEmotionModal(true);
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeEmotionModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowEmotionModal(false);
      setSelectedEmotion(null);
    });
  };

  // Dua actions
  const handleListen = (dua: Dua) => {
    Speech.speak(dua.arabic, {
      language: "ar",
      pitch: 1,
      rate: 0.8, // Slightly slower for better comprehension
    });
  };

  const handleSave = async (dua: Dua) => {
    try {
      const fileUri =
        FileSystem.documentDirectory + `${dua.title.replace(/\s+/g, "_")}.txt`;

      const content = `
Title: ${dua.title}
Arabic: ${dua.arabic}
Transliteration: ${dua.transliteration}
Translation: ${dua.translation}
Reference: ${dua.reference}
      `;

      await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      Alert.alert("Saved ✅", `Dua saved to your files`);
    } catch (error) {
      console.error("Save error", error);
      Alert.alert("Error", "Could not save dua");
    }
  };

  const handleShare = async (dua: Dua) => {
    try {
      const message = `
📖 ${dua.title}

🕌 Arabic:
${dua.arabic}

🔊 Transliteration:
${dua.transliteration}

🌍 Translation:
${dua.translation}

📚 Reference: ${dua.reference}
      `;

      await Share.share({
        message,
        title: dua.title,
      });
    } catch (error) {
      console.error("Share error", error);
      Alert.alert("Error", "Could not share dua");
    }
  };

  // Emotion-based recommendations
  const selectEmotion = (emotion: string) => {
    setSelectedEmotion(emotion);

    // Simple recommendation logic
    const recommendedDuas = duas
      .filter((dua) => {
        if (emotion === "happy")
          return dua.category === "gratitude" || dua.category === "morning";
        if (emotion === "sad")
          return dua.category === "hardship" || dua.category === "forgiveness";
        if (emotion === "neutral")
          return dua.category === "protection" || dua.category === "general";
        return false;
      })
      .slice(0, 3);

    setEmotionDuas(recommendedDuas);
  };

  // Create new dua
  const handleCreateDua = async () => {
    try {
      if (
        !newDua.title ||
        !newDua.arabic ||
        !newDua.translation ||
        !newDua.category
      ) {
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }

      await createDua(newDua);
      Alert.alert("Success", "Dua created successfully");
      setShowCreateModal(false);
      setNewDua({
        category: "",
        title: "",
        arabic: "",
        transliteration: "",
        translation: "",
        reference: "",
      });
      // Refresh the list
      fetchDuas();
    } catch (error) {
      console.error("Create dua error:", error);
      Alert.alert("Error", "Failed to create dua");
    }
  };

  // Render dua item
  const renderDuaItem = ({ item }: { item: Dua }) => (
    <Card style={styles.duaCard}>
      <View style={styles.duaHeader}>
        <Text style={[styles.duaTitle, { color: colors[theme].text }]}>
          {item.title}
        </Text>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
          <Heart
            size={20}
            color={colors[theme].primary}
            fill={favorites.includes(item.id) ? colors[theme].primary : "none"}
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.duaArabic, { color: colors[theme].text }]}>
        {item.arabic}
      </Text>

      <Text style={[styles.duaTransliteration, { color: colors[theme].text }]}>
        {item.transliteration}
      </Text>

      <Text style={[styles.duaTranslation, { color: colors[theme].inactive }]}>
        {item.translation}
      </Text>

      {item.reference && (
        <Text style={[styles.duaReference, { color: colors[theme].primary }]}>
          {item.reference}
        </Text>
      )}

      <View style={styles.duaActions}>
        <TouchableOpacity
          style={[
            styles.duaActionButton,
            { backgroundColor: colors[theme].card },
          ]}
          onPress={() => handleListen(item)}
        >
          <Volume2 size={16} color={colors[theme].text} />
          <Text style={[styles.duaActionText, { color: colors[theme].text }]}>
            Listen
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.duaActionButton,
            { backgroundColor: colors[theme].card },
          ]}
          onPress={() => handleSave(item)}
        >
          <Download size={16} color={colors[theme].text} />
          <Text style={[styles.duaActionText, { color: colors[theme].text }]}>
            Save
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.duaActionButton,
            { backgroundColor: colors[theme].card },
          ]}
          onPress={() => handleShare(item)}
        >
          <Share2 size={16} color={colors[theme].text} />
          <Text style={[styles.duaActionText, { color: colors[theme].text }]}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  // Animation interpolation
  const modalTranslateY = modalAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  // Loading state
  if (loading) {
    return (
      <View
        style={[
          styles.centerContainer,
          { backgroundColor: colors[theme].background },
        ]}
      >
        <ActivityIndicator size="large" color={colors[theme].primary} />
        <Text style={[styles.loadingText, { color: colors[theme].text }]}>
          Loading duas...
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Dua Collection" }} />
      <View
        style={[
          styles.container,
          { backgroundColor: colors[theme].background },
        ]}
      >
        {/* Header Banner */}
        <Animated.View
          style={[
            styles.headerBanner,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
            }}
            style={styles.headerImage}
          />
          <View style={styles.headerOverlay}>
            <Text style={styles.headerTitle}>Dua Collection</Text>
            <Text style={styles.headerSubtitle}>
              Authentic prayers for every occasion
            </Text>
          </View>
        </Animated.View>

        {/* Emotion-based Dua Recommendation */}
        <TouchableOpacity
          style={[
            styles.emotionCard,
            { backgroundColor: colors[theme].primary },
          ]}
          onPress={openEmotionModal}
        >
          <View style={styles.emotionCardContent}>
            <MessageCircle size={24} color="#FFFFFF" />
            <View style={styles.emotionCardText}>
              <Text style={styles.emotionCardTitle}>
                How are you feeling today?
              </Text>
              <Text style={styles.emotionCardSubtitle}>
                Get personalized dua recommendations
              </Text>
            </View>
          </View>
          <View style={styles.emotionCardArrow}>
            <Text style={styles.emotionCardArrowText}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Search and Create Button Row */}
        <View style={styles.searchRow}>
          <View
            style={[
              styles.searchInputContainer,
              {
                backgroundColor: colors[theme].card,
                borderColor: colors[theme].border,
              },
            ]}
          >
            <Search size={20} color={colors[theme].inactive} />
            <TextInput
              style={[styles.searchInput, { color: colors[theme].text }]}
              placeholder="Search duas..."
              placeholderTextColor={colors[theme].inactive}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>

          {user?.userType === "MODERATOR" && (
            <TouchableOpacity
              style={[
                styles.createButton,
                { backgroundColor: colors[theme].primary },
              ]}
              onPress={() => setShowCreateModal(true)}
            >
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Duas List */}
        <FlatList
          data={filteredDuas()}
          renderItem={renderDuaItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.duasList}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={fetchDuas}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors[theme].inactive }]}>
              No duas found. Try a different search.
            </Text>
          }
        />

        {/* Emotion Modal */}
        {showEmotionModal && (
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  backgroundColor: colors[theme].background,
                  transform: [{ translateY: modalTranslateY }],
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text
                  style={[styles.modalTitle, { color: colors[theme].text }]}
                >
                  How are you feeling today?
                </Text>
                <TouchableOpacity
                  onPress={closeEmotionModal}
                  style={styles.closeButton}
                >
                  <X size={24} color={colors[theme].text} />
                </TouchableOpacity>
              </View>

              <Text
                style={[
                  styles.modalSubtitle,
                  { color: colors[theme].inactive },
                ]}
              >
                Select your mood to get personalized duas
              </Text>

              <View style={styles.emotionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.emotionButton,
                    selectedEmotion === "happy" && { borderColor: "#4CAF50" },
                  ]}
                  onPress={() => selectEmotion("happy")}
                >
                  <Smile
                    size={40}
                    color="#4CAF50"
                    fill={
                      selectedEmotion === "happy" ? "#4CAF50" : "transparent"
                    }
                  />
                  <Text
                    style={[styles.emotionText, { color: colors[theme].text }]}
                  >
                    Happy
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.emotionButton,
                    selectedEmotion === "neutral" && { borderColor: "#FF9800" },
                  ]}
                  onPress={() => selectEmotion("neutral")}
                >
                  <Meh
                    size={40}
                    color="#FF9800"
                    fill={
                      selectedEmotion === "neutral" ? "#FF9800" : "transparent"
                    }
                  />
                  <Text
                    style={[styles.emotionText, { color: colors[theme].text }]}
                  >
                    Neutral
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.emotionButton,
                    selectedEmotion === "sad" && { borderColor: "#F44336" },
                  ]}
                  onPress={() => selectEmotion("sad")}
                >
                  <Frown
                    size={40}
                    color="#F44336"
                    fill={selectedEmotion === "sad" ? "#F44336" : "transparent"}
                  />
                  <Text
                    style={[styles.emotionText, { color: colors[theme].text }]}
                  >
                    Sad
                  </Text>
                </TouchableOpacity>
              </View>

              {selectedEmotion && emotionDuas.length > 0 && (
                <View style={styles.recommendedContainer}>
                  <Text
                    style={[
                      styles.recommendedTitle,
                      { color: colors[theme].text },
                    ]}
                  >
                    Recommended Duas for You
                  </Text>

                  {emotionDuas.map((dua, index) => (
                    <Card key={dua.id} style={styles.recommendedDua}>
                      <Text
                        style={[
                          styles.recommendedDuaTitle,
                          { color: colors[theme].text },
                        ]}
                      >
                        {dua.title}
                      </Text>
                      <Text
                        style={[
                          styles.recommendedDuaTranslation,
                          { color: colors[theme].inactive },
                        ]}
                      >
                        {dua.translation.substring(0, 100)}...
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.readMoreButton,
                          { backgroundColor: colors[theme].primary },
                        ]}
                        onPress={closeEmotionModal}
                      >
                        <Text style={styles.readMoreButtonText}>
                          Read Full Dua
                        </Text>
                      </TouchableOpacity>
                    </Card>
                  ))}
                </View>
              )}
            </Animated.View>
          </View>
        )}

        {/* Create Dua Modal */}
        <Modal visible={showCreateModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.createModalContent,
                { backgroundColor: colors[theme].background },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text
                  style={[styles.modalTitle, { color: colors[theme].text }]}
                >
                  Create New Dua
                </Text>
                <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                  <X size={24} color={colors[theme].text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.createForm}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: colors[theme].text,
                      backgroundColor: colors[theme].card,
                      borderColor: colors[theme].border,
                    },
                  ]}
                  placeholder="Category"
                  placeholderTextColor={colors[theme].inactive}
                  value={newDua.category}
                  onChangeText={(text) =>
                    setNewDua({ ...newDua, category: text })
                  }
                />

                <TextInput
                  style={[
                    styles.input,
                    {
                      color: colors[theme].text,
                      backgroundColor: colors[theme].card,
                      borderColor: colors[theme].border,
                    },
                  ]}
                  placeholder="Title"
                  placeholderTextColor={colors[theme].inactive}
                  value={newDua.title}
                  onChangeText={(text) => setNewDua({ ...newDua, title: text })}
                />

                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    {
                      color: colors[theme].text,
                      backgroundColor: colors[theme].card,
                      borderColor: colors[theme].border,
                    },
                  ]}
                  placeholder="Arabic Text"
                  placeholderTextColor={colors[theme].inactive}
                  value={newDua.arabic}
                  onChangeText={(text) =>
                    setNewDua({ ...newDua, arabic: text })
                  }
                  multiline
                />

                <TextInput
                  style={[
                    styles.input,
                    {
                      color: colors[theme].text,
                      backgroundColor: colors[theme].card,
                      borderColor: colors[theme].border,
                    },
                  ]}
                  placeholder="Transliteration"
                  placeholderTextColor={colors[theme].inactive}
                  value={newDua.transliteration}
                  onChangeText={(text) =>
                    setNewDua({ ...newDua, transliteration: text })
                  }
                />

                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    {
                      color: colors[theme].text,
                      backgroundColor: colors[theme].card,
                      borderColor: colors[theme].border,
                    },
                  ]}
                  placeholder="Translation"
                  placeholderTextColor={colors[theme].inactive}
                  value={newDua.translation}
                  onChangeText={(text) =>
                    setNewDua({ ...newDua, translation: text })
                  }
                  multiline
                />

                <TextInput
                  style={[
                    styles.input,
                    {
                      color: colors[theme].text,
                      backgroundColor: colors[theme].card,
                      borderColor: colors[theme].border,
                    },
                  ]}
                  placeholder="Reference (optional)"
                  placeholderTextColor={colors[theme].inactive}
                  value={newDua.reference}
                  onChangeText={(text) =>
                    setNewDua({ ...newDua, reference: text })
                  }
                />
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors[theme].primary },
                  ]}
                  onPress={handleCreateDua}
                >
                  <Text style={styles.modalButtonText}>Create</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors[theme].inactive },
                  ]}
                  onPress={() => setShowCreateModal(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  headerBanner: {
    height: 150,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    color: "#FFFFFF",
    fontSize: 16,
    opacity: 0.9,
    textAlign: "center",
  },
  emotionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginHorizontal: 16,
    marginTop: -20,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  emotionCardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  emotionCardText: {
    marginLeft: 12,
  },
  emotionCardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  emotionCardSubtitle: {
    color: "#FFFFFF",
    fontSize: 12,
    opacity: 0.9,
  },
  emotionCardArrow: {
    backgroundColor: "rgba(255,255,255,0.2)",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  emotionCardArrowText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 48,
    flex: 1,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  duasList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  duaCard: {
    marginBottom: 16,
  },
  duaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  duaTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 12,
  },
  duaArabic: {
    fontSize: 20,
    textAlign: "right",
    marginBottom: 12,
    lineHeight: 36,
  },
  duaTransliteration: {
    fontSize: 16,
    marginBottom: 8,
    fontStyle: "italic",
  },
  duaTranslation: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 22,
  },
  duaReference: {
    fontSize: 12,
    marginBottom: 16,
    textAlign: "right",
  },
  duaActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  duaActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  duaActionText: {
    fontSize: 14,
    marginLeft: 6,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    zIndex: 100,
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "80%",
  },
  createModalContent: {
    margin: 20,
    borderRadius: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  emotionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  emotionButton: {
    alignItems: "center",
    padding: 16,
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 16,
    width: width / 3.5,
  },
  emotionText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  recommendedContainer: {
    marginTop: 8,
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  recommendedDua: {
    marginBottom: 12,
  },
  recommendedDuaTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  recommendedDuaTranslation: {
    fontSize: 14,
    marginBottom: 12,
  },
  readMoreButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  readMoreButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  createForm: {
    paddingHorizontal: 20,
    maxHeight: 400,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 12,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});