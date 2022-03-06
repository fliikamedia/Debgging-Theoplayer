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
  TouchableWithoutFeedback,
} from "react-native";
import { COLORS, SIZES, FONTS, icons, images } from ".././constants";
import FliikaApi from "./api/FliikaApi";
import { baseURL } from "./api/expressApi";
import MovieDetailIcon from "./components/MovieDetailIcon";
import LinearGradient from "react-native-linear-gradient";
import * as Animatable from "react-native-animatable";
import firebase from "firebase";
import {
  BITMOVINPLAYER,
  HOME,
  WELCOMESCREEN,
  MOVIEDETAIL,
  SERIESEXTRASTAB,
} from "../constants/RouteNames";
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
import IconIon from "react-native-vector-icons/Ionicons";
import IconFeather from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconAnt from "react-native-vector-icons/AntDesign";
import ReactNativeBitmovinPlayer, {
  ReactNativeBitmovinPlayerIntance,
} from "@takeoffmedia/react-native-bitmovin-player";
import AsyncStorage from "@react-native-community/async-storage";
import Orientation from "react-native-orientation";
import moment from "moment";
import FastImage from "react-native-fast-image";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import DropDownPicker, { MyArrowUpIcon } from "react-native-dropdown-picker";
import RBSheet from "react-native-raw-bottom-sheet";
import SeasonItem from "./components/SeasonItem";
import ExtrasScreen from "./topTabScreens/ExtrasScreen";
import DefaultScreen from "./topTabScreens/DefaultScreen";

const MovieDetailScreen = ({ navigation, route }) => {
  const Tab = createMaterialTopTabNavigator();

  const user = useSelector((state) => state.user);
  const movies = useSelector((state) => state.movies);

  const dispatch = useDispatch();
  const scrollRef = useRef();
  const refRBSheet = useRef(null);

  const [play, setPlay] = useState(false);
  const appState = useRef(AppState.currentState);
  const { selectedMovie, isSeries, seriesTitle, rbSeasonNumber } = route.params;
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
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
  ]);
  const [activeTab, setActiveTab] = useState(SERIESEPISODESTAB);
  //console.log('currentProfile',user.currentProfile);
  /*   const getMovie = useCallback(async () => {
    const response = await FliikaApi.get(`/posts/${selectedMovie}`);
    setMovie(response.data);
  }, []);
  useEffect(() => {
    getMovie();
  }, []); */
  const currentMovie = movies.availableMovies.find(
    (r) => r._id === selectedMovie
  );

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
      console.log("timing", whatTime, whatDuration, movieTitle);
      if (didPlay == "true") {
        saveMovie(
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
        console.log("focused", didPlay);
        if (didPlay === "true") {
          //ReactNativeBitmovinPlayerIntance.destroy();
          AsyncStorage.setItem("didPlay", "false");
          console.log("focused", didPlay);
        }
      } else {
        console.log("focused ios");
        //ReactNativeBitmovinPlayerIntance.pause()
      }

      AsyncStorage.setItem("watched", "0");
      AsyncStorage.setItem("duration", "0");
      AsyncStorage.setItem("isWatchedBefore", "null");
      AsyncStorage.setItem("movieId", "null");
    });
    return () => unsubscribe();
  }, [navigation]);

  const showEpisodes = () => {
    setEpisodes(true);
    setDetails(false);
  };

  const showDetails = () => {
    setEpisodes(false);
    setDetails(true);
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
  const saveMovie = (
    duration,
    time,
    movieId,
    title,
    isWatchedMovie,
    seasonNumber,
    episodeNumber
  ) => {
    console.log(
      "saving movie",
      duration,
      time,
      title,
      isWatchedMovie,
      seasonNumber,
      episodeNumber
    );
    // console.log('iswatched',   isWatched(user.currentProfile.watched, title));
    if (time > 0) {
      if (isSeries === "movie") {
        if (isWatchedMovie === "false") {
          console.log("here 1");
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
          console.log("here 2");
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
      } else {
        if (isWatchedMovie === "false") {
          console.log("here 1 series");
          addtoWatchedProfile(
            moment(),
            moment(),
            user.user._id,
            movieId,
            title,
            duration,
            time,
            user.currentProfile._id,
            seasonNumber,
            episodeNumber
          )(dispatch);
        } else {
          console.log("here 2 series");
          updateWatchedProfile(
            moment(),
            user.user._id,
            movieId,
            title,
            duration,
            time,
            user.currentProfile._id,
            seasonNumber,
            episodeNumber
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
  let currentSeries = movies.availableMovies.filter(
    (r) => r.title == seriesTitle
  );

  let totalSeasons;
  try {
    totalSeasons = currentSeries.map((r) => r.season_number);
  } catch (err) {}
  const seasons = [...new Set(totalSeasons)];

  let seasonsLength;
  try {
    seasonsLength = seasons.length;
  } catch (err) {}

  let seasonsDropDownItems = [];
  try {
    for (let i = 0; i < seasonsLength; i++) {
      seasonsDropDownItems.push({
        label: `Season ${seasons[i]}`,
        value: seasons[i],
      });
    }
  } catch (err) {}

  useEffect(() => {
    if (currentSeries.length > 0) {
      setSeason(currentSeries.filter((e) => e.season_number == seasonNumber));
    }
  }, [series.length, seasonNumber]);
  useEffect(() => {
    if (!rbSeasonNumber) {
      setSeasonNumber(seasons[0]);
    } else {
      setSeasonNumber(rbSeasonNumber);
    }
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
  // Render Icons
  const movieIcons = () => {
    if (
      isWatchList(user.currentProfile.watchList, currentMovie.title) == true
    ) {
      return (
        <TouchableOpacity
          onPress={() => {
            showToast("Removed from watch list");
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
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            showToast("Added to watch list");
            addToProfileWatchList(
              user.user._id,
              currentMovie,
              user.currentProfile._id
            )(dispatch);
          }}
        >
          <IconFeather name="plus" size={40} color={COLORS.white} />
        </TouchableOpacity>
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
      thumbnail =
        isSeries === "series"
          ? season[0].dvd_thumbnail_link
          : currentMovie.dvd_thumbnail_link;
    } catch (err) {}

    let producersLength;
    let writersLength;
    let cinematographersLength;
    try {
      producersLength = currentMovie?.producers[0]?.length;
      writersLength = currentMovie?.writers[0]?.length;
      cinematographersLength = currentMovie?.cinematographers[0]?.length;
    } catch (err) {
      console.log(err);
    }

    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={{ uri: thumbnail }}
          resizeMode="cover"
          style={{
            width: SIZES.width,
            height:
              SIZES.height < 700 ? SIZES.height * 0.6 : SIZES.height * 0.7,
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
                        navigation.navigate(BITMOVINPLAYER, {
                          movieId: currentMovie._id,
                          time: null,
                        });
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
                  {isSeries === "movie" ? movieIcons() : null}

                  {isSeries == "movie" ? (
                    <IconFeather
                      name="download"
                      size={40}
                      color={COLORS.white}
                    />
                  ) : null}
                  {isSeries === "movie" ? (
                    <TouchableOpacity onPress={() => onShare()}>
                      <IconIon
                        name="share-social-outline"
                        size={40}
                        color={COLORS.white}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
              <Text
                style={{
                  color: COLORS.white,
                  textTransform: "uppercase",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {currentMovie.title}
              </Text>
            </LinearGradient>
          </View>
        </ImageBackground>
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
          {/* Movie Details */}
          {isSeries == "movie" ? (
            <>
              <View style={{ width: "100%", paddingHorizontal: 10 }}>
                <Text
                  style={{
                    fontFamily: "Sora-Regular",
                    color: COLORS.white,
                    textAlign: "justify",
                    marginBottom: 30,
                  }}
                >
                  {currentMovie.storyline}
                </Text>
              </View>
              <View style={{ width: "100%", paddingHorizontal: 10 }}>
                <Text style={styles.moreText}>More Information</Text>
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
                <View
                  style={{
                    width: "95%",
                    height: 2,
                    backgroundColor: "grey",
                    alignSelf: "center",
                    marginVertical: 10,
                  }}
                ></View>
                <Text style={styles.titleTextBg}>Cast</Text>
                <Text style={styles.detailText}>
                  {currentMovie.cast.toString().replace(/,/g, ", ")}
                </Text>
                <Text style={styles.titleTextBg}>Crew</Text>
                <Text style={styles.titleText}>Directors</Text>
                <Text style={styles.detailText}>
                  {currentMovie.directors.toString().replace(/,/g, ", ")}
                </Text>
                {writersLength ? (
                  <View>
                    <Text style={styles.titleText}>Writers</Text>
                    <Text style={styles.detailText}>
                      {currentMovie.writers.toString().replace(/,/g, ", ")}
                    </Text>
                  </View>
                ) : null}
                {cinematographersLength ? (
                  <View>
                    <Text style={styles.titleText}>Cinematographers</Text>
                    <Text style={styles.detailText}>
                      {currentMovie.cinematographers
                        .toString()
                        .replace(/,/g, ", ")}
                    </Text>
                  </View>
                ) : null}
                {producersLength ? (
                  <View>
                    <Text style={styles.titleText}>Producers</Text>
                    <Text style={styles.detailText}>
                      {currentMovie.producers.toString().replace(/,/g, ", ")}
                    </Text>
                  </View>
                ) : null}
              </View>
            </>
          ) : null}
        </View>
        {isSeries === "movie" ? (
          <View>
            <View
              style={{
                width: "90%",
                height: 2,
                backgroundColor: "grey",
                alignSelf: "center",
                marginVertical: 10,
              }}
            ></View>
            <Text
              style={{
                fontFamily: "Sora-Regular",
                color: "#fff",
                fontSize: 26,
                marginBottom: 20,
                marginLeft: 10,
              }}
            >
              People Also Watched
            </Text>
          </View>
        ) : null}
      </View>
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
          <Text style={{ color: COLORS.white }}>
            {currentMovie.film_rating}
          </Text>
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

  // to fix later for series

  const openRBSheet = () => {
    refRBSheet.current.open();
  };
  const closeRBSheet = () => {
    refRBSheet.current.close();
  };

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

        {play ? (
          <View
            style={{ width: SIZES.width * 0.9, height: SIZES.height * 0.5 }}
          ></View>
        ) : null}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "90%",
            alignSelf: "center",
          }}
        >
          <View>
            {isSeries == "series" ? (
              <View
                style={{
                  alignSelf: "center",
                  borderRadius: 5,
                  borderWidth: 0.7,
                  borderColor: "white",
                  zIndex: 50,
                }}
              >
                {/* <Menu
              visible={selectSeason}
              onPress={openFilter}
              onDismiss={closeFilter}
              anchor={
                <TouchableOpacity
                  style={{
                    width: 130,
                    flexDirection: 'row',
                    justifyContent: "space-around",
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
                  {seasons?.length > 1 ?<IconAnt name="caretdown" size={20} color="white"/>: null}
                </TouchableOpacity>
              }
            >
              {seasons.map((season) => {
                return (
                  <Menu.Item
                    style={{
                      width: 130,
                    }}
                    key={season}
                    onPress={() => {
                      setSeasonNumber(season), closeFilter();
                    }}
                    title={`Season ${season}`}
                  />
                );
              })}
            </Menu> */}
                {/* <DropDownPicker
                  showArrowIcon={true}
                  // ArrowUpIconComponent={({ style }) => (
                  //   <MyArrowUpIcon style={style} />
                  // )}
                  arrowIconStyle={{
                    tintColor: "#fff",
                  }}
                  placeholder={`Season ${seasonNumber}`}
                  closeOnBackPressed={true}
                  style={{
                    width: 140,
                    backgroundColor: "black",
                    borderRadius: 5,
                  }}
                  open={open}
                  value={value}
                  listMode="SCROLLVIEW"
                  itemSeparator={true}
                  items={seasonsDropDownItems}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  textStyle={{ color: "white", fontSize: 18 }}
                  dropDownContainerStyle={{
                    backgroundColor: "black",
                    width: 140,
                    borderColor: "grey",
                  }}
                  itemSeparatorStyle={{
                    backgroundColor: "#fff",
                    width: "90%",
                    alignSelf: "center",
                    opacity: 0.6,
                  }}
                /> */}
                <TouchableOpacity
                  onPress={() => openRBSheet()}
                  style={{
                    width: 140,
                    height: 50,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 20 }}
                  >{`Season ${seasonNumber}`}</Text>
                  <IconAnt name="down" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "35%",
              justifyContent: "space-around",
              alignSelf: "center",
            }}
          >
            {isSeries === "series" ? movieIcons() : null}
            {isSeries === "series" ? (
              <TouchableOpacity onPress={() => onShare()}>
                <IconIon
                  name="share-social-outline"
                  size={40}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
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
            component={
              activeTab === SERIESEPISODESTAB
                ? SeriesEpisodesTab
                : DefaultScreen
            }
            listeners={{ focus: () => setActiveTab(SERIESEPISODESTAB) }}
          />
          <Tab.Screen
            name={SERIESDETAILSTAB}
            component={
              activeTab === SERIESDETAILSTAB ? SeriesDetailsTab : DefaultScreen
            }
            listeners={{ focus: () => setActiveTab(SERIESDETAILSTAB) }}
          />
          <Tab.Screen
            name={SERIESEXTRASTAB}
            component={
              activeTab === SERIESEXTRASTAB ? ExtrasScreen : DefaultScreen
            }
            listeners={{ focus: () => setActiveTab(SERIESEXTRASTAB) }}
          />
        </Tab.Navigator>
        <RBSheet
          animationType="slide"
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
              borderWidth: 0.6,
              borderColor: "grey",
              height: SIZES.width * 0.3 * seasonsLength,
            },
          }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingLeft: 20,
              paddingBottom: 20,
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {seasons.map((season, index) => (
              <SeasonItem
                setSeason={setSeasonNumber}
                key={season}
                seasonNumber={season}
                seriesTitle={seriesTitle}
                closeRBSheet={closeRBSheet}
                from="movieDetails"
              />
            ))}
          </ScrollView>
        </RBSheet>
      </ScrollView>
    );
  }
  ////////// end of render movie details

  //// Render people also watched
  const peopleAlsoWatched = () => {
    let alsoWatchIds = [];
    for (let i = 0; i < currentMovie.genre.length; i++) {
      for (let x = 0; x < movies.availableMovies.length; x++) {
        if (
          movies.availableMovies[x].title != currentMovie.title &&
          movies.availableMovies[x].genre.includes(currentMovie.genre[i]) &&
          movies.availableMovies[x]?.film_type === "movie"
        ) {
          alsoWatchIds.push(movies.availableMovies[x]._id);
          // console.log(movies.availableMovies[x].title);
        }
      }
    }

    let alsoWatchSet = [...new Set(alsoWatchIds)];

    let alsoWatch = [];
    for (let x = 0; x < movies.availableMovies.length; x++) {
      for (let c = 0; c < alsoWatchSet.length; c++) {
        if (movies.availableMovies[x]._id === alsoWatchSet[c]) {
          alsoWatch.push(movies.availableMovies[x]);
        }
      }
    }
    const shuffled = alsoWatch.sort(() => 0.5 - Math.random());

    let availableMoviesLength;
    try {
      availableMoviesLength = shuffled?.length;
    } catch (err) {}
    let moviesToShow = [];

    if (availableMoviesLength > 5) {
      for (let i = 0; i < 6; i++) {
        moviesToShow.push(alsoWatch[i]);
      }
    } else {
      moviesToShow = [...shuffled];
    }
    const numColumns = 3;
    return (
      <View>
        <FlatList
          ref={scrollRef}
          ListHeaderComponent={renderHeaderSection()}
          showsVerticalScrollIndicator={false}
          data={moviesToShow}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <TouchableWithoutFeedback
              onPress={() => {
                scrollRef.current.scrollToOffset({ animated: true, offset: 0 });
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
                  borderRadius: 2,
                  marginHorizontal: 5,
                  marginVertical: 5,
                }}
                source={{ uri: item.dvd_thumbnail_link }}
              />
            </TouchableWithoutFeedback>
          )}
          numColumns={numColumns}
        />
      </View>
    );
  };
  //// end of people also watched

  return (
    <View style={styles.container}>
      {peopleAlsoWatched()}
      <Toast config={toastConfig} />
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
  moreText: {
    fontSize: 26,
    fontFamily: "Sora-Regular",
    color: "#fff",
    marginBottom: 20,
  },
  titleText: {
    fontSize: 20,
    fontFamily: "Sora-Regular",
    color: "#E8E8E8",
  },
  titleTextBg: {
    fontSize: 26,
    fontFamily: "Sora-Regular",
    color: "#E7E7E7",
  },
  detailText: {
    fontFamily: "Sora-Light",
    fontSize: 14,
    color: "#A9A9A9",
    marginBottom: 10,
  },
});

export default MovieDetailScreen;
