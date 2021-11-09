import React, {useRef, useEffect, useState} from 'react'
import { View, StatusBar, AppState, Platform, StyleSheet } from 'react-native'
import ReactNativeBitmovinPlayer, {
  ReactNativeBitmovinPlayerMethodsType,
  } from '@takeoffmedia/react-native-bitmovin-player';
  import Orientation from 'react-native-orientation';
  import {
    addToWatchList,
    removeFromWatchList,
    addtoWatchedProfile,
    updateWatchedProfile,
    addToProfileWatchList,
    removeFromProfileWatchList,
    updateMovieTime
  } from "../store/actions/user";
  import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

const BitmovinPlayer = ({navigation,route}) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isPlaying, setIsPlaying] = useState(false);
  const {movie} = route.params;
  const [watched, setWatched] = useState(0);
  const [duration, setDuration] = useState(0);
  const appState = useRef(AppState.currentState);

  const videoUrl = Platform.select({
    ios: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    android: 'https://bitdash-a.akamaihd.net/content/sintel/sintel.mpd',
    default: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  });
  
  const setWatchedMovie = async () => {
    if (isWatched(user.currentProfile.watched, movie.title)){
      AsyncStorage.setItem("isWatchedBefore", "true")
    } else {
      AsyncStorage.setItem("isWatchedBefore", "false")
    }
  }
useEffect(()=> {
setWatchedMovie()
}, [])
  const stopPlaying = async () => {
    const didPlay = await AsyncStorage.getItem("didPlay")
    //Orientation.lockToPortrait();
    if (didPlay == 'true'){
      saveMovie();
    }
    if (Platform.OS === 'ios') {
      //ReactNativeBitmovinPlayerIntance.pause();
      console.log('ios');
    } else if (Platform.OS == 'android' && didPlay == "true") {
      //ReactNativeBitmovinPlayerIntance.destroy();
      AsyncStorage.setItem("didPlay", "false")
      console.log('android');
    }
    AsyncStorage.setItem("movieName", "")
   // Orientation.lockToPortrait()
  }
  
  const stoppedPlaying = () => {
    //navigation.goBack();
  }
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
  useEffect(() => {
    AppState.addEventListener("change",   stopPlaying,
    );
    
    return () => {
      AppState.removeEventListener("change",   stopPlaying);
    };
  }, [appState]);
  
  //console.log('state out',user.watchedAt, user.duration);

/*   useEffect(() => {
    if (watched > 0 ) {
    updateMovieTime(watched, duration)(dispatch)
      console.log('updating time locally');
    }
    saveMovie()
  }, [watched]); */

  const saveMovie = async () => {
    const whatTime = await AsyncStorage.getItem('watched');
    const whatDuration = await AsyncStorage.getItem('duration');

    console.log('update watched', whatTime, whatDuration);
    if (whatTime > 0) {
    if (
      isWatched(user.currentProfile.watched, movie.title) == false
    ) {
      console.log('here 1');
      addtoWatchedProfile(
        user.user._id,
        movie.title,
        Number(whatDuration),
        Number(whatTime),
        user.currentProfile._id
      )(dispatch);
    } else if (
      isWatched(user.currentProfile.watched, movie.title) == true
    ) {
      console.log('here 2');
      updateWatchedProfile(
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
 const saveTiming = (x,  y) => {
 AsyncStorage.setItem('duration', x);
 AsyncStorage.setItem('watched', y);

 }

  let str= movie.play_url;
  let playURL;
if (Platform.OS === 'android') {
  playURL = str.replace('m3u8-aapl','mpd-time-cmaf')
} else {
  playURL = str;
}
    return (
      <View
      style={{ flex: 1, backgroundColor: "black" }}
    >
            <StatusBar hidden /> 
        <View style={{width: '100%', height: '100%'}}>
<ReactNativeBitmovinPlayer
      style={styles.container}
        autoPlay={true}
        hasZoom={false}
        configuration={{
          url: playURL,
         // poster: episode.wide_thumbnail_link,
          startOffset: 0,
          hasNextEpisode: false,
          subtitles: '',
         // thumbnails: '',
          //title: movie.title,
          subtitle: movie.title,
          nextPlayback: 1,
          hearbeat: 1,
          advisory: {
            classification: movie.film_rating,
            description: movie.content_advisory,
          },
        }}
        onLoad={e => console.log('Load', e)}
        onError={e => console.log('Error', e)}
       onPlay={async ({nativeEvent})=> {Platform.OS == 'android' ?  Orientation.lockToLandscapeLeft() : Orientation.lockToLandscapeRight(),console.log(nativeEvent)
, await AsyncStorage.setItem("didPlay", 'true'), await AsyncStorage.setItem('movieName', movie.title) }}
        onEvent={({nativeEvent}) => { console.log(nativeEvent),saveTiming(String(nativeEvent.duration), String(nativeEvent.time))}}
        onPause={()=> setIsPlaying(false)}
      />  
{/*       <ReactNativeBitmovinPlayer
      style={styles.container}
      autoPlay
      hasZoom={false}
      configuration={{
        title: 'It works',
        subtitle: 'S1 · E1',
        startOffset: 10,
        nextPlayback: 30,
        hasNextEpisode: false,
        advisory: {
          classification: 'TV-PG',
          description: 'All Drama',
        },
        hearbeat: 10,
        url: videoUrl,
        poster:
          'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/poster.jpg',
        subtitles:
          'https://bitdash-a.akamaihd.net/content/sintel/subtitles/subtitles_en.vtt',
        thumbnails:
          'https://bitdash-a.akamaihd.net/content/sintel/sprite/sprite.vtt',
      }}
      onReady={({ nativeEvent }) => {
        console.log({ nativeEvent });
      }}
      onEvent={({ nativeEvent }) => {
        console.log({ nativeEvent });
      }}
      onPause={({ nativeEvent }) => {
        console.log({ nativeEvent });
      }}
      onPlay={({ nativeEvent }) => {
        console.log({ nativeEvent });
      }}
      onSeek={({ nativeEvent }) => {
        console.log({ nativeEvent });
      }}
      onForward={({ nativeEvent }) => {
        console.log({ nativeEvent });
      }}
      onRewind={({ nativeEvent }) => {
        console.log({ nativeEvent });
      }}
      onPiPEnter={({ nativeEvent }) => {
        console.log({ nativeEvent });
      }}
    />   */}  
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
export default BitmovinPlayer
