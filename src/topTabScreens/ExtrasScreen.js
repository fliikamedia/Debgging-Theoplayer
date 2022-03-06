import React from "react";
import { View, Text, StyleSheet } from "react-native";
const ExtrasScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={{ color: "#fff" }}>Extras</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 600,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default ExtrasScreen;
