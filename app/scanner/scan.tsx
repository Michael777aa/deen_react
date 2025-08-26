import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { Stack, router } from "expo-router";
import { useSettingsStore } from "@/store/useSettingsStore";
import { colors } from "@/constants/colors";
import { useProductStore } from "@/store/useProductStore";
import {
  ArrowLeft,
  X,
  Check,
  AlertTriangle,
} from "lucide-react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { mockResults } from "@/mocks/productData";

export default function ScanScreen() {
  const { darkMode } = useSettingsStore();
  const theme = darkMode ? "dark" : "light";
  const { addScannedProduct } = useProductStore();

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<null | {
    status: "halal" | "haram" | "doubtful";
    product: {
      id: string;
      name: string;
      brand: string;
      imageUrl: string;
      halalStatus: string;
    };
  }>(null);

  useEffect(() => {
    if (!permission) {
      return;
    }

    if (!permission.granted) {
      requestPermission();
    }
  }, [permission]);

 

  const handleScan = () => {
    setIsScanning(true);

    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);

      // Mock scan result

      const randomResul: any =
        mockResults[Math.floor(Math.random() * mockResults.length)];
      setScanResult(randomResul);

      // Add to scanned products
      addScannedProduct(randomResul.product);
    }, 2000);
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const goBack = () => {
    router.back();
  };

  const viewProductDetails = () => {
    if (scanResult) {
      router.push(`/product/${scanResult.product.id}`);
    }
  };

  const resetScan = () => {
    setScanResult(null);
  };

  if (!permission) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors[theme].background },
        ]}
      >
        <ActivityIndicator size="large" color={colors[theme].primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors[theme].background },
        ]}
      >
        <Text style={[styles.permissionText, { color: colors[theme].text }]}>
          We need your permission to use the camera
        </Text>
        <TouchableOpacity
          style={[
            styles.permissionButton,
            { backgroundColor: colors[theme].primary },
          ]}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Scan Product",
          headerLeft: () => (
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors[theme].text} />
            </TouchableOpacity>
          ),
          headerShown: !scanResult,
        }}
      />
      <View
        style={[
          styles.container,
          { backgroundColor: colors[theme].background },
        ]}
      >
        {scanResult ? (
          <View style={styles.resultContainer}>
            <View
              style={[
                styles.resultHeader,
                {
                  backgroundColor:
                    scanResult.status === "halal"
                      ? colors[theme].success
                      : scanResult.status === "haram"
                      ? colors[theme].error
                      : colors[theme].notification,
                },
              ]}
            >
              {scanResult.status === "halal" && (
                <>
                  <Check size={24} color="#FFFFFF" />
                  <Text style={styles.resultHeaderText}>Halal</Text>
                </>
              )}
              {scanResult.status === "haram" && (
                <>
                  <X size={24} color="#FFFFFF" />
                  <Text style={styles.resultHeaderText}>Haram</Text>
                </>
              )}
              {scanResult.status === "doubtful" && (
                <>
                  <AlertTriangle size={24} color="#FFFFFF" />
                  <Text style={styles.resultHeaderText}>Doubtful</Text>
                </>
              )}
            </View>

            <View style={styles.resultContent}>
              <Text style={[styles.productName, { color: colors[theme].text }]}>
                {scanResult.product.name}
              </Text>
              <Text
                style={[styles.productBrand, { color: colors[theme].inactive }]}
              >
                {scanResult.product.brand}
              </Text>

              <View style={styles.resultActions}>
                <TouchableOpacity
                  style={[
                    styles.resultButton,
                    {
                      backgroundColor: "transparent",
                      borderColor: colors[theme].border,
                      borderWidth: 1,
                    },
                  ]}
                  onPress={resetScan}
                >
                  <Text
                    style={[
                      styles.resultButtonText,
                      { color: colors[theme].text },
                    ]}
                  >
                    Scan Again
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.resultButton,
                    { backgroundColor: colors[theme].primary },
                  ]}
                  onPress={viewProductDetails}
                >
                  <Text style={styles.resultButtonTextWhite}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.cameraWrapper}>
            <CameraView style={[StyleSheet.absoluteFill, { zIndex: -1 }]} facing={facing} />


              <View style={styles.overlay}>
                <View style={styles.scanFrame}>
                  <View
                    style={[
                      styles.cornerTL,
                      { borderColor: colors[theme].primary },
                    ]}
                  />
                  <View
                    style={[
                      styles.cornerTR,
                      { borderColor: colors[theme].primary },
                    ]}
                  />
                  <View
                    style={[
                      styles.cornerBL,
                      { borderColor: colors[theme].primary },
                    ]}
                  />
                  <View
                    style={[
                      styles.cornerBR,
                      { borderColor: colors[theme].primary },
                    ]}
                  />
                </View>

                <Text style={styles.scanInstructions}>
                  Position the barcode within the frame
                </Text>

                <View style={styles.cameraControls}>
                  <TouchableOpacity
                    style={[
                      styles.scanButton,
                      {
                        backgroundColor: isScanning
                          ? colors[theme].inactive
                          : colors[theme].primary,
                      },
                    ]}
                    onPress={handleScan}
                    disabled={isScanning}
                  >
                    {isScanning ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                     <Text>Camera</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.flipButton,
                      { backgroundColor: "rgba(0,0,0,0.5)" },
                    ]}
                    onPress={toggleCameraFacing}
                  >
                    <Text style={styles.flipButtonText}>Flip</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginLeft: 8,
  },
  cameraWrapper: {
    flex: 1,
    position: "relative",
  },

  camera: {
    flex: 1,
    position: "absolute",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: "relative",
    marginBottom: 40,
  },
  cornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scanInstructions: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },
  cameraControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  scanButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  flipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  flipButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  permissionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resultContainer: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  resultHeaderText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 12,
  },
  resultContent: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  productBrand: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
  },
  resultActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  resultButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  resultButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  resultButtonTextWhite: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
