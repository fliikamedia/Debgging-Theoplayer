import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  AppState,
  Animated,
  Image,
} from "react-native";
import { COLORS, SIZES, icons } from "../../constants";
import { BITMOVINPLAYER, MOVIEDETAIL } from "../../constants/RouteNames";
import firebase from "firebase";
import Carousel from "react-native-snap-carousel";
import LinearGradient from "react-native-linear-gradient";
import { fetchMovies } from "../../store/actions/movies";
import { useDispatch, useSelector } from "react-redux";
import {
  addtoWatchedProfile,
  updateWatchedProfile,
  addToProfileWatchList,
  removeFromProfileWatchList,
  deleteFromWatched,
  getUser,
  changeProfileNew,
} from "../../store/actions/user";
import ProgressBar from "../components/ProgressBar";
import { LogBox } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconAwesome from "react-native-vector-icons/FontAwesome5";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import RecycleView from "../components/RecycleView";
import NetInfo from "@react-native-community/netinfo";
import FastImage from "react-native-fast-image";
import IconAnt from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-community/async-storage";
import Orientation from "react-native-orientation";
import Video, { currentPlaybackTime } from "react-native-video";
import IonIcon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import RBSheet from "react-native-raw-bottom-sheet";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import RbSheetSeasonItem from "../components/RbSheetSeasonItem";
import RbSheetMovieItem from "../components/RbSheetMovieItem";

const HomeScreen = ({ navigation }) => {
  const appState = useRef(AppState.currentState);
  const refRBSheet = useRef(null);
  const refRBSheetMovies = useRef(null);

  //LogBox.ignoreAllLogs();
  //LogBox.ignoreLogs(["Calling `getNode()`"]);
  const user = useSelector((state) => state.user);
  const movies = useSelector((state) => state.movies);
  // console.log("fetching", user.profileName);

  const dispatch = useDispatch();
  const [result, setResult] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [profiled, setProfiled] = useState("");
  const [connected, setConnected] = useState(null);
  const videoRef = React.useRef(null);
  const [isPreloading, setIsPreloading] = useState(true);
  const [scrolledY, setScrolledY] = useState(0);
  const [videoPaused, setVideoPaused] = useState(false);
  const [videoMute, setVideoMute] = useState(true);
  const [rbTitle, setRbTitle] = useState({});
  const [rbItem, setRbItem] = useState({});
  const [seasonNumber, setSeasonNumber] = useState(null);
  const [squareMovie, setSquareMovie] = useState({});

  const yOffset = useRef(new Animated.Value(0)).current;
  const headerOpacity = yOffset.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 0.8],
    extrapolate: "clamp",
  });

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        opacity: 1,
      },
      headerBackground: () => (
        <Animated.View
          style={{
            backgroundColor: "black",
            ...StyleSheet.absoluteFillObject,
            opacity: headerOpacity,
          }}
        />
      ),
      headerTransparent: true,
    });
  }, [headerOpacity, navigation]);
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      //console.log('Leaving Home Screen');
      setVideoPaused(true);
    });

    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      // getUser(user.email, user.authToken)(dispatch);
      changeProfileNew(
        user.email,
        user.currentProfile._id,
        navigation,
        false
      )(dispatch);
      setVideoPaused(false);
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

  const handleScroll = (event) => {
    if (event.nativeEvent.contentOffset.y > SIZES.width) {
      setVideoPaused(true);
    } else {
      setVideoPaused(false);
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      //console.log("Connection type", state.type);
      //console.log("Is connected?", state.isConnected);
      setConnected(state.isConnected);
    });

    // Unsubscribe
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    fetchMovies()(dispatch);
  }, []);

  // Get all watched movies
  // let allWatchedMovies = [];
  // for (let i = 0; i < user?.allUsers?.length; i++) {
  //   for (let c = 0; c < user?.allUsers[i]?.profiles?.length; c++) {
  //   allWatchedMovies.push(...user.allUsers[i].profiles[c].watched)
  //   }
  // }

  //   const allTitles = user.allWatchedMovies.map(r => r.title);
  //   const watchedMovies = user.allWatchedMovies.reduce((acc, cur)=> {
  //     const title = cur.title;
  //     if (acc[title]) {
  //          acc[title]++;
  //     } else {
  //          acc[title] = 1;
  //     }
  //     return acc;
  // }, {});
  //   console.log('mooovies',watchedMovies);
  // check if the movie is already in watch List
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
    //console.log('saving movie',duration,time, title, isWatchedMovie, seasonNumber, episodeNumber);
    // console.log('iswatched',   isWatched(user.currentProfile.watched, title));
    //console.log('profileId',profileId);
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
  const resultsToShow = movies.availableMovies.filter(
    (c) => c.dvd_thumbnail_link != ""
    // c.film_type == "movie" ||
    // (c.film_type == "series" && c.season_number == 1 && c.episode_number == 1
  );
  const genreArray = resultsToShow.map((r) => r.genre);
  let allGenre = [];
  for (let i = 0; i < genreArray.length; i++) {
    allGenre.push(...genreArray[i]);
  }
  let allGenreTrimmed = [];
  for (let i = 0; i < allGenre.length; i++) {
    allGenreTrimmed.push(allGenre[i].trim());
  }
  const genres = [...new Set(allGenreTrimmed)];
  let newResults = [];
  for (let x = 0; x < genres.length; x++) {
    newResults.push({
      genre: genres[x],
      movies: resultsToShow.filter((r) => r.genre.includes(genres[x])),
    });
  }

  const squareVideo = () => {
    // SquareURL to be optimized when other trailers added
    let squareURL;
    let squareLogo;
    let squarePlayId;
    let squareMovie;
    try {
      squareURL = resultsToShow.find(
        (r) => r.active_banner === "YES"
      ).square_mobile_trailer;
      squareLogo = resultsToShow.find(
        (r) => r.active_banner === "YES"
      ).title_logo_url;
      squarePlayId = resultsToShow.find((r) => r.active_banner === "YES")._id;
      squareMovie = resultsToShow.find((r) => r.active_banner === "YES");
    } catch (err) {
      squareURL =
        "https://fliikamediaservice-usea.streaming.media.azure.net/1368c5bc-1fb8-450f-ba54-104e021b4033/Batman_mobile_square.ism/manifest(format=m3u8-aapl)";
    }

    return (
      <View
        style={{
          width: SIZES.width,
          height: SIZES.width,
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Video
          onReadyForDisplay={() => setIsPreloading(false)}
          paused={videoPaused}
          ref={videoRef}
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
          source={{
            uri: squareURL,
          }}
          repeat={true}
          shouldPlay
          resizeMode="cover"
          rate={1.0}
          muted={videoMute}
          preventsDisplaySleepDuringVideoPlayback={true}
        />
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={["transparent", "#000"]}
        >
          <View
            style={{
              height: 100,
              width: SIZES.width,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: SIZES.width - 30,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <FastImage
                style={{ width: SIZES.width / 2.1, aspectRatio: 16 / 9 }}
                source={{ uri: squareLogo }}
              />
              <View
                style={{
                  flexDirection: "row",
                  width: "45%",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(MOVIEDETAIL, {
                      selectedMovie: squareMovie._id,
                      isSeries: squareMovie.film_type,
                      seriesTitle: squareMovie.name,
                    });
                  }}
                  style={{
                    margin: -5,
                    padding: 4,
                    borderRadius: 100,
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 25,
                    borderWidth: 1,
                    borderColor: "white",
                  }}
                >
                  <IonIcon name="information" size={18} color="white" />
                </TouchableOpacity>

                {videoMute ? (
                  <TouchableOpacity
                    onPress={() => setVideoMute(false)}
                    style={{
                      padding: 4,
                      borderRadius: 100,
                      justifyContent: "center",
                      alignItems: "center",
                      elevation: 25,
                      borderWidth: 1,
                      borderColor: "white",
                    }}
                  >
                    <IonIcon name="volume-mute" size={17} color="white" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => setVideoMute(true)}
                    style={{
                      padding: 4,
                      borderRadius: 100,
                      justifyContent: "center",
                      alignItems: "center",
                      elevation: 25,
                      borderWidth: 1,
                      borderColor: "white",
                    }}
                  >
                    <IonIcon name="volume-high" size={17} color="white" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(BITMOVINPLAYER, {
                      movieId: squarePlayId,
                    });
                  }}
                  style={{
                    padding: 16,
                    borderRadius: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 25,
                    borderWidth: 2,
                    borderColor: "teal",
                  }}
                >
                  <IconAwesome
                    name="play"
                    size={20}
                    color="#B0E0E6"
                    style={{ marginLeft: 4 }}
                  />
                  {/*             <IconAwesome
                    name="play"
                    size={20}
                    color="#B0E0E6"
                  /> */}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };
  ///////////////
  let resultLength;
  let stateLength;
  try {
    resultLength = result.length;
    stateLength = user.user.length;
  } catch (err) {}
  const renderMovies = () => {
    const renderItem = ({ item, index }) => {
      if (item.dvd_thumbnail_link) {
        return (
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate(MOVIEDETAIL, {
                selectedMovie: item._id,
                isSeries: item.film_type,
                seriesTitle: item.title,
              });
            }}
          >
            <FastImage
              style={{
                width: SIZES.width * 0.3,
                height: SIZES.width * 0.45,
                borderRadius: 20,
                marginHorizontal: 5,
                resizeMode: "contain",
              }}
              source={{ uri: item.dvd_thumbnail_link }}
            />
          </TouchableWithoutFeedback>
        );
      }
    };

    const keyextractor = (item) => item._id.toString();
    return newResults.map((item, index) => {
      return (
        <View key={index}>
          <RecycleView
            title={item.genre}
            navigation={navigation}
            index={index}
            movie={index % 2 == 0 ? item.movies : item.movies.reverse()}
            from={"Home"}
          />
        </View>
      );
    });
  };

  //// Render continue watching section
  let continueWatching = [];

  try {
    for (let i = 0; i < user.currentProfile.watched.length; i++) {
      movies.availableMovies.map((r) => {
        if (r.film_type === "movie") {
          if (r._id == user.currentProfile.watched[i].movieId) {
            continueWatching.push({
              type: r.film_type,
              _id: r._id,
              title: r.title,
              image: r.dvd_thumbnail_link,
              time: user.currentProfile.watched[i].watchedAt,
              movieTime: r.runtime,
              created: moment(user.currentProfile.watched[i].created).unix(),
              updated: moment(user.currentProfile.watched[i].updated).unix(),
            });
          }
        } else {
          if (r._id == user.currentProfile.watched[i].movieId) {
            continueWatching.push({
              type: r.film_type,
              _id: r._id,
              title: r.title,
              image: r.dvd_thumbnail_link,
              time: user.currentProfile.watched[i].watchedAt,
              movieTime: r.runtime,
              season: r.season_number,
              episode: r.episode_number,
              created: moment(user.currentProfile.watched[i].created).unix(),
              updated: moment(user.currentProfile.watched[i].updated).unix(),
            });
          }
        }
      });
    }
  } catch (err) {}

  try {
    for (let i = 0; i < continueWatching.length; i++) {
      if (!continueWatching[i].image) {
        continueWatching[i].image = movies.availableMovies.find(
          (r) =>
            r.title === continueWatching[i].title &&
            r.season_number === continueWatching[i].season &&
            r.dvd_thumbnail_link
        ).dvd_thumbnail_link;
      }
    }
  } catch (err) {}
  let sortedWatched = continueWatching.sort((a, b) => {
    if (a.title < b.title) return -1;
    return 1;
  });

  let byOnlyLastEpisode = [];
  for (let i = 0; i < sortedWatched.length; i++) {
    if (!sortedWatched[i].season) {
      byOnlyLastEpisode.push(sortedWatched[i]);
    } else {
      if (sortedWatched[i].title === sortedWatched[i - 1]?.title) {
        if (sortedWatched[i]?.season === sortedWatched[i - 1]?.season) {
          if (sortedWatched[i]?.episode > sortedWatched[i - 1]?.episode) {
            byOnlyLastEpisode.pop();
            byOnlyLastEpisode.push(sortedWatched[i]);
          }
        } else if (sortedWatched[i]?.season > sortedWatched[i - 1]?.season) {
          byOnlyLastEpisode.pop();
          byOnlyLastEpisode.push(sortedWatched[i]);
        }
      } else {
        byOnlyLastEpisode.push(sortedWatched[i]);
      }
      //console.log(continueWatching[i].episode > continueWatching[i - 1]?.episode);
      //console.log(continueWatching[i].title === continueWatching[i - 1]?.title &&continueWatching[i].season >continueWatching[i - 1]?.season &&continueWatching[i].episode > continueWatching[i - 1]?.episode);
    }
  }

  // let continueWatchingToShow = [];

  // for (let x = 0; x < continueWatching.length; x++) {
  //   for (let c = 0; c <byOnlyLastEpisode.length; c++) {
  //     if (continueWatching[x]._id === byEpisode[c]._id) {
  //       continueWatchingToShow.push(continueWatching[x])
  //     }
  //   }
  // }
  byOnlyLastEpisode.sort((a, b) => b.updated - a.updated).map((r) => r.title);

  let continueWatchingLength;
  try {
    continueWatchingLength = continueWatching.length;
  } catch (err) {}
  const calculateProgress = (id) => {
    try {
      var duration = user.currentProfile.watched.find(
        (c) => c.movieId == id
      ).duration;
      var watchedAt = user.currentProfile.watched.find(
        (c) => c.movieId == id
      ).watchedAt;
    } catch (err) {}
    return (watchedAt / duration) * 100;
  };

  //console.log(continueWatching);
  const renderContinueWatctionSection = () => {
    return (
      <View style={{ marginBottom: 20 }}>
        {/* Header */}
        {continueWatchingLength > 0 ? (
          <View
            style={{
              flexDirection: "row",
              //paddingHorizontal: SIZES.padding,
              marginLeft: 15,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                flex: 1,
                color: COLORS.white,
                fontSize: 20,
                fontFamily: "Sora-Bold",
              }}
            >
              Continue watching
            </Text>
            <Image
              source={icons.right_arrow}
              style={{ height: 20, width: 20, tintColor: "teal" }}
            />
          </View>
        ) : null}
        {/* List */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginTop: SIZES.padding }}
          data={byOnlyLastEpisode}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => {
            if (calculateProgress(item._id) < 100) {
              return (
                <TouchableWithoutFeedback
                  onLongPress={() => {
                    refRBSheet.current.open(),
                      setRbTitle({
                        type: item.type,
                        title: item.title,
                        id: item._id,
                      });
                  }}
                  onPress={() => {
                    navigation.navigate(BITMOVINPLAYER, {
                      movieId: item._id,
                      time: item.time,
                    });
                  }}
                >
                  <View
                    style={{
                      marginLeft: index == 0 ? 15 : 20,
                      marginRight:
                        index == byOnlyLastEpisode.length - 1
                          ? SIZES.padding
                          : 0,
                    }}
                  >
                    {/* Thumnnail */}
                    <View
                      style={{
                        width: SIZES.width * 0.27,
                        height: SIZES.width * 0.35,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FastImage
                        source={{ uri: item.image }}
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          right: 0,
                          left: 0,
                          resizeMode: "cover",
                          borderRadius: 5,
                        }}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={{
                          padding: 14,
                          borderRadius: 40,
                          justifyContent: "center",
                          alignItems: "center",
                          elevation: 25,
                          borderWidth: 2,
                          borderColor: "#fff",
                        }}
                        onLongPress={() => {
                          refRBSheet.current.open(),
                            setRbTitle({
                              type: item.type,
                              title: item.title,
                              id: item._id,
                            });
                        }}
                        onPress={() => {
                          navigation.navigate(BITMOVINPLAYER, {
                            movieId: item._id,
                            time: item.time,
                          });
                        }}
                      >
                        <IconAwesome
                          name="play"
                          size={20}
                          color="#B0E0E6"
                          style={{ marginLeft: 4 }}
                        />
                      </TouchableOpacity>

                      {/* Name */}
                    </View>
                    <View style={{ width: SIZES.width * 0.27 }}>
                      <Text
                        style={{
                          color: COLORS.white,
                          marginTop: SIZES.base,
                          textAlign: "center",
                          fontFamily: "Sora-Regular",
                        }}
                        numberOfLines={1}
                      >
                        {item.season
                          ? `S${item.season} - E${item.episode}`
                          : item.title}
                      </Text>
                      {/*  <Text
                      style={{
                        color: COLORS.white,
                        marginTop: SIZES.base,
                        textAlign: "center",
                        fontFamily: 'Sora-Regular',
                      }}
                      numberOfLines={1}
                    >
                      {item.season ? `S${item.season} - E${item.episode}` :item.movieTime}
                    </Text> */}
                      {/* Progress Bar */}
                      <ProgressBar
                        containerStyle={{ marginTop: SIZES.radius }}
                        barStyle={{ height: 3 }}
                        percentage={calculateProgress(item._id)}
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              );
            }
          }}
        />
      </View>
    );
  };
  //// End of continue watching section
  //// Render Hero third design
  const title = resultsToShow.length > 0 ? resultsToShow[0].title : null;
  const uri =
    resultsToShow.length > 0 ? resultsToShow[0].dvd_thumbnail_link : null;
  const stat =
    resultsToShow.length > 0
      ? `${resultsToShow[0].film_rating} - ${resultsToShow[0].genre
          .toString()
          .replace(/,/g, " ")} - ${resultsToShow[0].runtime}`
      : null;
  const desc = resultsToShow.length > 0 ? resultsToShow[0].storyline : null;
  const _id = resultsToShow.length > 0 ? resultsToShow[0]._id : null;
  const film_type =
    resultsToShow.length > 0 ? resultsToShow[0].film_type : null;
  const [background, setBackground] = useState({
    uri: "",
    name: "",
    stat: "",
    desc: "",
    _id: "",
    film_type: "",
  });

  useEffect(() => {
    if (resultsToShow) {
      setBackground({
        uri: uri,
        name: title,
        stat: stat,
        desc: desc,
        _id: _id,
        film_type: film_type,
      });
    }
  }, [resultsToShow.length]);
  const carouselRef = useRef(null);
  const renderHeroSectionThirdDesign = () => {
    const renderItem = ({ item, index }) => {
      if (item?.dvd_thumbnail_link) {
        return (
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(MOVIEDETAIL, {
                  selectedMovie: item._id,
                  isSeries: item.film_type,
                  seriesTitle: item.title,
                });
              }}
            >
              <FastImage
                source={{ uri: item.dvd_thumbnail_link }}
                style={styles.carouselImage}
              />
              {/*<Text style={styles.carouselText}>{item.title}</Text>*/}
              {isWatchList(user.currentProfile.watchList, item.title) ==
              true ? (
                <TouchableWithoutFeedback
                  onPress={() => {
                    showToast("Removed from watch list");
                    removeFromProfileWatchList(
                      user.user._id,
                      item,
                      user.currentProfile._id,
                      item.season_number
                    )(dispatch);
                  }}
                >
                  <Icon
                    name="book-remove-multiple-outline"
                    size={30}
                    color={COLORS.white}
                    style={styles.carouselIcon}
                  />
                </TouchableWithoutFeedback>
              ) : (
                <TouchableWithoutFeedback
                  onPress={() => {
                    showToast("Added to watch list");
                    addToProfileWatchList(
                      user.user._id,
                      item,
                      user.currentProfile._id,
                      item.season_number,
                      moment()
                    )(dispatch);
                  }}
                >
                  <IconMaterial
                    name="library-add"
                    size={30}
                    color="white"
                    style={styles.carouselIcon}
                  />
                </TouchableWithoutFeedback>
              )}

              <TouchableOpacity
                onPress={() => {
                  setRbItem(item), openRBSheet();
                }}
                style={styles.carouselIconInfo}
              >
                <IconMaterial name="more-vert" size={30} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        );
      }
    };

    return (
      <View style={styles.carouselContentContainer}>
        <ImageBackground
          source={{ uri: background?.uri }}
          style={styles.ImageBg}
          blurRadius={10}
          resizeMode="cover"
        >
          <LinearGradient
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            colors={["transparent", "#000"]}
          >
            <View style={{ height: 60, width: "100%" }}></View>
          </LinearGradient>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={["transparent", "#000"]}
          >
            <Text
              style={{
                color: "white",
                fontSize: 24,
                marginLeft: 15,
                marginTop: 40,
                marginBottom: 20,
                fontFamily: "Sora-Bold",
              }}
            >
              Fliika Originals
            </Text>
            <View style={styles.carouselContainerView}>
              <Carousel
                style={styles.carousel}
                data={resultsToShow}
                renderItem={renderItem}
                itemWidth={SIZES.width * 0.586}
                sliderWidth={SIZES.width * 1.274}
                containerWidth={SIZES.width - 20}
                separatorWidth={0}
                ref={carouselRef}
                inActiveOpacity={0.4}
                loop={true}
                inactiveSlideOpacity={0.7}
                inactiveSlideScale={0.9}
                // activeAnimationType={'spring'}
                // activeAnimationOptions={{
                //     friction: 4,
                //     tension: 5
                // }}
                enableMomentum={true}
                onSnapToItem={(index) => {
                  setBackground({
                    uri: resultsToShow[index]?.dvd_thumbnail_link,
                    name: resultsToShow[index]?.title,
                    stat: `${
                      resultsToShow[index]?.film_rating
                    } - ${resultsToShow[index]?.genre
                      .toString()
                      .replace(/,/g, " ")} - ${resultsToShow[index]?.runtime}`,
                    desc: resultsToShow[index]?.storyline,
                    _id: resultsToShow[index]?._id,
                    film_type: resultsToShow[index]?.film_type,
                  });
                }}
              />
            </View>
            <View style={styles.movieInfoContainer}>
              <View
                style={{
                  justifyContent: "center",
                  maxWidth: SIZES.width / 1.5,
                }}
              >
                <Text style={styles.movieName}>{background.name}</Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(MOVIEDETAIL, {
                      selectedMovie: background._id,
                      isSeries: background.film_type,
                      seriesTitle: background.name,
                    });
                  }}
                  style={styles.playIconContainer}
                >
                  <IconAwesome
                    name="play"
                    size={22}
                    color="#02ad94"
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.movieStat}>{background.stat}</Text>
            <View style={{ paddingHorizontal: 14, marginTop: 14 }}>
              <Text
                numberOfLines={4}
                style={{
                  color: "white",
                  opacity: 0.8,
                  lineHeight: 20,
                  marginBottom: 20,
                  fontFamily: "Sora-Regular",
                }}
              >
                {background.desc}
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  };
  ///// End of Render Hero third design

  //// Botton sheet Continue Watching
  const renderBotomSheet = () => {
    return (
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: "#fff",
          },
          container: {
            backgroundColor: "rgba(0,0,0, 0.8)",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 0.6,
            borderColor: "grey",
          },
        }}
      >
        <View
          style={{
            flex: 1,
            paddingLeft: 20,
            paddingBottom: 20,
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/*    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
    <IconAnt name="closecircleo" size={30} color="#fff"/>
      </View> */}
          <Text
            style={{
              color: "#fff",
              fontSize: 25,
              fontFamily: "Sora-Bold",
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            {rbTitle.title}
          </Text>
          <View
            style={{
              height: "40%",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => {
                refRBSheet.current.close(),
                  navigation.navigate(MOVIEDETAIL, {
                    selectedMovie: rbTitle.id,
                    isSeries: rbTitle.type,
                    seriesTitle: rbTitle.title,
                  });
              }}
            >
              <IconAnt name="infocirlceo" size={30} color="#fff" />
              <Text
                style={{
                  fontFamily: "Sora-Regular",
                  color: "#fff",
                  fontSize: 20,
                  marginLeft: 10,
                }}
              >
                Go to details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => {
                refRBSheet.current.close(),
                  deleteFromWatched(
                    user.user._id,
                    user.currentProfile._id,
                    rbTitle.id,
                    rbTitle.type,
                    rbTitle.title
                  )(dispatch);
              }}
            >
              <IconAnt name="delete" size={30} color="#fff" />
              <Text
                style={{
                  fontFamily: "Sora-Regular",
                  color: "#fff",
                  fontSize: 20,
                  marginLeft: 10,
                }}
              >
                Remove from list
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    );
  };
  //// End of Bootom Sheet Continue Watching

  /// Bottom Sheet movies

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
      // if (seasons?.length > 1) {
      //   rbHeight = SIZES.height * 0.5;
      // } else {
      //   rbHeight = SIZES.height * 0.3;
      // }
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
              from="home"
            />
          )}
        </ScrollView>
      </RBSheet>
    );
  };
  /// End of bottom sheet movies
  //// On Refresh Control
  const onRefresh = useCallback(() => {
    //setRefreshing(true);
    fetchMovies()(dispatch);
    getUser(user.email, user.authToken)(dispatch);
  }, []);
  //////////////////
  return (
    <View style={styles.container}>
      {!background.uri || movies.isFetching ? (
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <ActivityIndicator
            animating
            color={"teal"}
            size="large"
            style={{ flex: 1, position: "absolute", top: "50%", left: "45%" }}
          />
        </View>
      ) : (
        <Animated.ScrollView
          onScroll={(nativeEvent) => {
            yOffset.setValue(nativeEvent.nativeEvent.contentOffset.y);
            handleScroll(nativeEvent);
          }}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
        >
          {squareVideo()}
          {renderHeroSectionThirdDesign()}
          {continueWatchingLength > 0 ? renderContinueWatctionSection() : null}
          {renderMovies()}
          {renderBotomSheet()}
          {renderBottomSheetMovies()}
        </Animated.ScrollView>
      )}
      <Toast config={toastConfig} />
    </View>
  );
};

// HomeScreen.navigationOptions = () => {
//   return {
//     HeaderTitle: "Fliika",
//     headerRight: (
//       <Text>Hello</Text>
//     )
//   }
// }
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: -1,
  },
  location: {
    fontSize: 16,
  },
  date: {
    fontSize: 12,
  },
  itemContainer: {
    height: 70,
    padding: 10 * 2,
  },
  itemContainerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overflowContainer: {
    height: 70,
    overflow: "hidden",
  },
  containers: {
    flex: 1,
    justifyContent: "center",
    height: SIZES.height * 0.6,
  },
  carouselImage: {
    width: SIZES.width * 0.59,
    height: SIZES.height * 0.45,
    borderRadius: 10,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  carouselText: {
    paddingLeft: 14,
    color: "white",
    position: "absolute",
    bottom: 10,
    left: 2,
    fontWeight: "bold",
  },
  carouselIcon: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  carouselContentContainer: {
    flex: 1,
    backgroundColor: "#000",
    //height: SIZES.height * .85,
  },
  ImageBg: {
    flex: 1,
    opacity: 1,
    justifyContent: "flex-start",
  },
  carouselContainerView: {
    width: "100%",
    height: SIZES.height * 0.45,
    justifyContent: "center",
    alignItems: "center",
  },
  carousel: {
    flex: 1,
    overflow: "visible",
  },
  movieInfoContainer: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-between",
    width: SIZES.width - 14,
  },
  movieName: {
    paddingLeft: 14,
    color: "white",
    fontFamily: "Sora-Bold",
    fontSize: 20,
    marginBottom: 6,
  },
  movieStat: {
    paddingLeft: 14,
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    opacity: 0.8,
  },
  playIconContainer: {
    backgroundColor: "#212121",
    padding: 18,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 25,
    borderWidth: 4,
    borderColor: "rgba(2, 173, 148, 0.2)",
    marginBottom: 14,
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

export default HomeScreen;
