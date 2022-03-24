import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import RecycleViewVertical from "./components/RecycleViewVertical";

const WatchList = ({ navigation }) => {
  const user = useSelector((state) => state.user);
  const movies = useSelector((state) => state.movies);

  let watchList = [];
  try {
    watchList = user.currentProfile.watchList;
  } catch (err) {
    watchList = [];
  }

  let watchListLength;

  try {
    watchListLength = watchList.length;
  } catch (err) {}

  let moviesList;
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("focused");
      moviesList = getWatchList();
    });
    return () => unsubscribe();
  }, [navigation]);

  useEffect(() => {
    moviesList = getWatchList();
  }, []);
  const getWatchList = () => {
    const myList = [];

    for (let i = 0; i < watchListLength; i++) {
      for (let c = 0; c < movies?.availableMovies?.length; c++) {
        if (watchList[i]?.season) {
          if (
            watchList[i]?.title == movies.availableMovies[c].title &&
            watchList[i]?.season == movies.availableMovies[c].season_number &&
            movies.availableMovies[c].dvd_thumbnail_link
          ) {
            myList.push(movies.availableMovies[c]);
          }
        } else {
          if (
            watchList[i]?.title == movies.availableMovies[c].title &&
            movies.availableMovies[c].dvd_thumbnail_link
          ) {
            myList.push(movies.availableMovies[c]);
          }
        }
      }
    }

    return myList;
  };

  const renderWatchList = () => {
    if (watchListLength) {
      return (
        <View>
          <RecycleViewVertical
            index={0}
            movie={getWatchList()}
            navigation={navigation}
          />
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            width: "80%",
            alignSelf: "center",
          }}
        >
          <Text style={{ fontSize: 20, color: "#fff", textAlign: "center" }}>
            Add movies and TV shows so you can watch them later
          </Text>
          {/* <TouchableOpacity style={{width: 180, height: 40, backgroundColor: '#505050', justifyContent: 'center', alignItems: 'center', borderRadius: 5}}>
            <Text style={{fontSize: 18, fontFamily: 'Sora-Regular', color: '#fff'}}>Search Movies</Text>
        </TouchableOpacity> */}
        </View>
      );
    }
  };
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>{renderWatchList()}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    marginTop: 10,
    paddingHorizontal: 10,
  },
});
export default WatchList;
