import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  ScrollView,
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Share,
  AppState,
  FlatList,
} from "react-native";
import { COLORS, SIZES, FONTS, icons, images } from ".././constants";
import FliikaApi from "./api/FliikaApi";
import { baseURL } from "./api/expressApi";
import MovieDetailIcon from "./components/MovieDetailIcon";
import LinearGradient  from "react-native-linear-gradient";
import * as Animatable from "react-native-animatable";
import firebase from "firebase";
import { BITMOVINPLAYER, HOME, WELCOMESCREEN } from "../constants/RouteNames";
import { Menu } from "react-native-paper";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWatchList,
  removeFromWatchList,
  addtoWatchedProfile,
  updateWatchedProfile,
  addToProfileWatchList,
  removeFromProfileWatchList,
} from "../store/actions/user";
import EpisodeItem from "./components/EmpisodeItem";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SERIESDETAILSTAB, SERIESEPISODESTAB } from "../constants/RouteNames";
import SeriesEpisodesTab from "./topTabScreens/SeriesEpisodesTab";
import SeriesDetailsTab from "./topTabScreens/SeriesDetailsTab";
import { setCurrentSeries, setMovieTitle } from "../store/actions/movies";
import IconIon from 'react-native-vector-icons/Ionicons';
import IconFeather from 'react-native-vector-icons/Feather'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReactNativeBitmovinPlayer, {
  ReactNativeBitmovinPlayerIntance,
} from '@takeoffmedia/react-native-bitmovin-player';
import AsyncStorage from "@react-native-community/async-storage";
import Orientation from "react-native-orientation";
import moment from "moment";

const MovieDetailScreen = ({ navigation, route }) => {
  const Tab = createMaterialTopTabNavigator();

  const user = useSelector((state) => state.user);
  const movies = useSelector((state) => state.movies);

  const dispatch = useDispatch();
  const [play, setPlay] = useState(false);
  const appState = useRef(AppState.currentState);
  const { selectedMovie, isSeries, seriesTitle } = route.params;
  const [movie, setMovie] = useState({});
  const [series, setSeries] = useState([]);
  const [season, setSeason] = useState({});
  const [episode, setEpisode] = useState(0);
  const [watched, setWatched] = useState(0);
  const [duration, setDuration] = useState(0);
  const [data, setData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seriesEpisode, setSeriesEpisode] = useState([]);
  const [episodes, setEpisodes] = useState(true);
  const [details, setDetails] = useState(false);
  const [seasonNumber, setSeasonNumber] = useState(null);
  //console.log('currentProfile',user.currentProfile);
/*   const getMovie = useCallback(async () => {
    const response = await FliikaApi.get(`/posts/${selectedMovie}`);
    setMovie(response.data);
  }, []);
  useEffect(() => {
    getMovie();
  }, []); */
const currentMovie = movies.availableMovies.find(r => r._id ===selectedMovie);
//console.log('currentMovie', currentMovie);
  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', async () => {
       Orientation.lockToPortrait();
      
      const whatTime = await AsyncStorage.getItem('watched');
      const whatDuration = await AsyncStorage.getItem('duration');
      const didPlay = await AsyncStorage.getItem("didPlay")
      const movieTitle=  await AsyncStorage.getItem("movieName")
      const seasonNumber=  await AsyncStorage.getItem("seasonNumber")
      const episodeNumber=  await AsyncStorage.getItem("episodeNumber")
      const movieId=  await AsyncStorage.getItem("movieId")
      const isWatchedMovie = await AsyncStorage.getItem("isWatchedBefore")
      console.log('timing', whatTime, whatDuration, movieTitle);
      if (didPlay == "true"){
       saveMovie(Number(whatDuration), Number(whatTime),movieId, movieTitle, isWatchedMovie, Number(seasonNumber), Number(episodeNumber));
      }
      if (Platform.OS == 'android') {
      console.log('focused', didPlay);
      if (didPlay === 'true') {
      //ReactNativeBitmovinPlayerIntance.destroy();
      AsyncStorage.setItem("didPlay", "false")
      console.log('focused', didPlay);
    }
      
  } else {
    console.log('focused ios');
    //ReactNativeBitmovinPlayerIntance.pause()
  }

  AsyncStorage.setItem('watched', '0');
  AsyncStorage.setItem('duration', '0')
  AsyncStorage.setItem("isWatchedBefore", "null")
  AsyncStorage.setItem("movieId", "null")

});
return ()=> unsubscribe();
  }, [navigation]);


  const showEpisodes = () => {
    setEpisodes(true);
    setDetails(false);
  };

  const showDetails = () => {
    setEpisodes(false);
    setDetails(true);
  };

  const isWatchList = (movieArray, movieName) => {
    try {
      var found = false;
      for (var i = 0; i < movieArray.length; i++) {
        if (movieArray[i].title == movieName) {
          found = true;
          break;
        }
      }
      return found;
    } catch (err) {}
  };
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
  const saveMovie = (duration,time,movieId,title, isWatchedMovie, seasonNumber, episodeNumber) => {
    console.log('saving movie',duration,time, title, isWatchedMovie, seasonNumber, episodeNumber);
   // console.log('iswatched',   isWatched(user.currentProfile.watched, title));
   if(time > 0) {
      if (isSeries === 'movie') {
      if (
        isWatchedMovie === 'false'
        ) {
          console.log('here 1');
          addtoWatchedProfile(
            moment(),
            moment(),
            user.user._id,
            movieId,
            title,
            duration,
            time,
            user.currentProfile._id
            )(dispatch);
          } else {
            console.log('here 2');
            updateWatchedProfile(
              moment(),
              user.user._id,
              movieId,
              title,
              duration,
              time,
              user.currentProfile._id
              )(dispatch);
            }
          } 
        } 

        
  };
  
/*   const getSeries = useCallback(async () => {
    const responseSeries = await FliikaApi.get(`/posts/`);
    setSeries(responseSeries.data);
  }, []);
  useEffect(() => {
    getSeries();
  }, []); */
  let currentSeries = movies.availableMovies.filter((r) => r.title == seriesTitle);

  let totalSeasons;
  try {
    totalSeasons = currentSeries.map((r) => r.season_number);
  } catch (err) {}
  const seasons = [...new Set(totalSeasons)];
  let seasonsLength;
  try {
    seasonsLength = seasons.length;
  } catch (err) {}
  useEffect(() => {
    if (currentSeries.length > 0) {
      setSeason(currentSeries.filter((e) => e.season_number == seasonNumber));
    }
  }, [series.length, seasonNumber]);
  useEffect(() => {
    setSeasonNumber(seasons[0]);
  }, [seasonsLength]);
  let resultLength;
  try {
    resultLength = Object.keys(movie).length;
  } catch (err) {}
  
  useEffect(() => {
    setMovieTitle(season[0])(dispatch);
    setCurrentSeries(season)(dispatch);
  }, [season]);
  //const movieId = navigation.getParam("selectedMovie");
  ///// share function
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "Join Fliika Movies App and enjoy the best African blockbuster movies.",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  ///// enf of share function
  const logOut = async () => {
    try {
      await firebase.auth().signOut();
      navigation.navigate(WELCOMESCREEN);
    } catch (err) {
      Alert.alert(
        "There is something wrong! Please try again later",
        err.message
      );
    }
  };
  ///// Render Header Function
  const renderHeaderBar = () => {
    const navigateBack = () => {
      navigation.goBack();
    };
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: Platform.OS == "ios" ? 40 : 40,
          paddingHorizontal: SIZES.padding,
        }}
      >
        {/* Back Button */}
        <MovieDetailIcon iconFuc={navigateBack} icon={icons.left_arrow} />
        {/* Share Button */}
        <MovieDetailIcon iconFuc={() => logOut()} icon={icons.cast} />
      </View>
    );
  };
  const renderHeaderSection = () => {
    let thumbnail;
    try {
      thumbnail = isSeries === 'series' ? season[0].dvd_thumbnail_link : currentMovie.dvd_thumbnail_link;
    } catch (err) {}
    return (
      <ImageBackground
        source={{ uri: thumbnail }}
        resizeMode="cover"
        style={{
          width: "100%",
          height: SIZES.height < 700 ? SIZES.height * 0.6 : SIZES.height * 0.7,
        }}
      >
        <View>{renderHeaderBar()}</View>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={["transparent", "#000"]}
            style={{
              width: "100%",
              height: 150,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Animatable.View
                animation="pulse"
                iterationCount={"infinite"}
                direction="alternate"
              >
                {isSeries == "movie" ? (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate(BITMOVINPLAYER, {movieId: currentMovie._id, time: null});
                    }}
                  >
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: 100,
                      height: 100,
                      borderRadius: 60,
                      backgroundColor: COLORS.transparentWhite,
                      alignSelf: "flex-start",
                      marginLeft: 20,
                    }}
                  >
                      <Image
                        source={icons.play}
                        resizeMode="contain"
                        style={{
                          width: 40,
                          height: 40,
                          tintColor: COLORS.white,
                        }}
                      />
                  </View>
                    </TouchableOpacity>
                ) : null}
              </Animatable.View>
              <View
                style={{
                  flexDirection: "row",
                  width: isSeries == "movie" ? "60%" : "40%",
                  justifyContent: "space-around",
                  alignSelf: "center",
                }}
              >
                {isWatchList(user.currentProfile.watchList, currentMovie.title) == true ? (
                  <TouchableOpacity
                    onPress={() => {
                      removeFromProfileWatchList(
                        user.user._id,
                        movie,
                        user.currentProfile._id
                      )(dispatch);
                    }}
                  >
                    <Icon
                      name="book-remove-multiple-outline"
                      size={40}
                      color={COLORS.white}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                  addToProfileWatchList(
                      user.user._id,
                      currentMovie,
                      user.currentProfile._id
                    )(dispatch);

                    }}
                  >
                    <IconFeather name="plus" size={40} color={COLORS.white} />
                  </TouchableOpacity>
                )}
                {isSeries == "movie" ? (
                  <IconFeather name="download" size={40} color={COLORS.white} />
                ) : null}
                <TouchableOpacity onPress={() => onShare()}>
                  <IconIon
                    name="share-social-outline"
                    size={40}
                    color={COLORS.white}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text
              style={{
                color: COLORS.white,
                textTransform: "uppercase",
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              {currentMovie.title}
            </Text>
          </LinearGradient>
        </View>
      </ImageBackground>
    );
  };
  ////////// End of Render header function

  ///////// category section
  const renderCategoty = () => {
    let genres;
    try {
      genres = currentMovie.genre.toString().replace(/,/g, " ");
    } catch (err) {}
    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: SIZES.base,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={[styles.categoryContainer, { marginLeft: 0 }]}>
          <Text style={{ color: COLORS.white }}>{currentMovie.film_rating}</Text>
        </View>
        <View
          style={[
            styles.categoryContainer,
            { paddingHorizontal: SIZES.padding },
          ]}
        >
          <Text
            style={{ color: COLORS.white, justifyContent: "space-between" }}
          >
            {genres}
          </Text>
        </View>
        <View style={[styles.categoryContainer]}>
          <Text
            style={{ color: COLORS.white, justifyContent: "space-between" }}
          >
            {currentMovie.runtime}
          </Text>
        </View>
      </View>
    );
  };
  ///////// end of categoy section
  /////////// render movie details
  function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  }
  //console.log(msToTime(10231));
  const [selectSeason, setSelectSeason] = useState(false);
  const openFilter = () => {
    setSelectSeason(true);
  };
  const closeFilter = () => {
    setSelectSeason(false);
  };
  const renderMovieDetails = () => {
    return (
      <View
        style={{
          flex: 1,
          marginTop: SIZES.padding,
          justifyContent: "space-around",
        }}
      >
        {/* titme, running time and progress bar */}
        <View>
          <View style={{ flexDirection: "row" }}></View>
        </View>
        {/* watch */}

        {isSeries == "movie" ? (
          <>
            <View style={{ width: "100%", paddingHorizontal: 20 }}>
              <Text style={{ color: COLORS.white, textAlign: "justify" }}>
                {currentMovie.storyline}
              </Text>
            </View>
            <View>
              <Text style={styles.titleText}>Genres</Text>
              <Text style={styles.detailText}>
                {currentMovie.genre.toString().replace(/,/g, ", ")}
              </Text>
              <Text style={styles.titleText}>Directors</Text>
              <Text style={styles.detailText}>
                {currentMovie.directors.toString().replace(/,/g, ", ")}
              </Text>
              <Text style={styles.titleText}>Starring</Text>
              <Text style={styles.detailText}>
                {currentMovie.cast.toString().replace(/,/g, ", ")}
              </Text>
              <Text style={styles.titleText}>Content Advisory</Text>
              <Text style={styles.detailText}>
                {currentMovie.content_advisory.toString().replace(/,/g, ", ")}
              </Text>
              <Text style={styles.titleText}>Languages</Text>
              <Text style={styles.detailText}>
                {currentMovie.languages.toString().replace(/,/g, ", ")}
              </Text>
              <Text style={styles.titleText}>Subtitles</Text>
              <Text style={styles.detailText}>
                {currentMovie.subtitles.toString().replace(/,/g, ", ")}
              </Text>
            </View>
          </>
        ) : null}
      </View>
    );
  };

  const playSeries = (serie) => {
    setSeriesEpisode(serie);
    setPlay(true);
  };
  // to fix later for series

  if (isSeries == "series") {
    return !seasonNumber ? (
      <ActivityIndicator
        animating
        color={"teal"}
        size="large"
        style={{ flex: 1, position: "absolute", top: "50%", left: "45%" }}
      />
    ) : (
      <ScrollView style={{ flexGrow: 1 }}>
        {renderHeaderSection()}
        {renderMovieDetails()}
        {play ? (
          <View
            style={{ width: SIZES.width * 0.9, height: SIZES.height * 0.5 }}
          >
          </View>
        ) : null}
        {isSeries == "series" ? (
          <View style={{ alignSelf: "center" }}>
            <Menu
              visible={selectSeason}
              onPress={openFilter}
              onDismiss={closeFilter}
              anchor={
                <TouchableOpacity
                  style={{
                    width: 120,
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: 50,
                  }}
                  onPress={openFilter}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    {`Season ${seasonNumber}`}
                  </Text>
                </TouchableOpacity>
              }
            >
              {seasons.map((season) => {
                return (
                  <Menu.Item
                    style={{
                      width: 120,
                    }}
                    key={season}
                    onPress={() => {
                      setSeasonNumber(season), closeFilter();
                    }}
                    title={`Season ${season}`}
                  />
                );
              })}
            </Menu>
          </View>
        ) : null}

        <Tab.Navigator
          tabBarOptions={{
            labelStyle: { color: "white" },
            style: {
              backgroundColor: "black",
            },
          }}
        >
          <Tab.Screen
            name={SERIESEPISODESTAB}
            component={SeriesEpisodesTab}
            initialParams={{ playSeries: playSeries }}
          />
          <Tab.Screen name={SERIESDETAILSTAB} component={SeriesDetailsTab} />
        </Tab.Navigator>
      </ScrollView>
    );
  }
  ////////// end of render movie details
  return (
    <View style={styles.container}>
        <ScrollView>
          {renderHeaderSection()}
          {renderCategoty()}
          {renderMovieDetails()}
        </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  video: {
    width: SIZES.width * 0.9,
    height: SIZES.height * 0.5,
  },
  icons: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 60,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: SIZES.base,
    paddingHorizontal: SIZES.base,
    paddingVertical: 3,
    borderRadius: SIZES.base,
    backgroundColor: COLORS.gray1,
  },
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

export default MovieDetailScreen;
