import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import RecycleViewVertical from "./components/RecycleViewVertical";
import RBSheet from "react-native-raw-bottom-sheet";
import IconAnt from "react-native-vector-icons/AntDesign";
import { MOVIEDETAIL } from "../constants/RouteNames";
import {
  removeFromProfileWatchList,
  addtoWatchedProfile,
  updateWatchedProfile,
  getUser,
} from "../store/actions/user";
import FastImage from "react-native-fast-image";
import { SIZES } from "../constants";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import RbSheetMovieItem from "./components/RbSheetMovieItem";
import RbSheetSeasonItem from "./components/RbSheetSeasonItem";
import AsyncStorage from "@react-native-community/async-storage";
import Orientation from "react-native-orientation";
import moment from "moment";
import firebase from "firebase";

const WatchList = ({ navigation }) => {
  const user = useSelector((state) => state.user);
  const movies = useSelector((state) => state.movies);
  const dispatch = useDispatch();
  const refRBSheet = useRef(null);
  const refRBSheetMovies = useRef(null);

  const [rbTitle, setRbTitle] = useState({});
  const [rbItem, setRbItem] = useState({});
  const [movieWatchList, setMovieWatchlist] = useState([]);
  const [seasonNumber, setSeasonNumber] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      Orientation.lockToPortrait();

      const whatTime = await AsyncStorage.getItem("watched");
      const whatDuration = await AsyncStorage.getItem("duration");
      const didPlay = await AsyncStorage.getItem("didPlay");
      const movieTitle = await AsyncStorage.getItem("movieName");
      const seasonNumber = await AsyncStorage.getItem("seasonNumber");
      const episodeNumber = await AsyncStorage.getItem("episodeNumber");
      const movieId = await AsyncStorage.getItem("movieId");
      const isWatchedMovie = await AsyncStorage.getItem("isWatchedBefore");
      const userId = await AsyncStorage.getItem("userId");
      const profileId = await AsyncStorage.getItem("profileId");
      // console.log('timing', whatTime, whatDuration, movieTitle);
      if (didPlay == "true") {
        saveMovie(
          userId,
          profileId,
          Number(whatDuration),
          Number(whatTime),
          movieId,
          movieTitle,
          isWatchedMovie,
          Number(seasonNumber),
          Number(episodeNumber)
        );
      }
      if (Platform.OS == "android") {
        //console.log('focused', didPlay);
        if (didPlay === "true") {
          //ReactNativeBitmovinPlayerIntance.destroy();
          AsyncStorage.setItem("didPlay", "false");
          console.log("focused", didPlay);
        }
      } else {
        // console.log('focused ios');
        //ReactNativeBitmovinPlayerIntance.pause()
      }

      AsyncStorage.setItem("watched", "0");
      AsyncStorage.setItem("duration", "0");
      AsyncStorage.setItem("isWatchedBefore", "null");
      AsyncStorage.setItem("movieId", "null");
      AsyncStorage.setItem("userId", "null");
      AsyncStorage.setItem("profileId", "null");
    });
    return () => unsubscribe();
  }, [navigation]);

  const onRefresh = useCallback(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.getIdToken().then(function (idToken) {
          getUser(user.email, idToken)(dispatch);
        });
      }
    });
  }, []);
  const saveMovie = (
    userId,
    profileId,
    duration,
    time,
    movieId,
    title,
    isWatchedMovie,
    seasonNumber,
    episodeNumber
  ) => {
    if (time > 0) {
      if (isWatchedMovie === "false") {
        //console.log('here 1');
        addtoWatchedProfile(
          moment(),
          moment(),
          userId,
          movieId,
          title,
          duration,
          time,
          profileId
        )(dispatch);
      } else {
        //console.log('here 2');
        updateWatchedProfile(
          moment(),
          userId,
          movieId,
          title,
          duration,
          time,
          profileId
        )(dispatch);
      }
    }
  };

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
  const openRBSheet = () => {
    refRBSheetMovies.current.open();
  };
  const closeRBSheet = () => {
    refRBSheetMovies.current.close();
  };

  const renderBottomSheetMovies = () => {
    let firstSeries;
    try {
      firstSeries = series[0];
    } catch (err) {}

    let allSeasons;
    try {
      allSeasons = movies.availableMovies
        ?.filter((r) => r.title === rbItem.title)
        ?.map((r) => r.season_number);
    } catch (err) {}

    const seasons = [...new Set(allSeasons)];
    let seriesTitle;
    try {
      seriesTitle = rbItem.title;
    } catch (err) {}

    let rbHeight;
    if (rbItem.film_type === "series") {
      rbHeight = SIZES.height * 0.5;
    } else {
      rbHeight = SIZES.height * 0.38;
      //rbHeight = SIZES.height * 0.65;
    }
    return (
      <RBSheet
        // animationType="slide"
        ref={refRBSheetMovies}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
        closeDuration={200}
        height={SIZES.height / 2}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: "#fff",
          },
          container: {
            backgroundColor: "rgba(0,0,0, 0.92)",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderWidth: 0.6,
            borderColor: "grey",
            // height: SIZES.height * 0.5,
          },
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingLeft: 20,
            paddingBottom: 20,
            flexDirection: "column",
            justifyContent: seasons?.length === 1 ? "center" : "space-between",
          }}
        >
          {rbItem.film_type === "series" && seasons ? (
            seasons.map((season, index) => (
              <RbSheetSeasonItem
                setSeason={setSeasonNumber}
                key={season}
                seasonNumber={season}
                seriesTitle={seriesTitle}
                closeRBSheet={closeRBSheet}
                from="home"
                navigate={navigation.navigate}
                seriesId={rbItem._id}
              />
            ))
          ) : (
            <RbSheetMovieItem
              navigate={navigation.navigate}
              movieTitle={rbItem.title}
              closeRBSheet={closeRBSheet}
              from="watchlist"
            />
          )}
        </ScrollView>
      </RBSheet>
    );
  };

  // Toast config
  const showToast = (text) => {
    Toast.show({
      type: "success",
      text2: text,
      position: "bottom",
      visibilityTime: 2000,
    });
  };

  const toastConfig = {
    /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: "#404040",
          backgroundColor: "#404040",
          width: 250,
          borderRadius: 10,
          height: 50,
          marginBottom: 30,
        }}
        text2Style={{
          fontSize: 15,
          fontWeight: "400",
          textAlign: "center",
          color: "#fff",
        }}
      />
    ),
    /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
    error: (props) => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 17,
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),
    /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
    tomatoToast: ({ text1, props }) => (
      <View style={{ height: 60, width: "100%", backgroundColor: "tomato" }}>
        <Text>{text1}</Text>
        <Text>{props.uuid}</Text>
      </View>
    ),
  };
  // End of Toast
  // let moviesList;
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     console.log("focused");
  //     getWatchList();
  //   });
  //   return () => unsubscribe();
  // }, [navigation, watchListLength]);

  // useEffect(() => {
  //   getWatchList();
  // }, [watchListLength]);
  // const getWatchList = () => {
  useEffect(() => {
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

    setMovieWatchlist(myList);
  }, [watchList]);

  //// End of Bootom Sheet Continue Watching
  const renderWatchList = () => {
    if (watchListLength) {
      return (
        <View style={styles.listContainer}>
          {movieWatchList.map((movie) => (
            <TouchableOpacity
              key={movie._id}
              onPress={() => {
                navigation.navigate(MOVIEDETAIL, {
                  selectedMovie: movie._id,
                  isSeries: movie.film_type,
                  seriesTitle: movie.title,
                });
              }}
            >
              <FastImage
                style={{
                  width: SIZES.width * 0.45 - SIZES.width * 0.012,
                  height: SIZES.width * 0.7,
                  borderRadius: 5,
                  margin: SIZES.width * 0.012,
                }}
                source={{ uri: movie.dvd_thumbnail_link }}
              />
              <TouchableOpacity
                onPress={() => {
                  setRbItem(movie), openRBSheet();
                }}
                style={styles.carouselIconInfo}
              >
                <IconMaterial name="more-vert" size={30} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>{renderWatchList()}</View>
      {renderBottomSheetMovies()}
      <Toast config={toastConfig} />
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
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  carouselIconInfo: {
    position: "absolute",
    bottom: 15,
    left: 15,
    padding: 4,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    elevation: 25,
    // borderWidth: 1,
    //borderColor: "white",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
});
export default WatchList;
