import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
  Animated,
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  AppState,
} from "react-native";
import { COLORS, SIZES, icons } from "../../constants";
import { MOVIEDETAIL } from "../../constants/RouteNames";
import firebase from "firebase";
import Carousel from "react-native-snap-carousel";
import  LinearGradient  from "react-native-linear-gradient";
import { fetchMovies} from "../../store/actions/movies";
import { useDispatch, useSelector } from "react-redux";
import {
  addToProfileWatchList,
  removeFromProfileWatchList,
} from "../../store/actions/user";
import ProgressBar from "../components/ProgressBar";
import { LogBox } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconAwesome from 'react-native-vector-icons/FontAwesome5';
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import RecycleView from "../components/RecycleView";
import KeepAwake from '@sayem314/react-native-keep-awake';
import NetInfo from "@react-native-community/netinfo";


const HomeScreen = ({ navigation }) => {
  const appState = useRef(AppState.currentState);
  LogBox.ignoreAllLogs();
  //LogBox.ignoreLogs(["Calling `getNode()`"]);
  const user = useSelector((state) => state.user);
  const movies = useSelector((state) => state.movies);
//console.log('fetching',movies.isFetching);
//console.log(user.user);
  const dispatch = useDispatch();
  const [result, setResult] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [profiled, setProfiled] = useState('');
  const [connected, setConnected] = useState(null)


useEffect(()=> {
  const unsubscribe = NetInfo.addEventListener(state => {
    //console.log("Connection type", state.type);
    //console.log("Is connected?", state.isConnected);
    setConnected(state.isConnected)
  });
  
  // Unsubscribe
  return () => unsubscribe();
}, [])
  useEffect(() => {
      fetchMovies()(dispatch);
  }, []);

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

  const resultsToShow = movies.availableMovies.filter(
    (c) =>
      c.film_type == "movie" ||
      (c.film_type == "series" && c.season_number == 1 && c.episode_number == 1)
  );
  const genreArray = resultsToShow.map((r) => r.genre);
  let allGenre = [];
  for (let i = 0; i < genreArray.length; i++) {
    allGenre.push(...genreArray[i]);
  }

  const genres = [...new Set(allGenre)];
  let newResults = [];
  for (let x = 0; x < genres.length; x++) {
    newResults.push({
      genre: genres[x],
      movies: resultsToShow.filter((r) => r.genre.includes(genres[x])),
    });
  }

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
            onPress={() =>
              navigation.navigate(MOVIEDETAIL, {
                selectedMovie: item._id,
                isSeries: item.film_type,
                seriesTitle: item.title,
              })
            }
          >
            <Image
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
    }

    const keyextractor = (item) => item._id.toString()
    return newResults.map((item, index) => {
      return (
        <View key={index}>
        <RecycleView title={item.genre} navigation ={navigation} index={index} movie={index % 2 == 0 ? item.movies : item.movies.reverse()}/>
        </View>
      );
    });    
  };

  //// Render continue watching section

  let continueWatching = [];

    try {
      for (let i = 0; i < user.currentProfile.watched.length; i++) {
        resultsToShow.map((r) => {
          if (r.title == user.currentProfile.watched[i].title) {
            continueWatching.push(r);
          }
        });
      }
    } catch (err) {}

  let continueWatchingLength;
  try {
    continueWatchingLength = continueWatching.length;
  } catch (err) {}
  const calculateProgress = (movieName) => {
    try {
        var duration = user.currentProfile.watched.find(
          (c) => c.title == movieName
        ).duration;
        var watchedAt = user.currentProfile.watched.find(
          (c) => c.title == movieName
        ).watchedAt;
     
    } catch (err) {}
    return (watchedAt / duration) * 100;
  };
  const renderContinueWatctionSection = () => {
    return (
      <View>
        {/* Header */}
        {continueWatchingLength > 0 ? (
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: SIZES.padding,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                flex: 1,
                color: COLORS.white,
                fontSize: 20,
                fontWeight: "bold",
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
          data={continueWatching}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => {
            if (calculateProgress(item.title) < 100) {
              return (
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigation.navigate(MOVIEDETAIL, {
                      selectedMovie: item._id,
                      isSeries: item.film_type,
                      seriesTitle: item.title,
                    })
                  }
                >
                  <View
                    style={{
                      marginLeft: index == 0 ? SIZES.padding : 20,
                      marginRight:
                        index == continueWatching.length - 1
                          ? SIZES.padding
                          : 0,
                    }}
                  >
                    {/* Thumnnail */}
                    <Image
                      source={{ uri: item.dvd_thumbnail_link }}
                      style={{
                        width: SIZES.width * 0.3,
                        height: SIZES.width * 0.3,
                        borderRadius: 200,
                        resizeMode: "cover",
                      }}
                      resizeMode="cover"
                    />
                    {/* Name */}
                    <Text
                      style={{
                        color: COLORS.white,
                        marginTop: SIZES.base,
                        textAlign: "center",
                        width: SIZES.width * 0.3,
                      }}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    {/* Progress Bar */}
                    <ProgressBar
                      containerStyle={{ marginTop: SIZES.radius }}
                      barStyle={{ height: 3 }}
                      percentage={calculateProgress(item.title)}
                    />
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
    const { width, height } = Dimensions.get("window");
    
    const renderItem = ({ item, index }) => {
      if(item.dvd_thumbnail_link) {
      return (
        <View>
          <TouchableOpacity
              onPress={() =>
                navigation.navigate(MOVIEDETAIL, {
                  selectedMovie: item._id,
                  isSeries: item.film_type,
                  seriesTitle:  item.title,
                })
              }
          >
            <Image
              source={{ uri: item.dvd_thumbnail_link }}
              style={styles.carouselImage}
            />
            {/*<Text style={styles.carouselText}>{item.title}</Text>*/}
            {isWatchList(user.currentProfile.watchList, item.title) == true ? (
              <TouchableWithoutFeedback
                onPress={() => {
                    removeFromProfileWatchList(
                      user.user._id,
                      item,
                      user.currentProfile._id
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
                    addToProfileWatchList(
                      user.user._id,
                      item,
                      user.currentProfile._id
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
          </TouchableOpacity>
        </View>
      );
              }
    };

    return (
      <View style={styles.carouselContentContainer}>
        <View style={{ ...StyleSheet.absoluteFill, backgroundColor: "#000" }}>
          <ImageBackground
            source={{ uri: background.uri }}
            style={styles.ImageBg}
            blurRadius={10}
          >
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={["transparent", "#000"]}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 24,
                  fontWeight: "bold",
                  marginLeft: 10,
                  marginTop: 40,
                  marginBottom: 20,
                }}
              >
                Fliika Originals
              </Text>
              <View style={styles.carouselContainerView}>
                <Carousel
                  style={styles.carousel}
                  data={resultsToShow}
                  renderItem={renderItem}
                  itemWidth={230}
                  sliderWidth={500}
                  containerWidth={width - 20}
                  separatorWidth={0}
                  ref={carouselRef}
                  inActiveOpacity={0.4}
                  autoplay={true}
                  loop
                  inactiveSlideOpacity={0.7}
                  inactiveSlideScale={0.9}
                  // activeAnimationType={'spring'}
                  // activeAnimationOptions={{
                  //     friction: 4,
                  //     tension: 5
                  // }}
                  enableMomentum={true}
                  onSnapToItem={ index => { setBackground({
                    uri: resultsToShow[index]?.dvd_thumbnail_link,
                    name: resultsToShow[index]?.title,
                    stat: `${resultsToShow[index]?.film_rating} - ${resultsToShow[index]?.genre
                      .toString()
                      .replace(/,/g, " ")} - ${resultsToShow[index]?.runtime}`,
                    desc: resultsToShow[index]?.storyline,
                    _id: resultsToShow[index]?._id,
                    film_type: resultsToShow[index]?.film_type,
                  });} }
                />
              </View>
              <View style={styles.movieInfoContainer}>
                <View style={{ justifyContent: "center" }}>
                  <Text style={styles.movieName}>{background.name}</Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(MOVIEDETAIL, {
                      selectedMovie: background._id,
                      isSeries: background.film_type,
                      seriesTitle: background.name,
                    })
                  }
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
              <Text style={styles.movieStat}>{background.stat}</Text>
              <View style={{ paddingHorizontal: 14, marginTop: 14 }}>
                <Text
                  numberOfLines={4}
                  style={{
                    color: "white",
                    opacity: 0.8,
                    lineHeight: 20,
                    marginBottom: 20,
                  }}
                >
                  {background.desc}
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>
      </View>
    );
  };
  ///// End of Render Hero third design
  //// On Refresh Control
  const onRefresh = useCallback(() => {
    //setRefreshing(true);
    fetchMovies()(dispatch);
  }, []);
  //////////////////
  return (
    <View style={styles.container}>
      {movies.isFetching? (
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <ActivityIndicator
            animating
            color={"teal"}
            size="large"
            style={{ flex: 1, position: "absolute", top: "50%", left: "45%" }}
          />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <KeepAwake />
          {renderHeroSectionThirdDesign()}
          {continueWatchingLength > 0 ? renderContinueWatctionSection() : null}
          {renderMovies()}
        </ScrollView>
      )}
    </View>
  );
};

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
    width: 230,
    height: 360,
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
    height: 680,
    paddingHorizontal: 14,
  },
  ImageBg: {
    flex: 1,
    height: null,
    width: null,
    opacity: 1,
    justifyContent: "flex-start",
  },
  carouselContainerView: {
    width: "100%",
    height: 360,
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
    width: Dimensions.get("window").width - 14,
  },
  movieName: {
    paddingLeft: 14,
    color: "white",
    fontWeight: "bold",
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
});

export default HomeScreen;
