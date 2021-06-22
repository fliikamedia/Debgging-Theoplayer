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
} from "react-native";
import FliikaApi from "../api/FliikaApi";
import { COLORS, SIZES, icons } from "../../constants";
import { MOVIEDETAIL } from "../../constants/RouteNames";
import Profiles from "../components/Profiles";
import { StatusBar } from "expo-status-bar";
import Carousel from "react-native-anchor-carousel";
import { FontAwesome5, Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const TvShowsScreen = ({ navigation }) => {
  const [result, setResult] = useState([]);

  const getSeries = useCallback(async () => {
    const response = await FliikaApi.get("/posts");
    setResult(response.data);
  }, []);

  useEffect(() => {
    getSeries();
  }, []);

  let series;
  series = result.filter(
    (e) => e.film_type == "series" && e.episode_number == 1
  );
  let resultLength;
  try {
    resultLength = series.length;
  } catch (err) {}
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
              });
            }}
          >
            <Image
              source={{ uri: item.dvd_thumbnail_link }}
              style={styles.carouselImage}
            />
            <Text style={styles.carouselText}>{item.title}</Text>
            <TouchableWithoutFeedback
              onPress={() => console.log("added to watch list")}
            >
              <MaterialIcons
                name="library-add"
                size={30}
                color="white"
                style={styles.carouselIcon}
              />
            </TouchableWithoutFeedback>
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
                  data={series}
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
    getMovies();
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
      series: result.filter(
        (r) => r.genre.includes(genres[x]) && r.film_type == "series"
      ),
    });
  }
  const renderSeries = () => {
    return newResults.map((item, index) => {
      return (
        <View style={{ marginTop: 20 }} key={item.genre}>
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
            data={index % 2 == 0 ? item.series : item.series.reverse()}
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

  return (
    <SafeAreaView style={styles.container}>
      {resultLength == 0 ? (
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
        >
          {renderHeroSection()}
          {renderSeries()}
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
export default TvShowsScreen;
