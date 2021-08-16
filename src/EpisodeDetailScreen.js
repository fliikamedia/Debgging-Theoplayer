import React, {useState, useRef, useEffect} from "react";
import { View, Text, StyleSheet, StatusBar, AppState, Platform } from "react-native";
import ReactNativeBitmovinPlayer, {
  ReactNativeBitmovinPlayerIntance,
} from '@takeoffmedia/react-native-bitmovin-player';
import Orientation from 'react-native-orientation';
import {
  addToWatchList,
  removeFromWatchList,
  addtoWatched,
  updateWatched,
  addtoWatchedProfile,
  updateWatchedProfile,
  addToProfileWatchList,
  removeFromProfileWatchList,
  updateMovieTime
} from "../store/actions/user";
import { useDispatch, useSelector } from 'react-redux';

const EpisodeDetailScreen = ({ route }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { episode } = route.params;
  const [playing, setPlaying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [watched, setWatched] = useState(0);
  const [duration, setDuration] = useState(0);
  //console.log(episode);
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    AppState.addEventListener("change", stopPlaying());

    return () => {
      AppState.removeEventListener("change", stopPlaying());
    };
  }, [appState]);

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

  const stopPlaying = () => {
    if (Platform.OS === 'ios') {
      ReactNativeBitmovinPlayerIntance.pause();
    } else {
      //ReactNativeBitmovinPlayerIntance.destroy();
    }
  }


  useEffect(() => {
    if (watched > 0 ) {
      console.log('updating time locally');
      updateMovieTime(watched, duration)(dispatch);
    }
    saveMovie()
  }, [watched]);
  const saveMovie = () => {
    console.log('state',user.watchedAt, user.duration);
    if (watched > 2){
    if (
      !user.isProfile &&
      isWatched(user.user.watched, episode.title) == true
      ) {
        updateWatched(user.email, episode, user.duration, user.watchedAt)(dispatch);
      } else if (
        !user.isProfile &&
        isWatched(user.user.watched, episode.title) == false
        ) {
          addtoWatched(user.email, episode, user.duration, user.watchedAt)(dispatch);
        } else if (
          user.isProfile &&
      isWatched(user.profile.watched, episode.title) == false
    ) {
      addtoWatchedProfile(
        user.email,
        episode,
        user.duration,
        user.watchedAt,
        user.profileName
      )(dispatch);
    } else if (
      user.isProfile &&
      isWatched(user.profile.watched, episode.title) == true
    ) {
      updateWatchedProfile(
        user.email,
        episode,
        user.duration,
        user.watchedAt,
        user.profileName
      )(dispatch);
    }
  }
  };
  let playerHeight;
  let playerMargin
if (playing) {
  playerHeight = '100%'
  playerMargin = 0;
} else {
  playerHeight = '30%'  
  playerMargin = 30;
}

let str= episode.play_url;
let playURL;
if (Platform.OS === 'android') {
playURL = str.replace('m3u8-aapl','mpd-time-cmaf')
} else if (Platform.OS == 'ios' && str.includes('mpd')) {
  playURL = str.replace('mpd-time-csf','m3u8-aapl')

} else {
playURL = str;
}
console.log(playURL);
  return (
    <View
      style={{ flex: 1, backgroundColor: "black" }}
    >
       <View style={{width: '100%', height: playerHeight, marginTop: playerMargin}}>
         {playing ? <StatusBar hidden /> : null}
      <ReactNativeBitmovinPlayer
        autoPlay={false}
        hasZoom={false}
        configuration={{
          url: playURL,
          //poster: episode.wide_thumbnail_link,
          startOffset: 0,
          hasNextEpisode: true,
          subtitles: '',
          //thumbnails: '',
          title: episode.episode_title,
          subtitle: '',
          nextPlayback: 1,
          hearbeat: 1,
          advisory: {
            classification: '',
            description: '',
          },
        }}
        onLoad={e => console.log('Load', e)}
        onError={e => console.log('Error', e)}
        onPlaying={({nativeEvent})=> {console.log(nativeEvent),setIsPlaying(true)}}
        onEvent={({nativeEvent}) => { console.log(nativeEvent),setDuration(Math.ceil(nativeEvent.duration)), setWatched(Math.ceil(nativeEvent.time))}}
        onPause={()=> setIsPlaying(false)}
      />
    </View>
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
