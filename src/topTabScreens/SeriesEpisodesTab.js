import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import EpisodeItem from "../components/EmpisodeItem";
const SeriesEpisodesTab = ({ route }) => {
  const {
    currentSeries,
    playSeries,
    renderHeaderSection,
    renderCategory,
    renderMovieDetails,
  } = route.params;
  return (
    <View>
      <FlatList
        ListHeaderComponentStyle={
          (renderHeaderSection(), renderCategory(), renderMovieDetails())
        }
        keyExtractor={(item) => item._id}
        data={currentSeries}
        renderItem={({ item }) => (
          <EpisodeItem playSeries={playSeries} episode={item} />
        )}
      />
    </View>
  );
};

export default SeriesEpisodesTab;
