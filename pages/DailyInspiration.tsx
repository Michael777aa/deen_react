import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { Card } from "@/components/Card";
import { Heart, MessageCircle, Plus } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useSettingsStore } from "@/store/useSettingsStore";
import {
  getInspiration,
  createInspiration,
} from "@/redux/features/inspiration/inspirationApi";
import { useAuth } from "@/context/auth";
export const DailyInspiration: React.FC = () => {
  const { user } = useAuth();
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? "dark" : "light";
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newQuote, setNewQuote] = useState("");
  const [newAttribution, setNewAttribution] = useState("");
  const [inspiration, setInspiration] = useState<{
    quote: string;
    attribution: string;
  } | null>(null);
  const shareInspiration = useCallback(async () => {
    try {
      if (!inspiration) return;
      const message = `"${inspiration.quote}"\n\n- ${inspiration.attribution}\n\nShared via Deen Daily App`;

      await Share.share({
        message,
        title: "Daily Islamic Inspiration",
      });
    } catch (err) {
      console.error("Error sharing inspiration:", err);
    }
  }, [inspiration]);

  const fetchInspiration = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getInspiration();
      setInspiration(data);
    } catch (error) {
      console.error("Failed to fetch inspiration:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreateInspiration = async () => {
    try {
      if (!newQuote.trim()) return;
      const created = await createInspiration(newQuote, newAttribution);
      setInspiration(created); // show newly created inspiration
      setNewQuote("");
      setNewAttribution("");
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create inspiration:", err);
    }
  };

  useEffect(() => {
    fetchInspiration();
  }, [fetchInspiration]);

  if (isLoading) {
    return (
      <View
        style={[
          styles.quoteContainer,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors[theme].primary} />
      </View>
    );
  }

  if (!inspiration) {
    return (
      <View style={[styles.quoteContainer, { alignItems: "center" }]}>
        <Text style={{ color: colors[theme].text, marginBottom: 12 }}>
          No inspiration available.
        </Text>
  
        {user?.userType === "MODERATOR" && (
          <TouchableOpacity
          onPress={() => setShowCreateModal(true)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: colors[theme].primary,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
              Create New Inspiration
            </Text>
          </TouchableOpacity>
        )}
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
          {user?.userType === "MODERATOR" && (
            <TouchableOpacity onPress={() => setShowCreateModal(true)}>
              <Plus size={20} color={colors[theme].primary} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          )}
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
            <Text
              style={[styles.quoteActionText, { color: colors[theme].primary }]}
            >
              Save
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quoteAction} onPress={shareInspiration}>
            <MessageCircle size={16} color={colors[theme].inactive} />
            <Text
              style={[
                styles.quoteActionText,
                { color: colors[theme].inactive },
              ]}
            >
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Modal for creating new inspiration */}
    {/* Modal for creating new inspiration */}
<Modal visible={showCreateModal} transparent animationType="fade">
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      {/* Header with title and close button */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Create New Inspiration</Text>
        <TouchableOpacity onPress={() => setShowCreateModal(false)}>
          <Text style={styles.modalClose}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <TextInput
        placeholder="Enter quote"
        value={newQuote}
        onChangeText={setNewQuote}
        style={styles.input}
        multiline
      />
      <TextInput
        placeholder="Enter attribution"
        value={newAttribution}
        onChangeText={setNewAttribution}
        style={styles.input}
      />

      {/* Buttons */}
      <TouchableOpacity
        style={[styles.modalButton, { backgroundColor: colors[theme].primary }]}
        onPress={handleCreateInspiration}
      >
        <Text style={styles.modalButtonText}>Create</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.modalButton, { backgroundColor: "#ddd" }]}
        onPress={() => setShowCreateModal(false)}
      >
        <Text style={[styles.modalButtonText, { color: "#333" }]}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
 

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  modalClose: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  modalButton: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  
});
