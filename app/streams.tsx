import { View, StyleSheet } from "react-native";

import { StreamTabs } from "@/components/StreamTabs";

export default function StreamsScreen() {
  return (
    <>
      <View style={{ flex: 1 }}>
        <StreamTabs />
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
