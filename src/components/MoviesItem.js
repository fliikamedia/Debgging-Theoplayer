import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Feather, AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { MOVIEDETAIL } from "../../constants/RouteNames";

const MoviesItem = ({ movie, navigation }) => {
  return (
    <View>
      <View style={styles.row}>
        <TouchableOpacity
          style={{
            height: 100,
            aspectRatio: 16 / 9,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() =>
            navigation.navigate(MOVIEDETAIL, {
              selectedMovie: movie._id,
              isSeries: movie.film_type,
              seriesTitle: movie.title,
            })
          }
        >
          <Image
            style={styles.poster}
            source={{ uri: movie.wide_thumbnail_link }}
          />
          <AntDesign name="playcircleo" size={50} color="white" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.duration}>{movie.runtime}</Text>
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
    left: 5,
    resizeMode: "cover",
    borderRadius: 3,
  },
  titleContainer: {
    flex: 1,
    padding: 5,
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  duration: {
    color: "darkgrey",
    fontSize: 12,
  },
});
export default MoviesItem;
