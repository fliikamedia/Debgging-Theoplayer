import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { EPISODEDETAIL } from "../../constants/RouteNames";
import IconAwesome from 'react-native-vector-icons/FontAwesome5';
import IconAnt from 'react-native-vector-icons/AntDesign'
import FastImage from 'react-native-fast-image'
import ProgressBar from "./ProgressBar";
import { useSelector } from "react-redux";

const EpisodeItem = ({ episode, navigation }) => {
const user = useSelector(state => state.user);
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
    <View style={{ marginTop: 20, width: '97%', alignSelf: 'center', backgroundColor: '#151515', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
      <View>
        <TouchableOpacity
          style={{
            width: '100%',
            aspectRatio: 16 / 9,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: 'center'
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
        navigation.navigate(EPISODEDETAIL, { episode: episode })
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
       {calculateProgress(episode._id) ? <ProgressBar
        containerStyle={{ marginTop: 0 }}
        barStyle={{ height: 3 }}
        percentage={calculateProgress(episode._id)}
        /> : null}
        <View style={{flexDirection: 'row', width: '95%', alignSelf: 'center', alignItems: 'center'}}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{episode.episode_title}</Text>
          <Text style={styles.duration}>{episode.runtime}</Text>
        </View>
        <IconAnt name="download" size={35} color="white" />
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
    fontSize: 18,
    fontFamily: 'Sora-Bold'
  },
  duration: {
    color: "darkgrey",
    fontSize: 14,
  },
});
export default EpisodeItem;
