import React, {useState, useRef, useEffect} from "react";
import { View, Text, StyleSheet, StatusBar, AppState, Platform, Image, TouchableOpacity, LogBox } from "react-native";
import ReactNativeBitmovinPlayer, {
  ReactNativeBitmovinPlayerIntance,
} from '@takeoffmedia/react-native-bitmovin-player';
import Orientation from 'react-native-orientation';
import {
  addtoWatchedProfile,
  updateWatchedProfile,
  addToProfileWatchList,
  removeFromProfileWatchList,
  updateMovieTime
} from "../store/actions/user";
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from "@react-native-community/async-storage";
import IconAnt from 'react-native-vector-icons/AntDesign';
import { BITMOVINPLAYER } from "../constants/RouteNames";
import FastImage from 'react-native-fast-image'


const EpisodeDetailScreen = ({ navigation,route }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { episode } = route.params;
  const [playing, setPlaying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
LogBox.ignoreAllLogs()
  const [watched, setWatched] = useState(0);
  const [duration, setDuration] = useState(0);
  //console.log(episode);
/*   useEffect( () => {
    const unsubscribe = navigation.addListener('focus', async () => {
     // Orientation.lockToPortrait();
      console.log('timing', user.duration, user.watchedAt);
      if (Platform.OS == 'android') {
      const didPlay = await AsyncStorage.getItem("didPlay")
      console.log('focused', didPlay);
      if (didPlay === 'true') {
      ReactNativeBitmovinPlayerIntance.destroy();
      AsyncStorage.setItem("didPlay", "false")
      console.log('focused', didPlay);
    }
      
  } else {
    console.log('focused ios');
    ReactNativeBitmovinPlayerIntance.pause()
  }
  return unsubscribe;
});
  }, [navigation]); */

  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', async () => {
       Orientation.lockToPortrait();
      
      const whatTime = await AsyncStorage.getItem('watched');
      const whatDuration = await AsyncStorage.getItem('duration');
      const didPlay = await AsyncStorage.getItem("didPlay")
      const movieTitle=  await AsyncStorage.getItem("movieName")

      let isWatchedMovie = isWatched(user.currentProfile.watched, movieTitle)
      console.log('timing', whatTime, whatDuration, movieTitle);
      if (didPlay == "true"){
       saveMovie(Number(whatDuration), Number(whatTime), movieTitle, isWatchedMovie);
      }
      if (Platform.OS == 'android') {
      console.log('focused', didPlay);
      if (didPlay === 'true') {
      ReactNativeBitmovinPlayerIntance.destroy();
      AsyncStorage.setItem("didPlay", "false")
      console.log('focused', didPlay);
    }
      
  } else {
    console.log('focused ios');
    ReactNativeBitmovinPlayerIntance.pause()
  }

  AsyncStorage.setItem('watched', '0');
  AsyncStorage.setItem('duration', '0')
});
//return ()=> unsubscribe();
  }, [navigation]);
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    AppState.addEventListener("change",   stopPlaying,
    );
    
    return () => {
      AppState.removeEventListener("change",   stopPlaying);
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

  const stopPlaying = async () => {
    const didPlay = await AsyncStorage.getItem("didPlay")
    Orientation.lockToPortrait()

    if (Platform.OS === 'ios') {
      console.log('ios');
      ReactNativeBitmovinPlayerIntance.pause();
    } else if (Platform.OS == 'android' && didPlay == "true") {
      ReactNativeBitmovinPlayerIntance.destroy();
      AsyncStorage.setItem("didPlay", "false")
      console.log('android');

    }
  }


 /*  useEffect(() => {
    if (watched > 0 ) {
      console.log('updating time locally');
      updateMovieTime(watched, duration)(dispatch);
    }
    saveMovie()
  }, [watched]); */
  
  
  const saveMovie = (duration,time,title, isWatchedMovie) => {
    console.log('saving movie',duration,time, title, isWatchedMovie);
    console.log('iswatched',   isWatched(user.currentProfile.watched, title));
   if (
      !isWatchedMovie
    ) {
      console.log('here 1');
      addtoWatchedProfile(
        user.user._id,
        title,
        duration,
        time,
        user.currentProfile._id
      )(dispatch);
    } else {
      console.log('here 2');
      updateWatchedProfile(
        user.user._id,
        title,
        duration,
        time,
        user.currentProfile._id
      )(dispatch);
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
      <TouchableOpacity style={{height: '40%', width: '100%',      alignItems: "center",
            justifyContent: "center",}} onPress={()=>                navigation.navigate(BITMOVINPLAYER, {movie: episode})
          } >
      <FastImage source={{uri: episode.wide_thumbnail_link}} style={{ position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    resizeMode: "cover",}}   />
      <IconAnt name="playcircleo" size={100} color="white" />
      </TouchableOpacity>
      {/*
       <View style={{width: '100%', height: playerHeight, marginTop: playerMargin}}>
         {playing ? <StatusBar hidden /> : null}
      {isPlaying? <ReactNativeBitmovinPlayer
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
        onPlaying={async ({nativeEvent})=> {console.log(nativeEvent),setPlaying(true),  Orientation.lockToLandscape()
          , await AsyncStorage.setItem("didPlay", 'true') }}
        onEvent={({nativeEvent}) => { console.log(nativeEvent),setDuration(Math.ceil(nativeEvent.duration)), setWatched(Math.ceil(nativeEvent.time))}}
        onPause={()=> setIsPlaying(false)}
      /> : null}
        </View>*/}
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
