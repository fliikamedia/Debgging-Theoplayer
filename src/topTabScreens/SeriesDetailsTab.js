import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
const SeriesDetailsTab = ({ route }) => {
  const movies = useSelector((state) => state.movies);

  //console.log(movies.movie);
  let moviesLength;
  try {
    moviesLength = movies.movie.length;
  } catch (err) {}
  if (!movies.movie.genre) {
    return (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <ActivityIndicator
          animating
          color={"teal"}
          size="large"
          style={{ flex: 1, position: "absolute", top: "10%", left: "45%" }}
        />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <Text style={styles.titleText}>Genres</Text>
      <Text style={styles.detailText}>
        {movies.movie.genre.toString().replace(/,/g, ", ")}
      </Text>
      <Text style={styles.titleText}>Directors</Text>
      <Text style={styles.detailText}>
        {movies.movie.directors.toString().replace(/,/g, ", ")}
      </Text>
      <Text style={styles.titleText}>Starring</Text>
      <Text style={styles.detailText}>
        {movies.movie.cast.toString().replace(/,/g, ", ")}
      </Text>
      <Text style={styles.titleText}>Content Advisory</Text>
      <Text style={styles.detailText}>
        {movies.movie.content_advisory.toString().replace(/,/g, ", ")}
      </Text>
      <Text style={styles.titleText}>Languages</Text>
      <Text style={styles.detailText}>
        {movies.movie.languages.toString().replace(/,/g, ", ")}
      </Text>
      <Text style={styles.titleText}>Subtitles</Text>
      <Text style={styles.detailText}>
        {movies.movie.subtitles.toString().replace(/,/g, ", ")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "teal",
    marginLeft: 5,
  },
  detailText: {
    fontSize: 16,
    color: "white",
    marginBottom: 20,
    marginLeft: 10,
  },
});

export default SeriesDetailsTab;
