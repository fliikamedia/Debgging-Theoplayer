import React, {useRef, useEffect} from 'react'
import { View, StatusBar, AppState } from 'react-native'
import ReactNativeBitmovinPlayer, {
    ReactNativeBitmovinPlayerIntance,
  } from '@takeoffmedia/react-native-bitmovin-player';
  import Orientation from 'react-native-orientation';

const BitmovinPlayer = ({route}) => {

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    AppState.addEventListener("change", Orientation.lockToPortrait());

    return () => {
      AppState.removeEventListener("change", Orientation.lockToPortrait());
    };
  }, [appState]);
  const {episode} = route.params;
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
          url: episode.play_url,
          poster: episode.wide_thumbnail_link,
          startOffset: 0,
          hasNextEpisode: true,
          subtitles: '',
          thumbnails: '',
          title: episode.title,
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
        onPlaying={e=> {console.log(e), Orientation.lockToLandscape()}}
        onEvent={({nativeEvent}) => console.log('event', nativeEvent.volume == 90)}
      />            
        </View>
        </View>
    )
}

export default BitmovinPlayer
