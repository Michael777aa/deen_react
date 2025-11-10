import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Stack, router } from "expo-router";
import { useSettingsStore } from "@/store/useSettingsStore";
import { colors } from "@/constants/colors";
import { Card } from "@/components/Card";
import { AlertTriangle, Check } from "lucide-react-native";

export default function ReportScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? "dark" : "light";
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const reasons = [
    "Incorrect halal status",
    "Outdated certification information",
    "Wrong product details",
    "Missing ingredients",
    "Other issue",
  ];

  const handleSubmit = () => {
    if (!selectedReason && !reason) {
      Alert.alert("Error", "Please select or enter a reason for your report");
      return;
    }

    if (!details) {
      Alert.alert("Error", "Please provide details about the issue");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        "Report Submitted",
        "Thank you for your feedback. We will review the information and update our database accordingly.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    }, 1500);
  };

  return (
    <>
      <Stack.Screen options={{ title: "Report Issue" }} />
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: colors[theme].background },
        ]}
        contentContainerStyle={styles.contentContainer}
      >
        <Card style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <AlertTriangle size={24} color={colors[theme].notification} />
            <Text style={[styles.infoTitle, { color: colors[theme].text }]}>
              Report Incorrect Information
            </Text>
          </View>
          <Text style={[styles.infoText, { color: colors[theme].text }]}>
            Help us improve our database by reporting any incorrect or outdated
            information about products. Your feedback is valuable to us.
          </Text>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
          Select Reason
        </Text>

        <View style={styles.reasonsContainer}>
          {reasons.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.reasonItem,
                {
                  backgroundColor:
                    selectedReason === item
                      ? colors[theme].primary + "20"
                      : colors[theme].card,
                  borderColor:
                    selectedReason === item
                      ? colors[theme].primary
                      : colors[theme].border,
                },
              ]}
              onPress={() => {
                setSelectedReason(item);
                if (item === "Other issue") {
                  setReason("");
                } else {
                  setReason(item);
                }
              }}
            >
              <Text
                style={[
                  styles.reasonText,
                  {
                    color:
                      selectedReason === item
                        ? colors[theme].primary
                        : colors[theme].text,
                  },
                ]}
              >
                {item}
              </Text>
              {selectedReason === item && (
                <Check size={16} color={colors[theme].primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {selectedReason === "Other issue" && (
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors[theme].text }]}>
              Specify Reason
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors[theme].card,
                  color: colors[theme].text,
                  borderColor: colors[theme].border,
                },
              ]}
              placeholder="Enter reason"
              placeholderTextColor={colors[theme].inactive}
              value={reason}
              onChangeText={setReason}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors[theme].text }]}>
            Details
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: colors[theme].card,
                color: colors[theme].text,
                borderColor: colors[theme].border,
              },
            ]}
            placeholder="Please provide details about the issue"
            placeholderTextColor={colors[theme].inactive}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={details}
            onChangeText={setDetails}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors[theme].text }]}>
            Your Email (optional)
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors[theme].card,
                color: colors[theme].text,
                borderColor: colors[theme].border,
              },
            ]}
            placeholder="Enter your email for follow-up"
            placeholderTextColor={colors[theme].inactive}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor: colors[theme].primary,
              opacity: isSubmitting ? 0.7 : 1,
            },
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Report</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: colors[theme].border }]}
          onPress={() => router.back()}
          disabled={isSubmitting}
        >
          <Text
            style={[styles.cancelButtonText, { color: colors[theme].text }]}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  infoCard: {
    marginBottom: 24,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  reasonsContainer: {
    marginBottom: 16,
  },
  reasonItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  reasonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 120,
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
