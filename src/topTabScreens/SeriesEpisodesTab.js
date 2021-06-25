import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  LogBox,
} from "react-native";
import EpisodeItem from "../components/EmpisodeItem";
import { useDispatch, useSelector } from "react-redux";

const SeriesEpisodesTab = ({ route }) => {
  LogBox.ignoreLogs([
    "Non-serializable values were found in the navigation state",
  ]);
  const { playSeries } = route.params;
  const movies = useSelector((state) => state.movies);
  //console.log(route);

  let currentSeriesLength;
  try {
    currentSeriesLength = movies.currentSeries.length;
  } catch (err) {}
  if (!currentSeriesLength) {
    return (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <ActivityIndicator
          animating
          color={"teal"}
          size="large"
          style={{ flex: 1, position: "absolute", top: "10%", left: "45%" }}
        />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: "black" }}>
      {/*<FlatList
        ListHeaderComponentStyle={
          (renderHeaderSection(), renderCategory(), renderMovieDetails())
        }
        keyExtractor={(item) => item._id}
        data={currentSeries}
        renderItem={({ item }) => (
          <EpisodeItem playSeries={playSeries} episode={item} />
        )}
        />*/}
      {movies.currentSeries.map((item) => {
        return (
          <EpisodeItem key={item._id} playSeries={playSeries} episode={item} />
        );
      })}
      <Text>Hello</Text>
    </View>
  );
};

export default SeriesEpisodesTab;
