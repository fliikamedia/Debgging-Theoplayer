import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import { useSelector } from "react-redux";
import { SIZES } from "../../constants";
import { MOVIEDETAIL } from "../../constants/RouteNames";
import DropShadow from "react-native-drop-shadow";

const RbSheetSeasonItem = ({
  seasonNumber,
  seriesTitle,
  setSeason,
  closeRBSheet,
  from,
  navigate,
  seriesId,
}) => {
  const movies = useSelector((state) => state.movies);
  const series = movies.availableMovies.find(
    (r) => r.title === seriesTitle && r.season_number === seasonNumber
  );

  let numberOfEpisodes;
  try {
    numberOfEpisodes = movies.availableMovies.filter(
      (r) => r.title === seriesTitle && r.season_number === seasonNumber
    ).length;
  } catch (err) {}

  const renderSeasonItem = () => {
    if (from === "movieDetails") {
      return (
        <DropShadow
          style={{
            shadowColor: "teal",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.97,
            shadowRadius: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setSeason(seasonNumber), closeRBSheet();
            }}
            style={{
              backgroundColor: "rgba(40,40,40, 0.9)",
              width: "95%",
              height: SIZES.width * 0.15,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={styles.seasonNumber}
              >{`Season ${seasonNumber}   `}</Text>
              <Text style={styles.numOfEpisodes}>
                ({numberOfEpisodes} episodes)
              </Text>
            </View>
          </TouchableOpacity>
        </DropShadow>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            closeRBSheet();
            navigate(MOVIEDETAIL, {
              selectedMovie: seriesId,
              isSeries: "series",
              seriesTitle: seriesTitle,
              rbSeasonNumber: seasonNumber,
            });
          }}
          style={styles.container}
        >
          <FastImage
            style={styles.poster}
            source={{ uri: series.dvd_thumbnail_link }}
          />
          <View style={styles.textContainer}>
            <Text
              style={{
                color: "#fff",
                fontFamily: "Sora-Bold",
                fontSize: 20,
                marginTop: 10,
                marginBottom: 20,
              }}
            >{`Season ${seasonNumber}`}</Text>
            <Text style={styles.numOfEpisodes}>
              Number of episodes: {numberOfEpisodes}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  };
  return <View style={{ paddingTop: 5 }}>{renderSeasonItem()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "rgba(60,60,60, 0.9)",
    width: "95%",
    height: SIZES.width * 0.4,
    borderRadius: 5,
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 10,
    height: "90%",
  },
  title: {
    color: "#fff",
    fontFamily: "Sora-Bold",
    fontSize: 22,
    marginBottom: 25,
  },
  seasonNumber: {
    color: "#fff",
    fontFamily: "Sora-Bold",
    fontSize: 20,
  },
  numOfEpisodes: {
    color: "rgb(175,175,175)",
    fontFamily: "Sora-Regular",
  },
  poster: {
    width: SIZES.width * 0.26,
    height: "95%",
    borderRadius: 5,
    marginLeft: 5,
  },
});
export default RbSheetSeasonItem;
