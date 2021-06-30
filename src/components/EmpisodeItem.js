import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Feather, AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { EPISODEDETAIL } from "../../constants/RouteNames";

const EpisodeItem = ({ episode, playSeries, navigation }) => {
  return (
    <View>
      <View style={styles.row}>
        <TouchableOpacity
          style={{
            height: 80,
            aspectRatio: 16 / 9,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() =>
            navigation.navigate(EPISODEDETAIL, { episode: episode })
          }
        >
          <Image
            style={styles.poster}
            source={{ uri: episode.wide_thumbnail_link }}
          />
          <AntDesign name="playcircleo" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{episode.episode_title}</Text>
          <Text style={styles.duration}>{episode.runtime}</Text>
        </View>
        <AntDesign name="download" size={24} color="white" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  poster: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    resizeMode: "cover",
    borderRadius: 3,
  },
  titleContainer: {
    flex: 1,
    padding: 5,
    justifyContent: "center",
  },
  plot: {
    color: "darkgrey",
  },
  title: {
    color: "white",
  },
  duration: {
    color: "darkgrey",
    fontSize: 10,
  },
});
export default EpisodeItem;
