import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  SafeAreaView,
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
import FliikaApi from "../api/FliikaApi";
import { COLORS, SIZES, icons } from "../../constants";
import { MOVIEDETAIL } from "../../constants/RouteNames";
import {
  FlingGestureHandler,
  Directions,
  State,
} from "react-native-gesture-handler";
import Profiles from "../components/Profiles";
import firebase from "firebase";
import { StatusBar } from "expo-status-bar";
import Carousel from "react-native-anchor-carousel";
import {
  FontAwesome5,
  Feather,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getUser } from "../../store/actions/user";
import { saveMovies } from "../../store/actions/movies";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWatchList,
  removeFromWatchList,
  addToProfileWatchList,
  removeFromProfileWatchList,
  setEmailFunc,
} from "../../store/actions/user";
import ProgressBar from "../components/ProgressBar";
import { LogBox } from "react-native";
import firestore from "@react-native-firebase/firestore";

const HomeScreen = ({ navigation }) => {
  //const db = firebase.firestore();
  const appState = useRef(AppState.currentState);
  LogBox.ignoreLogs(["Setting a timer"]);
  const user = useSelector((state) => state.user);
  //console.log(user);
  const dispatch = useDispatch();
  const [result, setResult] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getMovies = useCallback(async () => {
    const response = await FliikaApi.get("/posts");
    saveMovies(response.data)(dispatch);
    setResult(response.data);
    setRefreshing(false);
  }, []);
  const { email } = firebase.auth().currentUser;

  useEffect(() => {
    getMovies();
    setEmailFunc(email)(dispatch);
  }, []);
  useEffect(() => {
    getUser(user.email, user.profileName)(dispatch);
  }, [user.email, user.ProfileName, result]);
  /*
  useEffect(() => {
    AppState.addEventListener(
      "change",
      getUser(user.email, user.profileName)(dispatch)
    );

    return () => {
      AppState.removeEventListener(
        "change",
        getUser(user.email, user.profileName)(dispatch)
      );
    };
  }, [user.profileName]);
  */
  /*
  const getUsers = async () => {
    const response = db.collection("users");
    const data = await response.get();
    data.docs.forEach((item) => {
      console.log([item.data()]);
    });
  };

  useEffect(() => {
    getUsers();
  }, []);
*/
  /*
  const getUsers = async () => {
    firestore()
      .collection("Users")
      .get()
      .then((querySnapshot) => {
        console.log("Total users: ", querySnapshot);
      });
  };
  useEffect(() => {
    getUsers();
  }, []);
  */
  /*
  const checkIFLoggedIn = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //console.log(user);
      }
    });
  };
  useEffect(() => {
    checkIFLoggedIn();
  }, []);
*/
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
  const watchListFunc = () => {
    try {
      if (user.isProfile) {
        return user.profile.watchList;
      } else {
        return user.user.watchList;
      }
    } catch (err) {}
  };
  const resultsToShow = result.filter(
    (c) =>
      c.film_type == "movie" ||
      (c.film_type == "series" && c.season_number == 1 && c.episode_number == 1)
  );
  const genreArray = resultsToShow.map((r) => r.genre);
  let allGenre = [];
  for (let i = 0; i < genreArray.length; i++) {
    allGenre.push(...genreArray[i]);
  }
  /*
  let trimmedGenre = [];
  for (let e = 0; e < allGenre.length; e++) {
    trimmedGenre.push(allGenre[e].trim());
  }
  */
  const genres = [...new Set(allGenre)];
  let newResults = [];
  for (let x = 0; x < genres.length; x++) {
    newResults.push({
      genre: genres[x],
      movies: result.filter((r) => r.genre.includes(genres[x])),
    });
  }
  /////// The Hero section function
  const newSeasonScrollX = React.useRef(new Animated.Value(0)).current;
  const renderHeroSection = () => {
    return (
      <Animated.FlatList
        horizontal
        pagingEnabled
        snapToAlignment="center"
        snapToInterval={SIZES.width}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate={0}
        contentContainerStyle={{ marginTop: SIZES.radius }}
        data={resultsToShow}
        keyExtractor={(item) => `${item._id}`}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: newSeasonScrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item, index }) => {
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
                  width: SIZES.width,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Showing Thumbnails */}
                {item.dvd_thumbnail_link ? (
                  <ImageBackground
                    source={{ uri: item.dvd_thumbnail_link }}
                    resizeMode="cover"
                    style={{
                      width: SIZES.width * 0.85,
                      height: SIZES.width * 1.2,
                      justifyContent: "flex-end",
                    }}
                    imageStyle={{ borderRadius: 3 }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        marginBottom: SIZES.radius,
                        paddingHorizontal: SIZES.radius,
                      }}
                    >
                      {/* Play Now */}
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
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
                          Play Now
                        </Text>
                      </View>

                      {/* Still watching */}
                      {/*result.length > 0 && (
                      <View style={{ justifyContent: "center" }}>
                        <Text style={{ color: COLORS.white, fontSize: 16 }}>
                          Still Watching
                        </Text>
                        <Profiles profiles={stillWatching} />
                      </View>
                    )*/}
                    </View>
                  </ImageBackground>
                ) : null}
              </View>
            </TouchableWithoutFeedback>
          );
        }}
      ></Animated.FlatList>
    );
  };

  ///// End of The Hero section function

  ///// Render Hero second design
  useEffect(() => {
    Animated.spring(scrollXAnimated, {
      toValue: scrollXIndex,
      useNativeDriver: true,
    }).start();
  }, []);
  const scrollXAnimated = React.useRef(new Animated.Value(0)).current;
  const scrollXIndex = React.useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);
  const setActiveIndex = useCallback((activeIndex) => {
    scrollXIndex.setValue(activeIndex);
    setIndex(activeIndex);
  });
  const OVERFLOW_HEIGHT = 70;
  const SPACING = 10;
  const ITEM_WIDTH = SIZES.width * 0.75;
  const ITEM_HEIGHT = ITEM_WIDTH * 1.5;
  const VISIBLE_ITEMS = 3;
  const renderHeroSectionSecondDesign = () => {
    const OverflowItems = ({ data, scrollXAnimated }) => {
      const inputRange = [-1, 0, 1];
      const translateY = scrollXAnimated.interpolate({
        inputRange,
        outputRange: [OVERFLOW_HEIGHT, 0, -OVERFLOW_HEIGHT],
      });

      return (
        <View style={styles.overflowContainer}>
          <Animated.View style={{ transform: [{ translateY }] }}>
            {data.map((item, index) => {
              return <Text key={index}>Hi</Text>;
            })}
          </Animated.View>
        </View>
      );
    };

    return (
      <FlingGestureHandler
        key="left"
        direction={Directions.LEFT}
        onHandlerStateChange={(ev) => {
          if (ev.nativeEvent.state === State.END) {
            if (index === result.length - 1) {
              return;
            }
            setActiveIndex(index + 1);
          }
        }}
      >
        <FlingGestureHandler
          key="right"
          direction={Directions.RIGHT}
          onHandlerStateChange={(ev) => {
            if (ev.nativeEvent.state === State.END) {
              if (index === 0) {
                return;
              }
              setActiveIndex(index - 1);
            }
          }}
        >
          <SafeAreaView style={styles.containers}>
            <FlatList
              data={result}
              keyExtractor={(_, index) => String(index)}
              horizontal
              inverted
              contentContainerStyle={{
                flex: 1,
                justifyContent: "center",
                padding: SPACING * 2,
              }}
              scrollEnabled={false}
              removeClippedSubviews={false}
              CellRendererComponent={({
                item,
                index,
                children,
                style,
                ...props
              }) => {
                const newStyle = [style, { zIndex: newResults.length - index }];
                return (
                  <View style={newStyle} index={index} {...props}>
                    {children}
                  </View>
                );
              }}
              renderItem={({ item, index }) => {
                const inputRange = [index - 1, index, index + 1];
                const translateX = scrollXAnimated.interpolate({
                  inputRange,
                  outputRange: [50, 0, -100],
                });
                const scale = scrollXAnimated.interpolate({
                  inputRange,
                  outputRange: [0.8, 1, 1.3],
                });
                const opacity = scrollXAnimated.interpolate({
                  inputRange,
                  outputRange: [1 - 1 / VISIBLE_ITEMS, 1, 0],
                });
                return (
                  <Animated.View
                    style={{
                      position: "absolute",
                      left: -ITEM_WIDTH / 2,
                      opacity,
                      transform: [
                        {
                          translateX,
                        },
                        { scale },
                      ],
                    }}
                  >
                    <Image
                      source={{ uri: item.dvd_thumbnail_link }}
                      style={{
                        width: ITEM_WIDTH,
                        height: ITEM_HEIGHT,
                        borderRadius: 3,
                      }}
                    />
                  </Animated.View>
                );
              }}
            />
          </SafeAreaView>
        </FlingGestureHandler>
      </FlingGestureHandler>
    );
  };
  ///// End of render Hero second design
  ///// The render dots function
  const renderDots = () => {
    const dotPosition = Animated.divide(newSeasonScrollX, SIZES.width);
    return (
      <View
        style={{
          marginTop: SIZES.padding,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {result.map((item, index) => {
          const opacity = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          const dotWidth = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [6, 20, 6],
            extrapolate: "clamp",
          });
          const dotColor = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [COLORS.lightGray, COLORS.primary, COLORS.lightGray],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={`dot-${index}`}
              opacity={opacity}
              style={{
                borderRadius: SIZES.radius,
                marginHorizontal: 3,
                width: dotWidth,
                height: 6,
                backgroundColor: dotColor,
              }}
            />
          );
        })}
      </View>
    );
  };
  //// End of the render dots function
  ////////// Render dots for second design
  const renderDotsSecondDesign = () => {
    const dotPosition = scrollXIndex;
    return (
      <View
        style={{
          marginTop: SIZES.padding,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {result.map((item, i) => {
          const opacity = i == index ? 1 : 0.3;
          const dotWidth = i == index ? 20 : 6;
          const dotColor = i == index ? COLORS.primary : COLORS.lightGray;
          return (
            <Animated.View
              key={`dot-${i}`}
              opacity={opacity}
              style={{
                borderRadius: SIZES.radius,
                marginHorizontal: 3,
                width: dotWidth,
                height: 6,
                backgroundColor: dotColor,
              }}
            />
          );
        })}
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
    return newResults.map((item, index) => {
      return (
        <View style={{ marginTop: 0 }} key={item.genre}>
          <Text
            style={{
              color: COLORS.white,
              fontSize: 24,
              marginVertical: 5,
              fontWeight: "bold",
            }}
          >
            {item.genre}
          </Text>
          <FlatList
            data={index % 2 == 0 ? item.movies : item.movies.reverse()}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator
            renderItem={({ item, index }) => {
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
            }}
          />
        </View>
      );
    });
  };

  //// Render continue watching section

  let continueWatching = [];
  if (user.isProfile) {
    try {
      for (let i = 0; i < user.profile.watched.length; i++) {
        resultsToShow.map((r) => {
          if (r.title == user.profile.watched[i].title) {
            continueWatching.push(r);
          }
        });
      }
    } catch (err) {}
  } else {
    try {
      for (let i = 0; i < user.user.watched.length; i++) {
        resultsToShow.map((r) => {
          if (r.title == user.user.watched[i].title) {
            continueWatching.push(r);
          }
        });
      }
    } catch (err) {}
  }
  let continueWatchingLength;
  try {
    continueWatchingLength = continueWatching.length;
  } catch (err) {}
  const calculateProgress = (movieName) => {
    try {
      if (!user.isProfile) {
        var duration = user.user.watched.find(
          (c) => c.title == movieName
        ).duration;
        var watchedAt = user.user.watched.find(
          (c) => c.title == movieName
        ).watchedAt;
      } else if (user.isProfile) {
        var duration = user.profile.watched.find(
          (c) => c.title == movieName
        ).duration;
        var watchedAt = user.profile.watched.find(
          (c) => c.title == movieName
        ).watchedAt;
      }
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
      return (
        <View>
          <TouchableOpacity
            onPress={() => {
              carouselRef.current.scrollToIndex(index);
              setBackground({
                uri: item.dvd_thumbnail_link,
                name: item.title,
                stat: `${item.film_rating} - ${item.genre
                  .toString()
                  .replace(/,/g, " ")} - ${item.runtime}`,
                desc: item.storyline,
                _id: item._id,
                film_type: item.film_type,
              });
            }}
          >
            <Image
              source={{ uri: item.dvd_thumbnail_link }}
              style={styles.carouselImage}
            />
            {/*<Text style={styles.carouselText}>{item.title}</Text>*/}
            {isWatchList(watchListFunc(), item.title) == true ? (
              <TouchableWithoutFeedback
                onPress={() => {
                  if (user.isProfile) {
                    removeFromProfileWatchList(
                      user.email,
                      item,
                      user.profileName
                    )(dispatch);
                  } else {
                    removeFromWatchList(user.email, item)(dispatch);
                  }
                }}
              >
                <MaterialCommunityIcons
                  name="book-remove-multiple-outline"
                  size={30}
                  color={COLORS.white}
                  style={styles.carouselIcon}
                />
              </TouchableWithoutFeedback>
            ) : (
              <TouchableWithoutFeedback
                onPress={() => {
                  if (user.isProfile) {
                    addToProfileWatchList(
                      user.email,
                      item,
                      user.profileName
                    )(dispatch);
                  } else {
                    addToWatchList(user.email, item)(dispatch);
                  }
                }}
              >
                <MaterialIcons
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
                  itemWidth={200}
                  containerWidth={width - 20}
                  separatorWidth={0}
                  ref={carouselRef}
                  inActiveOpacity={0.4}
                  //pagingEnable={false}
                  //minScrollDistance={20}
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
                  <FontAwesome5
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
    setRefreshing(true);
    getMovies();
  }, []);
  //////////////////
  return (
    <SafeAreaView style={styles.container}>
      {resultLength == 0 || !user.userFetched ? (
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
            //marginTop: "10%",
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {renderHeroSectionThirdDesign()}
          {continueWatchingLength > 0 ? renderContinueWatctionSection() : null}
          {renderMovies()}
          <StatusBar style="light" />
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
    width: 200,
    height: 320,
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
    height: 350,
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
