import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  LogBox,
} from "react-native";

import Orientation from "react-native-orientation-locker";
import {
  addtoWatchedProfile,
  updateWatchedProfile,
  addToProfileWatchList,
  removeFromProfileWatchList,
  updateMovieTime,
} from "../store/actions/user";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";
import IconAwesome from "react-native-vector-icons/FontAwesome5";
import {
  EPISODEDETAIL,
  MOVIEDETAIL,
  BITMOVINPLAYER,
  THEOPLAYER,
} from "../constants/RouteNames";
import FastImage from "react-native-fast-image";
import moment from "moment";
import { COLORS, SIZES, icons } from ".././constants";
import MovieDetailIcon from "./components/MovieDetailIcon";

const EpisodeDetailScreen = ({ navigation, route }) => {
  const CURRENT_PLAYER = THEOPLAYER;
  const user = useSelector((state) => state.user);
  const movies = useSelector((state) => state.movies);
  const dispatch = useDispatch();
  const { episode } = route.params;
  const [playing, setPlaying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  //LogBox.ignoreAllLogs()
  const [watched, setWatched] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      Orientation.lockToPortrait();

      const whatTime = await AsyncStorage.getItem("watched");
      const whatDuration = await AsyncStorage.getItem("duration");
      const didPlay = await AsyncStorage.getItem("didPlay");
      const movieTitle = await AsyncStorage.getItem("movieName");
      const seasonNumber = await AsyncStorage.getItem("seasonNumber");
      const episodeNumber = await AsyncStorage.getItem("episodeNumber");
      const movieId = await AsyncStorage.getItem("movieId");

      const isWatchedMovie = await AsyncStorage.getItem("isWatchedBefore");
      const userId = await AsyncStorage.getItem("userId");
      const profileId = await AsyncStorage.getItem("profileId");
      //console.log('timing', whatTime, whatDuration, movieTitle);
      if (didPlay == "true") {
        saveMovie(
          userId,
          profileId,
          Number(whatDuration),
          Number(whatTime),
          movieId,
          movieTitle,
          isWatchedMovie,
          Number(seasonNumber),
          Number(episodeNumber)
        );
      }
      if (Platform.OS == "android") {
        console.log("focused", didPlay);
        if (didPlay === "true") {
          //ReactNativeBitmovinPlayerIntance.destroy();
          AsyncStorage.setItem("didPlay", "false");
          console.log("focused", didPlay);
        }
      } else {
        console.log("focused ios");
        //ReactNativeBitmovinPlayerIntance.pause()
      }

      AsyncStorage.setItem("watched", "0");
      AsyncStorage.setItem("duration", "0");
      AsyncStorage.setItem("movieName", "null");
      AsyncStorage.setItem("isWatchedBefore", "null");
      AsyncStorage.setItem("movieId", "null");
      AsyncStorage.setItem("userId", "null");
      AsyncStorage.setItem("profileId", "null");
    });
    return () => unsubscribe();
  }, [navigation]);
  const isWatched = (movieArray, movieName) => {
    try {
      var movieWatched = false;
      for (var i = 0; i < movieArray.length; i++) {
        if (movieArray[i].title == movieName) {
          movieWatched = true;
          break;
        }
      }
      return movieWatched;
    } catch (err) {}
  };

  const saveMovie = (
    userId,
    profileId,
    duration,
    time,
    movieId,
    title,
    isWatchedMovie,
    seasonNumber,
    episodeNumber
  ) => {
    console.log(
      "saving movie",
      duration,
      time,
      title,
      isWatchedMovie,
      seasonNumber,
      episodeNumber
    );
    // console.log('iswatched',   isWatched(user.currentProfile.watched, title));
    if (time > 0) {
      if (isWatchedMovie === "false") {
        console.log("here 1 series");
        addtoWatchedProfile(
          moment(),
          moment(),
          userId,
          movieId,
          title,
          duration,
          time,
          profileId,
          seasonNumber,
          episodeNumber
        )(dispatch);
      } else {
        console.log("here 2 series");
        updateWatchedProfile(
          moment(),
          userId,
          movieId,
          title,
          duration,
          time,
          profileId,
          seasonNumber,
          episodeNumber
        )(dispatch);
      }
    }
  };

  const renderHeaderBar = () => {
    const navigateBack = () => {
      navigation.goBack();
    };
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          flexDirection: "row",
          // justifyContent: "space-between",
          // alignItems: "center",
          marginTop: Platform.OS == "ios" ? 40 : 40,
          paddingHorizontal: SIZES.padding,
        }}
      >
        {/* Back Button */}
        <MovieDetailIcon iconFuc={navigateBack} icon={icons.left_arrow} />
        {/* Share Button */}
        {/* <MovieDetailIcon
          iconFuc={() => console.log("cast clicked")}
          icon={icons.cast}
        /> */}
      </View>
    );
  };
  const renderEpisodeThumbnail = () => {
    let producersLength;
    let writersLength;
    let cinematographersLength;
    try {
      producersLength = episode?.producers[0]?.length;
      writersLength = episode?.writers[0]?.length;
      cinematographersLength = episode?.cinematographers[0]?.length;
    } catch (err) {
      console.log(err);
    }

    return (
      <View>
        <TouchableOpacity
          style={{
            height: SIZES.width,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() =>
            navigation.navigate(CURRENT_PLAYER, {
              movieId: episode._id,
              time: null,
            })
          }
        >
          <FastImage
            source={{ uri: episode.wide_thumbnail_link }}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
            }}
          />
          {renderHeaderBar()}
          <TouchableOpacity
            style={{
              padding: 18,
              borderRadius: 40,
              justifyContent: "center",
              alignItems: "center",
              elevation: 25,
              borderWidth: 2,
              borderColor: "#fff",
            }}
            onPress={() =>
              navigation.navigate(CURRENT_PLAYER, {
                movieId: episode._id,
                time: null,
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

        <View
          style={{
            flex: 1,
            marginTop: SIZES.padding,
            justifyContent: "space-around",
          }}
        >
          {/* titme, running time and progress bar */}
          <View>
            <View style={{ flexDirection: "row" }}></View>
          </View>
          {/* watch */}
          <View style={{ width: "100%", paddingHorizontal: 10 }}>
            <Text
              style={{
                fontFamily: "Sora-Regular",
                color: COLORS.white,
                textAlign: "justify",
                marginBottom: 5,
              }}
            >
              {episode.storyline}
            </Text>
          </View>
          <View
            style={{
              width: "95%",
              height: 2,
              backgroundColor: "grey",
              alignSelf: "center",
              marginVertical: 10,
            }}
          ></View>
          <View style={{ width: "100%", paddingHorizontal: 10 }}>
            <Text style={styles.moreText}>More Information</Text>
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
            <View
              style={{
                width: "95%",
                height: 2,
                backgroundColor: "grey",
                alignSelf: "center",
                marginVertical: 10,
              }}
            ></View>
            <Text style={styles.titleTextBg}>Cast</Text>
            <Text style={styles.detailText}>
              {episode.cast.toString().replace(/,/g, ", ")}
            </Text>
            <Text style={styles.titleTextBg}>Crew</Text>
            <Text style={styles.titleText}>Directors</Text>
            <Text style={styles.detailText}>
              {episode.directors.toString().replace(/,/g, ", ")}
            </Text>
            {writersLength ? (
              <View>
                <Text style={styles.titleText}>Writers</Text>
                <Text style={styles.detailText}>
                  {episode.writers.toString().replace(/,/g, ", ")}
                </Text>
              </View>
            ) : null}
            {cinematographersLength ? (
              <View>
                <Text style={styles.titleText}>Cinematographers</Text>
                <Text style={styles.detailText}>
                  {episode.cinematographers.toString().replace(/,/g, ", ")}
                </Text>
              </View>
            ) : null}
            {producersLength ? (
              <View>
                <Text style={styles.titleText}>Producers</Text>
                <Text style={styles.detailText}>
                  {episode.producers.toString().replace(/,/g, ", ")}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <View
          style={{
            width: "90%",
            height: 2,
            backgroundColor: "grey",
            alignSelf: "center",
            marginVertical: 10,
          }}
        ></View>
        <Text
          style={{
            fontFamily: "Sora-Regular",
            color: "#fff",
            fontSize: 26,
            marginBottom: 20,
            marginLeft: 10,
          }}
        >
          People Also Watched
        </Text>
      </View>
    );
  };

  const peopleAlsoWatched = () => {
    let alsoWatchIds = [];
    for (let i = 0; i < episode.genre.length; i++) {
      for (let x = 0; x < movies.availableMovies.length; x++) {
        if (
          movies.availableMovies[x].title != episode.title &&
          movies.availableMovies[x].genre.includes(episode.genre[i]) &&
          movies.availableMovies[x]?.film_type === "movie"
        ) {
          alsoWatchIds.push(movies.availableMovies[x]._id);
          // console.log(movies.availableMovies[x].title);
        }
      }
    }

    let alsoWatchSet = [...new Set(alsoWatchIds)];

    let alsoWatch = [];
    for (let x = 0; x < movies.availableMovies.length; x++) {
      for (let c = 0; c < alsoWatchSet.length; c++) {
        if (movies.availableMovies[x]._id === alsoWatchSet[c]) {
          alsoWatch.push(movies.availableMovies[x]);
        }
      }
    }
    let numColumns = 3;
    return (
      <View style={{ marginBottom: 30 }}>
        <FlatList
          numColumns={numColumns}
          ListHeaderComponent={renderEpisodeThumbnail()}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          data={alsoWatch}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate(MOVIEDETAIL, {
                  selectedMovie: item._id,
                  isSeries: item.film_type,
                  seriesTitle: item.title,
                });
              }}
            >
              <FastImage
                style={{
                  width: SIZES.width * 0.3,
                  height: SIZES.width * 0.45,
                  borderRadius: 2,
                  marginHorizontal: 5,
                }}
                source={{ uri: item.dvd_thumbnail_link }}
              />
            </TouchableWithoutFeedback>
          )}
        />
      </View>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {peopleAlsoWatched()}
    </View>
  );
};

const styles = StyleSheet.create({
  moreText: {
    fontSize: 26,
    fontFamily: "Sora-Regular",
    color: "#fff",
    marginBottom: 20,
  },
  titleText: {
    fontSize: 20,
    fontFamily: "Sora-Regular",
    color: "#fff",
  },
  titleTextBg: {
    fontSize: 26,
    fontFamily: "Sora-Regular",
    color: "#fff",
  },
  detailText: {
    fontFamily: "Sora-Light",
    fontSize: 14,
    color: "white",
    marginBottom: 10,
  },
});

export default EpisodeDetailScreen;
