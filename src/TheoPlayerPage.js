import React, { useRef, useEffect, useState } from "react";
import { View, StatusBar, AppState, Platform, StyleSheet } from "react-native";
import Orientation from "react-native-orientation";
import {
  addToWatchList,
  removeFromWatchList,
  addtoWatchedProfile,
  updateWatchedProfile,
  addToProfileWatchList,
  removeFromProfileWatchList,
  updateMovieTime,
} from "../store/actions/user";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";
import KeepAwake from "@sayem314/react-native-keep-awake";
import moment from "moment";
import { PlayerConfiguration, THEOplayerView } from "react-native-theoplayer";
const TheoPlayerPage = ({ navigation, route }) => {
  const user = useSelector((state) => state.user);
  const movies = useSelector((state) => state.movies);
  const dispatch = useDispatch();
  const [isPlaying, setIsPlaying] = useState(false);
  const { movieId, time } = route.params;
  // const [watched, setWatched] = useState(0);
  // const [duration, setDuration] = useState(0);

  const appState = useRef(AppState.currentState);
  const playerRef = useRef(null);
  const movie = movies.availableMovies.find((r) => r._id === movieId);
  let watchedTime;
  try {
    watchedTime = user?.currentProfile?.watched.find(
      (data) => data.movieId === movieId
    ).watchedAt;
  } catch (err) {
    console.log(err);
    watchedTime = 0;
  }
  // const videoUrl = Platform.select({
  //   ios: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
  //   android: "https://bitdash-a.akamaihd.net/content/sintel/sintel.mpd",
  //   default: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
  // });
  // console.log("watched", watchedTime);

  const setWatchedMovie = async () => {
    if (movie.film_type == "movie") {
      AsyncStorage.setItem("isSeries", "movie");
      if (isWatched(user.currentProfile.watched, movie.title)) {
        AsyncStorage.setItem("isWatchedBefore", "true");
      } else {
        AsyncStorage.setItem("isWatchedBefore", "false");
      }
    } else {
      //console.log('seeeeries');
      AsyncStorage.setItem("isSeries", "series");
      if (
        isWatchedSeries(
          user.currentProfile.watched,
          movie.title,
          movie.season_number,
          movie.episode_number
        )
      ) {
        AsyncStorage.setItem("isWatchedBefore", "true");
      } else {
        AsyncStorage.setItem("isWatchedBefore", "false");
      }
    }
  };
  useEffect(() => {
    Platform.OS == "android"
      ? Orientation.lockToLandscapeLeft()
      : Orientation.lockToLandscapeRight();
    setWatchedMovie();
  }, []);
  const stopPlaying = async () => {
    // const didPlay = await AsyncStorage.getItem("didPlay");
    // //Orientation.lockToPortrait();
    // if (didPlay == "true") {
    //   saveMovie();
    // }
    // if (Platform.OS === "ios") {
    //   //ReactNativeBitmovinPlayerIntance.pause();
    //   console.log("ios");
    // } else if (Platform.OS == "android" && didPlay == "true") {
    //   //ReactNativeBitmovinPlayerIntance.destroy();
    //   AsyncStorage.setItem("didPlay", "false");
    //   console.log("android");
    // }
    // AsyncStorage.setItem("movieName", "");
    // AsyncStorage.setItem("isWatchedBefore", "null");

    if (!playerRef) return;
    playerRef?.current?.pause();
  };

  const stoppedPlaying = () => {
    //navigation.goBack();
  };
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

  const isWatchedSeries = (
    seriesArray,
    seriesName,
    seriesSeason,
    seriesEpisode
  ) => {
    try {
      var seriesWatched = false;
      for (var i = 0; i < seriesArray.length; i++) {
        if (
          seriesArray[i].title == seriesName &&
          seriesArray[i].season == seriesSeason &&
          seriesArray[i].episode == seriesEpisode
        ) {
          seriesWatched = true;
          break;
        }
      }
      return seriesWatched;
    } catch (err) {}
  };
  // useEffect(() => {
  //   const subscription = AppState.addEventListener("change", stopPlaying);

  //   return () => {
  //     subscription.remove();
  //   };
  // }, [appState]);

  //console.log('state out',user.watchedAt, user.duration);

  /*   useEffect(() => {
    if (watched > 0 ) {
    updateMovieTime(watched, duration)(dispatch)
      console.log('updating time locally');
    }
    saveMovie()
  }, [watched]); */

  const saveMovie = async () => {
    const whatTime = await AsyncStorage.getItem("watched");
    const whatDuration = await AsyncStorage.getItem("duration");

    //console.log('update watched', whatTime, whatDuration);
    if (whatTime > 0) {
      if (isWatched(user.currentProfile.watched, movie.title) == false) {
        //console.log('here 1');
        addtoWatchedProfile(
          moment(),
          moment(),
          user.user._id,
          movie.title,
          movie._id,
          Number(whatDuration),
          Number(whatTime),
          user.currentProfile._id
        )(dispatch);
      } else if (isWatched(user.currentProfile.watched, movie.title) == true) {
        //console.log('here 2');
        updateWatchedProfile(
          moment(),
          user.user._id,
          movie.title,
          Number(whatDuration),
          Number(whatTime),
          user.currentProfile._id
        )(dispatch);
      }
    }
  };

  //console.log(movie);
  const saveTiming = (x, y) => {
    AsyncStorage.setItem("duration", x);
    AsyncStorage.setItem("watched", y);
  };

  let str = movie.play_url;
  let playURL;
  if (Platform.OS === "android") {
    if (str.includes("m3u8-cmaf")) {
      playURL = str.replace("m3u8-cmaf", "mpd-time-cmaf");
    } else if (str.includes("m3u8-aapl")) {
      playURL = str.replace("m3u8-aapl", "mpd-time-cmaf");
    }
  } else {
    playURL = str;
  }

  // Theo Player

  const license = Platform.select({
    android:
      "sZP7IYe6T6P10ohZClxgTOzoTu0oFSaL3o0-CKaL06zzCL410ofk0SU10Le6FOPlUY3zWokgbgjNIOf9flbi0Lec3oa_FDBc3L0-3QBc3Oz_0QfcFS5Z0Q4lCL4eCo0L3OfVfK4_bQgZCYxNWoryIQXzImf90SCkTS0zTu5i0u5i0Oi6Io4pIYP1UQgqWgjeCYxgflEc3lho3L5kTSei3l5kFOPeWok1dDrLYtA1Ioh6TgV6v6fVfKcqCoXVdQjLUOfVfGxEIDjiWQXrIYfpCoj-fgzVfKxqWDXNWG3ybojkbK3gflNWf6E6FOPVWo31WQ1qbta6FOPzdQ4qbQc1sD4ZFK3qWmPUFOPLIQ-LflNWfK1zWDikf6i6CDrebKjNIOfVfKXpIwPqdDxzU6fVfKINbK4zU6fVfKgqbZfVfGxNsK4pf6i6UwIqbZfVfGUgCKjLfgzVfG3gWKxydDkibK4LbogqW6f9UwPkIYz", // insert Android THEOplayer license here
    ios: "sZP7IYe6T6P10ohZClxgTOzoTu0oFSaL3o0-CKaL06zzCL410ofk0SU10Le6FOPlUY3zWokgbgjNIOf9flbi0Lec3oa_FDBc3L0-3QBc3Oz_0QfcFS5Z0Q4lCL4eCo0L3OfVfK4_bQgZCYxNWoryIQXzImf90SCkTS0zTu5i0u5i0Oi6Io4pIYP1UQgqWgjeCYxgflEc3lho3L5kTSei3l5kFOPeWok1dDrLYtA1Ioh6TgV6v6fVfKcqCoXVdQjLUOfVfGxEIDjiWQXrIYfpCoj-fgzVfKxqWDXNWG3ybojkbK3gflNWf6E6FOPVWo31WQ1qbta6FOPzdQ4qbQc1sD4ZFK3qWmPUFOPLIQ-LflNWfK1zWDikf6i6CDrebKjNIOfVfKXpIwPqdDxzU6fVfKINbK4zU6fVfKgqbZfVfGxNsK4pf6i6UwIqbZfVfGUgCKjLfgzVfG3gWKxydDkibK4LbogqW6f9UwPkIYz", // insert iOS THEOplayer license here
    web: "sZP7IYe6T6P10ohZClxgTOzoTu0oFSaL3o0-CKaL06zzCL410ofk0SU10Le6FOPlUY3zWokgbgjNIOf9flbi0Lec3oa_FDBc3L0-3QBc3Oz_0QfcFS5Z0Q4lCL4eCo0L3OfVfK4_bQgZCYxNWoryIQXzImf90SCkTS0zTu5i0u5i0Oi6Io4pIYP1UQgqWgjeCYxgflEc3lho3L5kTSei3l5kFOPeWok1dDrLYtA1Ioh6TgV6v6fVfKcqCoXVdQjLUOfVfGxEIDjiWQXrIYfpCoj-fgzVfKxqWDXNWG3ybojkbK3gflNWf6E6FOPVWo31WQ1qbta6FOPzdQ4qbQc1sD4ZFK3qWmPUFOPLIQ-LflNWfK1zWDikf6i6CDrebKjNIOfVfKXpIwPqdDxzU6fVfKINbK4zU6fVfKgqbZfVfGxNsK4pf6i6UwIqbZfVfGUgCKjLfgzVfG3gWKxydDkibK4LbogqW6f9UwPkIYz", // insert Web THEOplayer license here
  });

  const playerConfig = {
    license,
    chromeless: Platform.OS === "ios" ? false : true,
  };
  const theoSubtitles = movie?.subtitles_tracks?.map((subtitle, index) => ({
    default: true,
    kind: "subtitles",
    label: subtitle.label,
    src: subtitle.url,
    srclang: "En",
  }));
  // const source = {
  //   sources: [
  //     {
  //       src: playURL,
  //       type:
  //         Platform.OS === "android"
  //           ? "application/dash+xml"
  //           : "application/x-mpegurl",
  //     },
  //   ],
  //   textTracks: theoSubtitles,

  const source = {
    sources: [
      {
        src: playURL,
        type:
          Platform.OS === "android"
            ? "application/dash+xml"
            : "application/x-mpegurl",
      },
    ],
    textTracks: theoSubtitles,
  };
  // };
  // const source = {
  //   sources: [
  //     {
  //       src: "https://contentserver.prudentgiraffe.com/videos/dash/webvtt-embedded-in-isobmff/Manifest.mpd",
  //       type: "application/dash+xml",
  //     },
  //   ],
  //   textTracks: theoSubtitles,
  // };

  // const onLoadedMetadata = (data) => {
  //   console.log("loadedmetadata", JSON.stringify(data));
  // };
  // End of theo player

  return (
    <View
      style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}
    >
      <THEOplayerView
        config={playerConfig}
        source={source}
        paused={false}
        // playbackRate
        // volume
        muted={false}
        fullscreen={true}
        // selectedTextTrack={{
        //   label: "English [CC]",
        //   language: "en-US",
        //   href: "https://bitdash-a.akamaihd.net/content/sintel/subtitles/subtitles_en.vtt",
        // }}
        // selectedVideoTrack
        // selectedAudioTrack
        // style
        // onFullscreenPlayerWillPresent
        // onFullscreenPlayerDidPresent
        // onFullscreenPlayerWillDismiss
        // onFullscreenPlayerDidDismiss
        // onBufferingStateChange
        // onSourceChange
        // onLoadStart
        // onLoadedMetadata={onLoadedMetadata}
        // onLoadedData
        // onReadyStateChange
        // onError
        // onProgress
        // onPlay
        // onPlaying
        // onPause
        // onSeeking
        // onSeeked
        // onEnded
        // onTimeUpdate={(e) => {
        //   console.log(e);
        // }}
        // onDurationChange
        // onSegmentNotFound
        // onTextTrackListEvent={(e) => {
        //   console.log("text tracks", e);
        // }}
        // onTextTrackEvent
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
export default TheoPlayerPage;
