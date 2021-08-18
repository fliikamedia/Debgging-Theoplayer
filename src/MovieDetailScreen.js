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
  addtoWatched,
  updateWatched,
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

const MovieDetailScreen = ({ navigation, route }) => {
  const Tab = createMaterialTopTabNavigator();

  const user = useSelector((state) => state.user);
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

  const getMovie = useCallback(async () => {
    const response = await FliikaApi.get(`/posts/${selectedMovie}`);
    setMovie(response.data);
  }, []);
  useEffect(() => {
    getMovie();
  }, []);

  const showEpisodes = () => {
    setEpisodes(true);
    setDetails(false);
  };

  const showDetails = () => {
    setEpisodes(false);
    setDetails(true);
  };

  const saveOnLeavingPage = () => {
    setIsPlaying(false);
    saveMovie();
  };
  /*
  useEffect(() => {
    AppState.addEventListener("change", saveOnLeavingPage());

    return () => {
      AppState.removeEventListener("change", saveOnLeavingPage());
    };
  }, []);
  */
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
  const watchListFunc = () => {
    try {
      if (user.isProfile) {
        return user.profile.watchList;
      } else {
        return user.user.watchList;
      }
    } catch (err) {}
  };
  // console.log(isWatched(user.user.watched, movie.title));
  //console.log(isWatched(user.user.watched, movie.title));
  useEffect(() => {
    saveMovie();
  }, [isPlaying]);
  const saveMovie = () => {
    if (
      !user.isProfile &&
      watched &&
      !isPlaying &&
      isWatched(user.user.watched, movie.title) == true
    ) {
      updateWatched(user.email, movie, duration, watched)(dispatch);
    } else if (
      !user.isProfile &&
      watched &&
      !isPlaying &&
      isWatched(user.user.watched, movie.title) == false
    ) {
      addtoWatched(user.email, movie, duration, watched)(dispatch);
    } else if (
      user.isProfile &&
      watched &&
      !isPlaying &&
      isWatched(user.profile.watched, movie.title) == false
    ) {
      addtoWatchedProfile(
        user.email,
        movie,
        duration,
        watched,
        user.profileName
      )(dispatch);
    } else if (
      user.isProfile &&
      watched &&
      !isPlaying &&
      isWatched(user.profile.watched, movie.title) == true
    ) {
      updateWatchedProfile(
        user.email,
        movie,
        duration,
        watched,
        user.profileName
      )(dispatch);
    }
  };
  /*
  const addToWatchList = () => {
    axios
      .put("http://74264b614e9b.ngrok.io/users", {
        email: "testingNew1@test.com",
        newMovie: { title: movie.title },
      })
      .then(
        (response) => {
          //console.log(response.data);
        },
        (error) => {
          console.log(error);
        }
      );
    fetch("http://526d7ed1513e.ngrok.io/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        useQueryString: true,
      },
      body: JSON.stringify({
        email: "testingNew@test.com",
        newMovie: { title: "BATMAN", watchedAt: watched },
      }),
      params: {
        language_code: "en",
      },
    })
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    };
    */
  const getSeries = useCallback(async () => {
    const responseSeries = await FliikaApi.get(`/posts/`);
    setSeries(responseSeries.data);
  }, []);
  useEffect(() => {
    getSeries();
  }, []);
  let currentSeries = series.filter((r) => r.title == seriesTitle);

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
  console.log(seasonNumber);
  let resultLength;
  try {
    resultLength = Object.keys(movie).length;
  } catch (err) {}
  //console.log(series);

  useEffect(() => {
    setMovieTitle(season[0])(dispatch);
    setCurrentSeries(season)(dispatch);
  }, [movie, currentSeries, seasonNumber]);
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
          marginTop: Platform.OS == "ios" ? 20 : 40,
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
      thumbnail = season[0].dvd_thumbnail_link;
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
                      navigation.navigate(BITMOVINPLAYER, {movie: movie});
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
                {isWatchList(watchListFunc(), movie.title) == true ? (
                  <TouchableOpacity
                    onPress={() => {
                      if (user.isProfile) {
                        removeFromProfileWatchList(
                          user.email,
                          movie,
                          user.profileName
                        )(dispatch);
                      } else {
                        removeFromWatchList(user.email, movie)(dispatch);
                      }
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
                      if (user.isProfile) {
                        addToProfileWatchList(
                          user.email,
                          movie,
                          user.profileName
                        )(dispatch);
                      } else {
                        addToWatchList(user.email, movie)(dispatch);
                      }
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
            {/*isSeries == "series" ? (
              <Text
                style={{
                  color: COLORS.white,
                  textTransform: "uppercase",
                  fontSize: 12,
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                {`Season ${seasonNumber}`}
              </Text>
            ) : null*/}
            <Text
              style={{
                color: COLORS.white,
                textTransform: "uppercase",
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              {movie.title}
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
      genres = movie.genre.toString().replace(/,/g, " ");
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
          <Text style={{ color: COLORS.white }}>{movie.film_rating}</Text>
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
            {movie.runtime}
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
        {/*isSeries == "series" ? (
          <Menu
            visible={selectSeason}
            onPress={openFilter}
            onDismiss={closeFilter}
            anchor={
              <TouchableOpacity
                style={{
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  borderBottomWidth: 3,
                  borderRightWidth: 3,
                  borderLeftWidth: 3,
                  borderColor: "white",
                  marginBottom: 20,
                  width: 120,
                  alignSelf: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 10,
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
                  {"Season 1"}
                </Text>
              </TouchableOpacity>
            }
          >
            <Menu.Item key={1} title="season 1" />
            <Menu.Item key={2} title="season 2" />
            <Menu.Item key={3} title="season 3" />
            <Menu.Item key={4} title="season 4" />
          </Menu>
        ) : null*/}
        {/* watch */}

        {isSeries == "movie" ? (
          <>
            <View style={{ width: "100%", paddingHorizontal: 20 }}>
              <Text style={{ color: COLORS.white, textAlign: "justify" }}>
                {movie.storyline}
              </Text>
            </View>
            <View>
              <Text style={styles.titleText}>Genres</Text>
              <Text style={styles.detailText}>
                {movie.genre.toString().replace(/,/g, ", ")}
              </Text>
              <Text style={styles.titleText}>Directors</Text>
              <Text style={styles.detailText}>
                {movie.directors.toString().replace(/,/g, ", ")}
              </Text>
              <Text style={styles.titleText}>Starring</Text>
              <Text style={styles.detailText}>
                {movie.cast.toString().replace(/,/g, ", ")}
              </Text>
              <Text style={styles.titleText}>Content Advisory</Text>
              <Text style={styles.detailText}>
                {movie.content_advisory.toString().replace(/,/g, ", ")}
              </Text>
              <Text style={styles.titleText}>Languages</Text>
              <Text style={styles.detailText}>
                {movie.languages.toString().replace(/,/g, ", ")}
              </Text>
              <Text style={styles.titleText}>Subtitles</Text>
              <Text style={styles.detailText}>
                {movie.subtitles.toString().replace(/,/g, ", ")}
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
    <SafeAreaView style={styles.container}>
      {resultLength == 0 ? (
        <ActivityIndicator
          animating
          color={"teal"}
          size="large"
          style={{ flex: 1, position: "absolute", top: "50%", left: "45%" }}
        />
      ) : (
        <ScrollView>
          {renderHeaderSection()}
          {renderCategoty()}
          {renderMovieDetails()}
          {play ? (
            <View
              style={{ width: SIZES.width * 0.9, height: SIZES.height * 0.5 }}
            >
            </View>
          ) : null}
          {/*<Image
            style={{
              width: SIZES.width,
              height: SIZES.height * 0.7,
              resizeMode: "cover",
              opacity: 0.8,
            }}
            source={{ uri: movie.dvd_thumbnail_link }}
          />
          <View>
            <Text
              style={{
                color: COLORS.white,
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              {movie.title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                width: "60%",
                justifyContent: "space-between",
                alignSelf: "center",
                marginBottom: 10,
              }}
            >
              <Text style={{ color: "white" }}>{movie.runtime}</Text>
              <Text style={{ color: "white" }}>{movie.film_rating}</Text>
              <Text style={{ color: "white" }}>
                {parseInt(movie.release_date)}
              </Text>
              <Text style={{ color: "white" }}>{movie.video_quality}</Text>
            </View>
            <View>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignSelf: "center",
                  backgroundColor: "cadetblue",
                  width: 320,
                  height: 60,
                  borderRadius: 5,
                  paddingLeft: 10,
                }}
                onPress={() => setPlay(true)}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: COLORS.transparentWhite,
                  }}
                >
                  <Image
                    source={icons.play}
                    resizeMode="contain"
                    style={{
                      width: 15,
                      height: 15,
                      tintColor: COLORS.white,
                    }}
                  />
                </View>
                <Text
                  style={{
                    marginLeft: SIZES.base,
                    color: COLORS.white,
                    fontSize: 16,
                  }}
                >
                  Watch Now
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "80%",
                justifyContent: "space-around",
                alignSelf: "center",
                marginVertical: 20,
              }}
            >
              <View style={styles.icons}>
                <Feather name="plus" size={40} color={COLORS.white} />
              </View>
              <View style={styles.icons}>
                <Feather name="download" size={40} color={COLORS.white} />
              </View>
              <View style={styles.icons}>
                <Ionicons
                  name="share-social-outline"
                  size={40}
                  color={COLORS.white}
                />
              </View>
            </View>
            <View style={{ width: "90%", alignSelf: "center" }}>
              <Text style={{ color: COLORS.white, textAlign: "justify" }}>
                {movie.storyline}
              </Text>
            </View>
          </View>
          {play ? (
            <View
              style={{ width: SIZES.width * 0.9, height: SIZES.height * 0.5 }}
            >
              <Video
                useNativeControls
                style={styles.video}
                source={{
                  uri: `${movie.play_url}.m3u8`,
                }}
                isLooping
                resizeMode="contain"
                rate={1.0}
                volume={1}
                shouldPlay
                isMuted={false}
              />
            </View>
          ) : null}*/}
        </ScrollView>
      )}
    </SafeAreaView>
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
