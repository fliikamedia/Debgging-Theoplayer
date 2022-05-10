import React from "react";
import { Dimensions, View, StyleSheet, TouchableOpacity } from "react-native";
import { MOVIEDETAIL } from "../../constants/RouteNames";
import FastImage from "react-native-fast-image";

const { width, height } = Dimensions.get("window");
const MoviesItem = ({ movie, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(MOVIEDETAIL, {
          selectedMovie: movie._id,
          isSeries: movie.film_type,
          seriesTitle: movie.title,
        });
      }}
      style={styles.posterContainer}
    >
      <FastImage
        style={styles.poster}
        source={{ uri: movie.dvd_thumbnail_link }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  posterContainer: {
    height: width * 0.5,
    width: width * 0.3,
    margin: 5,
  },
  poster: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 5,
  },
});
export default MoviesItem;
