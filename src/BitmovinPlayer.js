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

const BitmovinPlayer = ({route}) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isPlaying, setIsPlaying] = useState(false);
  const {movie} = route.params;

  const [watched, setWatched] = useState(0);
  const [duration, setDuration] = useState(0);
  const appState = useRef(AppState.currentState);


  const stopPlaying = async () => {
    const didPlay = await AsyncStorage.getItem("didPlay")
    Orientation.lockToPortrait();

    if (Platform.OS === 'ios') {
      ReactNativeBitmovinPlayerIntance.pause();
      console.log('ios');
    } else if (Platform.OS == 'android' && didPlay == "true") {
      ReactNativeBitmovinPlayerIntance.destroy();
      AsyncStorage.setItem("didPlay", "false")
      console.log('android');
    }
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

  useEffect(() => {
    if (watched > 0 ) {
    updateMovieTime(watched, duration)(dispatch)
      console.log('updating time locally');
    }
    saveMovie()
  }, [watched]);
  const saveMovie = () => {
    console.log('state',user.watchedAt, user.duration);
    if (watched > 0){
    if (
      !user.isProfile &&
      isWatched(user.user.watched, movie.title) == true
      ) {
        updateWatched(user.email, movie, user.duration, user.watchedAt)(dispatch);
      } else if (
        !user.isProfile &&
        isWatched(user.user.watched, movie.title) == false
        ) {
          addtoWatched(user.email, movie, user.duration, user.watchedAt)(dispatch);
        } else if (
          user.isProfile &&
      isWatched(user.profile.watched, movie.title) == false
    ) {
      addtoWatchedProfile(
        user.email,
        movie,
        user.duration,
        user.watchedAt,
        user.profileName
      )(dispatch);
    } else if (
      user.isProfile &&
      isWatched(user.profile.watched, movie.title) == true
    ) {
      updateWatchedProfile(
        user.email,
        movie,
        user.duration,
        user.watchedAt,
        user.profileName
      )(dispatch);
    }
  }
  };
  
 //console.log(movie);

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
       onPlaying={async ({nativeEvent})=> {console.log(nativeEvent)
, await AsyncStorage.setItem("didPlay", 'true') }}
        onEvent={({nativeEvent}) => { console.log(nativeEvent),setDuration(nativeEvent.duration), setWatched(nativeEvent.time)}}
        onPause={()=> setIsPlaying(false)}
      />            
        </View>
        </View>
    )
}

export default BitmovinPlayer
