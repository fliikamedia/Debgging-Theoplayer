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
  StatusBar,
} from "react-native";
import FliikaApi from "../api/FliikaApi";
import { COLORS, SIZES, icons } from "../../constants";
import { MOVIEDETAIL } from "../../constants/RouteNames";
import Profiles from "../components/Profiles";
import Carousel from "react-native-snap-carousel";
import LinearGradient from "react-native-linear-gradient";
import {
  addToWatchList,
  removeFromWatchList,
  addToProfileWatchList,
  removeFromProfileWatchList,
  setEmailFunc,
  getUser,
  changeProfileNew,
} from "../../store/actions/user";
import { useSelector, useDispatch } from "react-redux";
import IconAwesome from "react-native-vector-icons/FontAwesome5";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RecycleView from "../components/RecycleView";
import FastImage from "react-native-fast-image";
import RBSheet from "react-native-raw-bottom-sheet";
import RbSheetSeasonItem from "../components/RbSheetSeasonItem";
import moment from "moment";
import firebase from "firebase";
import Spinner from "react-native-spinkit";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { useTranslation } from "react-i18next";

const TvShowsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const movies = useSelector((state) => state.movies);
  const refRBSheetMovies = useRef(null);
  const [seasonNumber, setSeasonNumber] = useState(null);

  const [result, setResult] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [rbSeries, setRbSeries] = useState({});
  const { t } = useTranslation();
  const getSeries = useCallback(async () => {
    const response = await FliikaApi.get("/posts");
    setResult(response.data);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      getSeries();
      // changeProfileNew(
      //   user.email,
      //   user.currentProfile._id,
      //   navigation,
      //   false
      // )(dispatch);
    });
    return () => unsubscribe();
  }, [navigation]);

  // Toast config
  const showToast = (text) => {
    console.log("show");
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
          // marginBottom: 60,
          position: "absolute",
          bottom: 60,
          // zIndex: 2000,
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
  let series;
  series = movies.availableMovies.filter(
    (e) =>
      e.film_type == "series" &&
      e.episode_number == 1 &&
      (e.season_number == 1 || e.season_number == 8)
  );
  let resultLength;
  try {
    resultLength = series.length;
  } catch (err) {}

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

  const title = series.length > 0 ? series[0].title : null;
  const uri = series.length > 0 ? series[0].dvd_thumbnail_link : null;
  const stat =
    series.length > 0
      ? `${series[0].film_rating} - ${series[0].genre
          .toString()
          .replace(/,/g, " ")} - ${series[0].runtime}`
      : null;
  const desc = series.length > 0 ? series[0].storyline : null;
  const _id = series.length > 0 ? series[0]._id : null;
  const film_type = series.length > 0 ? series[0].film_type : null;
  const [background, setBackground] = useState({
    uri: "",
    name: "",
    stat: "",
    desc: "",
    _id: "",
  });
  useEffect(() => {
    if (series) {
      setBackground({
        uri: uri,
        name: title,
        stat: stat,
        desc: desc,
        _id: _id,
        film_type: film_type,
      });
    }
  }, [series.length]);
  const carouselRef = useRef(null);
  const renderHeroSection = () => {
    const { width, height } = Dimensions.get("window");

    const renderItem = ({ item, index }) => {
      if (item.dvd_thumbnail_link) {
        return (
          <View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(MOVIEDETAIL, {
                  selectedMovie: item._id,
                  isSeries: item.film_type,
                  seriesTitle: item.title,
                })
              }
            >
              <FastImage
                source={{ uri: item.dvd_thumbnail_link }}
                style={styles.carouselImage}
              />
              {/*<Text style={styles.carouselText}>{item.title}</Text>*/}
              {isWatchList(user.currentProfile.watchList, item.title) ==
              true ? (
                <TouchableOpacity
                  style={styles.carouselIcon}
                  onPress={() => {
                    // showToast("Removed from watch list");
                    removeFromProfileWatchList(
                      user.user._id,
                      item,
                      user.currentProfile._id,
                      item.season_number
                    )(dispatch).then(() => {
                      showToast(`${t("common:removedFromWatchlist")}`);
                    });
                  }}
                >
                  <Icon
                    name="book-remove-multiple-outline"
                    size={30}
                    color={COLORS.white}
                    // style={styles.carouselIcon}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.carouselIcon}
                  onPress={() => {
                    // showToast("Added to watch list");
                    addToProfileWatchList(
                      user.user._id,
                      item,
                      user.currentProfile._id,
                      item.season_number,
                      moment()
                    )(dispatch).then(() => {
                      showToast(`${t("common:addedToWatchlist")}`);
                    });
                  }}
                >
                  <IconMaterial name="library-add" size={30} color="white" />
                </TouchableOpacity>
              )}
              {item.film_type === "series" ? (
                <TouchableOpacity
                  onPress={() => {
                    setRbSeries(item), openRBSheet();
                  }}
                  style={styles.carouselIconInfo}
                >
                  <IconMaterial name="more-vert" size={30} color="#fff" />
                </TouchableOpacity>
              ) : null}
            </TouchableOpacity>
          </View>
        );
      }
    };
    return (
      <View style={styles.carouselContentContainer}>
        {/* <ImageBackground
          source={{ uri: background.uri }}
          style={styles.ImageBg}
          blurRadius={10}
          resizeMode="cover"
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
                fontFamily: "Sora-Bold",
                marginLeft: 10,
                marginTop: 40,
                marginBottom: 20,
              }}
            >
              Fliika Originals
            </Text> */}
        <View style={styles.carouselContainerView}>
          <Carousel
            style={styles.carousel}
            data={series}
            renderItem={renderItem}
            itemWidth={SIZES.width}
            sliderWidth={SIZES.width}
            containerWidth={width - 20}
            separatorWidth={0}
            ref={carouselRef}
            inActiveOpacity={0.4}
            loop
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
                uri: series[index]?.dvd_thumbnail_link,
                name: series[index]?.title,
                stat: `${series[index]?.film_rating} - ${series[index]?.genre
                  .toString()
                  .replace(/,/g, " ")} - ${series[index]?.runtime}`,
                desc: series[index]?.storyline,
                _id: series[index]?._id,
                film_type: series[index]?.film_type,
              });
            }}
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
              color="#00BFFF"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.movieStat}>{background.stat}</Text>
        <View style={{ paddingHorizontal: 14, marginTop: 14 }}>
          <Text
            numberOfLines={5}
            style={{
              fontFamily: "Sora-Regular",
              color: "white",
              opacity: 0.8,
              lineHeight: 20,
              marginBottom: 20,
            }}
          >
            {background.desc}
          </Text>
        </View>

        {/* </LinearGradient>
        </ImageBackground> */}
      </View>
    );
  };
  ///// End of Render Hero third design
  //// On Refresh Control
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getSeries();
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.getIdToken().then(function (idToken) {
          getUser(user.email, idToken)(dispatch);
        });
      }
    });
  }, []);
  //////////////////
  const genreArray = series.map((r) => r.genre);
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
      movies: movies.availableMovies.filter(
        (r) =>
          r.genre.includes(genres[x]) &&
          r.film_type == "series" &&
          r.season_number == 1
      ),
    });
  }

  const renderSeries = () => {
    return newResults.map((item, index) => {
      return (
        <View key={index}>
          <RecycleView
            title={item.genre}
            navigation={navigation}
            index={index}
            movie={index % 2 == 0 ? item.movies : item.movies.reverse()}
            from="tv"
          />
        </View>
      );
    });
  };

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
        ?.filter((r) => r.title === rbSeries.title)
        ?.map((r) => r.season_number);
    } catch (err) {}

    const seasons = [...new Set(allSeasons)];
    let seriesTitle;
    try {
      seriesTitle = rbSeries.title;
    } catch (err) {}

    return (
      <RBSheet
        // animationType="slide"
        ref={refRBSheetMovies}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
        height={SIZES.height * 0.5}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: "#fff",
          },
          container: {
            backgroundColor: "rgba(0,0,0, 0.92)",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderWidth: 0.6,
            borderColor: "grey",
            // height: SIZES.height * 0.5,
          },
        }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingLeft: 20,
            paddingBottom: 20,
            flexDirection: "column",
            justifyContent: seasons?.length === 1 ? "center" : "space-between",
          }}
        >
          {seasons
            ? seasons.map((season, index) => (
                <RbSheetSeasonItem
                  setSeason={setSeasonNumber}
                  key={season}
                  seasonNumber={season}
                  seriesTitle={seriesTitle}
                  closeRBSheet={closeRBSheet}
                  from="home"
                  navigate={navigation.navigate}
                  seriesId={rbSeries._id}
                />
              ))
            : null}
        </ScrollView>
      </RBSheet>
    );
  };
  /// End of bottom sheet movies
  return (
    <View style={styles.container}>
      {!background.uri || resultLength == 0 || user.isFetching ? (
        // <View style={{ flex: 1, backgroundColor: "black" }}>
        //   <ActivityIndicator
        //     animating
        //     color={"teal"}
        //     size="large"
        //     style={{ flex: 1, position: "absolute", top: "50%", left: "45%" }}
        //   />
        // </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "black",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Spinner
            isVisible={!background.uri || movies.isFetching || user.isFetching}
            size={70}
            type={"ThreeBounce"}
            color={"#fff"}
          />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{
            paddingBottom: 100,
            //marginTop: "10%",
          }}
        >
          {renderHeroSection()}
          {renderSeries()}
          {/*<StatusBar style="light" />*/}
          {renderBottomSheetMovies()}
        </ScrollView>
      )}
      <Toast config={toastConfig} />
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
    height: SIZES.height * 0.8,
  },
  carouselImage: {
    width: SIZES.width,
    // aspectRatio: 16 / 9,
    height: "100%",
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
    top: 45,
    right: 15,
    padding: 4,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    // elevation: 25,
    // borderWidth: 1,
    //borderColor: "white",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  carouselContentContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  ImageBg: {
    flex: 1,
    opacity: 1,
    justifyContent: "flex-start",
  },
  carouselContainerView: {
    width: "100%",
    height: SIZES.height * 0.6,
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
    fontFamily: "Sora-Bold",
    fontSize: 20,
    marginBottom: 6,
  },
  movieStat: {
    paddingLeft: 14,
    color: "white",
    fontFamily: "Sora-Regular",
    fontSize: 14,
    opacity: 0.8,
  },
  playIconContainer: {
    backgroundColor: "#000020",
    padding: 18,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 25,
    borderWidth: 2,
    borderColor: "#4682B4",
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
    // elevation: 25,
    // borderWidth: 1,
    //borderColor: "white",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
});
export default TvShowsScreen;
