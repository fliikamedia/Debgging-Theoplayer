import React, {useState} from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import ReactNativeBitmovinPlayer, {
  ReactNativeBitmovinPlayerIntance,
} from '@takeoffmedia/react-native-bitmovin-player';
import Orientation from 'react-native-orientation';

const EpisodeDetailScreen = ({ route }) => {
  const { episode } = route.params;
  const [playing, setPlaying] = useState(false)
  //console.log(episode);
  
  let playerHeight;
  let playerMargin
if (playing) {
  playerHeight = '100%'
  playerMargin = 0;
} else {
  playerHeight = '30%'  
  playerMargin = 30;
}
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
          url: episode.play_url,
          poster: episode.wide_thumbnail_link,
          startOffset: 0,
          hasNextEpisode: true,
          subtitles: '',
          thumbnails: '',
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
        onPlaying={e=> {console.log(e),setPlaying(true), Orientation.lockToLandscape()}}
        onEvent={({nativeEvent}) => console.log('event', nativeEvent)}
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
