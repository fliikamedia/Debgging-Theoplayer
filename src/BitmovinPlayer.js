import React, {useRef, useEffect, useState} from 'react'
import { View, StatusBar, AppState, Platform } from 'react-native'
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
import AsyncStorage from '@react-native-community/async-storage';

const BitmovinPlayer = ({navigation,route}) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isPlaying, setIsPlaying] = useState(false);
  const {movie} = route.params;

  const [watched, setWatched] = useState(0);
  const [duration, setDuration] = useState(0);
  const appState = useRef(AppState.currentState);


  const stopPlaying = async () => {
    const didPlay = await AsyncStorage.getItem("didPlay")
    //Orientation.lockToPortrait();
    if (didPlay == 'true'){
      saveMovie();
    }
    if (Platform.OS === 'ios') {
      ReactNativeBitmovinPlayerIntance.pause();
      console.log('ios');
    } else if (Platform.OS == 'android' && didPlay == "true") {
      ReactNativeBitmovinPlayerIntance.destroy();
      AsyncStorage.setItem("didPlay", "false")
      console.log('android');
    }
    AsyncStorage.setItem("movieName", "")
   // Orientation.lockToPortrait()
  }
  
  const stoppedPlaying = () =>
  navigation.goBack();
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
    AppState.addEventListener("change",   stoppedPlaying,
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
    if (
      !user.isProfile &&
      isWatched(user.user.watched, movie.title) == true
      ) {
        updateWatched(user.email, movie.title, Number(whatDuration), Number(whatTime))(dispatch);
      } else if (
        !user.isProfile &&
        isWatched(user.user.watched, movie.title) == false
        ) {
          addtoWatched(user.email, movie.title, Number(whatDuration), Number(whatTime))(dispatch);
        } else if (
          user.isProfile &&
      isWatched(user.profile.watched, movie.title) == false
    ) {
      addtoWatchedProfile(
        user.email,
        movie.title,
        Number(whatDuration),
        Number(whatTime),
        user.profileName
      )(dispatch);
    } else if (
      user.isProfile &&
      isWatched(user.profile.watched, movie.title) == true
    ) {
      updateWatchedProfile(
        user.email,
        movie.title,
        Number(whatDuration),
        Number(whatTime),
        user.profileName
      )(dispatch);
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
        autoPlay={true}
        hasZoom={false}
        configuration={{
          url: playURL,
         // poster: episode.wide_thumbnail_link,
          startOffset: 0,
          hasNextEpisode: true,
          subtitles: '',
         // thumbnails: '',
          //title: movie.title,
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
       onPlaying={async ({nativeEvent})=> {Orientation.lockToLandscape(),console.log(nativeEvent)
, await AsyncStorage.setItem("didPlay", 'true'), await AsyncStorage.setItem('movieName', movie.title) }}
        onEvent={({nativeEvent}) => { console.log(nativeEvent),saveTiming(String(nativeEvent.duration), String(nativeEvent.time))}}
        onPause={()=> setIsPlaying(false)}
      />            
        </View>
        </View>
    )
}

export default BitmovinPlayer
