import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Stack, router } from "expo-router";
import { useSettingsStore } from "@/store/useSettingsStore";
import { colors } from "@/constants/colors";
import { Card } from "@/components/Card";
import { Scan, Check, AlertTriangle, X, Info } from "lucide-react-native";

export default function ScannerInfoScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? "dark" : "light";

  return (
    <>
      <Stack.Screen options={{ title: "Scanner Information" }} />
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: colors[theme].background },
        ]}
        contentContainerStyle={styles.contentContainer}
      >
        <Card style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Info size={24} color={colors[theme].primary} />
            <Text style={[styles.infoTitle, { color: colors[theme].text }]}>
              About the Halal Scanner
            </Text>
          </View>
          <Text style={[styles.infoText, { color: colors[theme].text }]}>
            The Halal Scanner helps you identify whether products are halal
            certified, making it easier to make informed choices about what you
            consume.
          </Text>
          <Text style={[styles.infoText, { color: colors[theme].text }]}>
            Simply scan a product barcode, and we'll check our database to
            provide you with information about its halal status.
          </Text>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
          How to Use
        </Text>

        <Card style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors[theme].text }]}>
              Scan a Barcode
            </Text>
            <Text
              style={[
                styles.stepDescription,
                { color: colors[theme].inactive },
              ]}
            >
              Point your camera at a product barcode and align it within the
              frame.
            </Text>
          </View>
        </Card>

        <Card style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors[theme].text }]}>
              View Results
            </Text>
            <Text
              style={[
                styles.stepDescription,
                { color: colors[theme].inactive },
              ]}
            >
              The app will display the halal status and certification details of
              the product.
            </Text>
          </View>
        </Card>

        <Card style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors[theme].text }]}>
              Check History
            </Text>
            <Text
              style={[
                styles.stepDescription,
                { color: colors[theme].inactive },
              ]}
            >
              Access your scan history to review products you've previously
              scanned.
            </Text>
          </View>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors[theme].text }]}>
          Understanding Results
        </Text>

        <View style={styles.statusCards}>
          <Card
            style={[
              styles.statusCard,
              { borderColor: colors[theme].success, borderWidth: 1 },
            ]}
          >
            <View
              style={[
                styles.statusIcon,
                { backgroundColor: colors[theme].success },
              ]}
            >
              <Check size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.statusTitle, { color: colors[theme].text }]}>
              Halal
            </Text>
            <Text
              style={[
                styles.statusDescription,
                { color: colors[theme].inactive },
              ]}
            >
              Product is certified halal and permissible for consumption.
            </Text>
          </Card>

          <Card
            style={[
              styles.statusCard,
              { borderColor: colors[theme].notification, borderWidth: 1 },
            ]}
          >
            <View
              style={[
                styles.statusIcon,
                { backgroundColor: colors[theme].notification },
              ]}
            >
              <AlertTriangle size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.statusTitle, { color: colors[theme].text }]}>
              Doubtful
            </Text>
            <Text
              style={[
                styles.statusDescription,
                { color: colors[theme].inactive },
              ]}
            >
              Product contains questionable ingredients or unclear
              certification.
            </Text>
          </Card>

          <Card
            style={[
              styles.statusCard,
              { borderColor: colors[theme].error, borderWidth: 1 },
            ]}
          >
            <View
              style={[
                styles.statusIcon,
                { backgroundColor: colors[theme].error },
              ]}
            >
              <X size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.statusTitle, { color: colors[theme].text }]}>
              Not Halal
            </Text>
            <Text
              style={[
                styles.statusDescription,
                { color: colors[theme].inactive },
              ]}
            >
              Product contains non-halal ingredients or is not permissible.
            </Text>
          </Card>
        </View>

        <Card style={styles.databaseCard}>
          <Text style={[styles.databaseTitle, { color: colors[theme].text }]}>
            Our Database
          </Text>
          <Text style={[styles.databaseText, { color: colors[theme].text }]}>
            Our product database is continuously updated with information from
            various halal certification bodies worldwide. We strive to provide
            accurate information, but always recommend verifying critical
            products with official sources.
          </Text>
          <Text style={[styles.databaseText, { color: colors[theme].text }]}>
            If you find any incorrect information, please report it using the
            "Report" button on the product details page.
          </Text>
        </Card>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors[theme].primary }]}
          onPress={() => router.back()}
        >
          <Scan size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Start Scanning</Text>
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
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  stepCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  statusCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  statusCard: {
    width: "31%",
    alignItems: "center",
    padding: 12,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  statusDescription: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  databaseCard: {
    marginBottom: 24,
  },
  databaseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  databaseText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
