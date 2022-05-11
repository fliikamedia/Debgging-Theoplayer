import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { EPISODEDETAIL, BITMOVINPLAYER } from "../../constants/RouteNames";
import IconAwesome from "react-native-vector-icons/FontAwesome5";
import IonIcon from "react-native-vector-icons/Ionicons";
import FastImage from "react-native-fast-image";
import ProgressBar from "./ProgressBar";
import { useSelector } from "react-redux";
import Feather from "react-native-vector-icons/Feather";

const EpisodeItem = ({ episode, navigation, index }) => {
  const user = useSelector((state) => state.user);
  const calculateProgress = (id) => {
    try {
      var duration = user.currentProfile.watched.find(
        (c) => c.movieId == id
      ).duration;
      var watchedAt = user.currentProfile.watched.find(
        (c) => c.movieId == id
      ).watchedAt;
    } catch (err) {}
    return (watchedAt / duration) * 100;
  };

  return (
    <View
      style={{
        marginTop: 20,
        width: "97%",
        alignSelf: "center",
        backgroundColor: "#151515",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
      }}
    >
      <View>
        <TouchableOpacity
          style={{
            width: "100%",
            aspectRatio: 16 / 9,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
          onPress={() =>
            navigation.navigate(EPISODEDETAIL, { episode: episode })
          }
        >
          <FastImage
            style={styles.poster}
            source={{ uri: episode.wide_thumbnail_link }}
          />
          <TouchableOpacity
            style={{
              padding: 14,
              borderRadius: 40,
              justifyContent: "center",
              alignItems: "center",
              elevation: 25,
              borderWidth: 2,
              borderColor: "#fff",
            }}
            onPress={() =>
              navigation.navigate(BITMOVINPLAYER, {
                movieId: episode._id,
              })
            }
          >
            <IconAwesome
              name="play"
              size={40}
              color="#fff"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        {calculateProgress(episode._id) ? (
          <ProgressBar
            containerStyle={{ marginTop: 0 }}
            barStyle={{ height: 3 }}
            percentage={calculateProgress(episode._id)}
          />
        ) : null}
        <View
          style={{
            width: "95%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
            alignSelf: "center",
          }}
        >
          <Text style={styles.title}>
            {index + 1}- {episode.episode_title}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(EPISODEDETAIL, { episode: episode })
            }
            style={{
              margin: -2,
              width: 25,
              height: 25,
              padding: 0,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "white",
            }}
          >
            <IonIcon name="information" size={18} color="white" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            height: 50,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "space-around",
            marginBottom: 5,
          }}
        >
          <View>
            <Text style={styles.duration}>{episode.runtime}</Text>
          </View>
          <View
            style={{
              width: 2,
              height: "80%",
              backgroundColor: "rgb(100,100,100)",
              alignSelf: "center",
              borderRadius: 50,
            }}
          ></View>
          <View style={{ width: "60%" }}>
            <Text numberOfLines={2} style={styles.synopsis}>
              {episode.episode_synopsis}
            </Text>
          </View>
          <View
            style={{
              width: 2,
              height: "80%",
              backgroundColor: "rgb(100,100,100)",
              alignSelf: "center",
              borderRadius: 50,
            }}
          ></View>
          <View
            style={{
              // flexDirection: "row",
              // justifyContent: "space-around",
              // alignItems: "center",
              // width: "25%",
              height: "100%",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Feather
              style={{ marginTop: 10 }}
              name="download-cloud"
              size={25}
              color="#fff"
            />
          </View>
        </View>
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
  title: {
    color: "white",
    fontSize: 18,
    fontFamily: "Sora-Bold",
  },
  duration: {
    color: "darkgrey",
    fontSize: 14,
    marginTop: 10,
  },
  synopsis: {
    color: "#fff",
    fontFamily: "Sora-Regular",
    fontSize: 10.5,
  },
});
export default EpisodeItem;
