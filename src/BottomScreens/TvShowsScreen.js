import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TvShowsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={{ color: "white" }}>Tv Shows</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default TvShowsScreen;
