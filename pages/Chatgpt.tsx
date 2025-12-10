import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MessageCircle } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useSettingsStore } from "@/store/useSettingsStore";
import { router } from "expo-router";

// ✅ CLEAN — MINIMAL — ONLY A NICE BUTTON THAT GOES TO CHAT PAGE
export const ChatgptHomepage: React.FC = () => {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? "dark" : "light";

  return (
    <View style={styles.container}>
      {/* Smooth rounded section */}
      <View style={[styles.box, { backgroundColor: colors[theme].card }]}>        
        <Text style={[styles.label, { color: colors[theme].text }]}>Ask Anything</Text>
        <Text style={[styles.sub, { color: colors[theme].inactive }]}>Chat instantly with your AI assistant</Text>

        {/* 🚀 CHAT BUTTON (ONLY FUNCTION) */}
        <TouchableOpacity
          style={[styles.chatButton, { backgroundColor: colors[theme].primary }]}
          onPress={() => router.push("/chat")}
        >
          <MessageCircle size={20} color="#fff" />
          <Text style={styles.chatText}>Start Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  box: {
    padding: 20,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  sub: {
    fontSize: 14,
    marginBottom: 16,
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  chatText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
  },
});