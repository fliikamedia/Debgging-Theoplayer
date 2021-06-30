import React from "react";
import { View, Text, StyleSheet } from "react-native";
const EpisodeDetailScreen = ({ route }) => {
  const { episode } = route.params;
  console.log(episode);
  return (
    <View
      style={{ flex: 1, justifyContent: "center", backgroundColor: "black" }}
    >
      <Text style={styles.titleText}>Genres</Text>
      <Text style={styles.detailText}>
        {episode.genre.toString().replace(/,/g, ", ")}
      </Text>
      <Text style={styles.titleText}>Directors</Text>
      <Text style={styles.detailText}>
        {episode.directors.toString().replace(/,/g, ", ")}
      </Text>
      <Text style={styles.titleText}>Starring</Text>
      <Text style={styles.detailText}>
        {episode.cast.toString().replace(/,/g, ", ")}
      </Text>
      <Text style={styles.titleText}>Content Advisory</Text>
      <Text style={styles.detailText}>
        {episode.content_advisory.toString().replace(/,/g, ", ")}
      </Text>
      <Text style={styles.titleText}>Languages</Text>
      <Text style={styles.detailText}>
        {episode.languages.toString().replace(/,/g, ", ")}
      </Text>
      <Text style={styles.titleText}>Subtitles</Text>
      <Text style={styles.detailText}>
        {episode.subtitles.toString().replace(/,/g, ", ")}
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

export default EpisodeDetailScreen;
