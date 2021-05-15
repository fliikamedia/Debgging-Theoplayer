import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { dummyData, COLORS, SIZES, FONTS, icons, images } from ".././constants";

const MovieDetailScreen = ({ navigation, route }) => {
  //const movieId = navigation.getParam("selectedMovie");
  const { selectedMovie } = route.params;
  console.log(selectedMovie);
  return (
    <View style={styles.container}>
      <Text>Movie Detail</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
});

export default MovieDetailScreen;
