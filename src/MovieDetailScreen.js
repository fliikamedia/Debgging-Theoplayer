import React, { useEffect, useState, useCallback } from "react";
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
} from "react-native";
import { COLORS, SIZES, FONTS, icons, images } from ".././constants";
import FliikaApi from "./api/FliikaApi";
import { Video, AVPlaybackStatus } from "expo-av";
import BitmovinApi from "@bitmovin/api-sdk";
import { Feather, Ionicons } from "@expo/vector-icons";
import MovieDetailIcon from "./components/MovieDetailIcon";
import { LinearGradient } from "expo-linear-gradient";

const MovieDetailScreen = ({ navigation, route }) => {
  const [play, setPlay] = useState(false);
  const bitmovinApi = new BitmovinApi({
    apiKey: "72fc96e3-318b-452f-91c7-bed54f199dd1",
  });

  const { selectedMovie } = route.params;
  const [movie, setMovie] = useState({});
  const getMovie = useCallback(async () => {
    const response = await FliikaApi.get(`/posts/${selectedMovie}`);
    setMovie(response.data);
  }, []);
  useEffect(() => {
    getMovie();
  }, []);

  //console.log(bitmovinApi);
  //console.log(movie);
  let resultLength;
  try {
    resultLength = Object.keys(movie).length;
  } catch (err) {}
  //const movieId = navigation.getParam("selectedMovie");

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
        <MovieDetailIcon
          iconFuc={() => console.log("sharing")}
          icon={icons.cast}
        />
      </View>
    );
  };
  const renderHeaderSection = () => {
    return (
      <ImageBackground
        source={{ uri: movie.dvd_thumbnail_link }}
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
                <TouchableOpacity onPress={() => setPlay(true)}>
                  <Image
                    source={icons.play}
                    resizeMode="contain"
                    style={{
                      width: 40,
                      height: 40,
                      tintColor: COLORS.white,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  width: "60%",
                  justifyContent: "space-around",
                  alignSelf: "center",
                }}
              >
                <Feather name="plus" size={40} color={COLORS.white} />
                <Feather name="download" size={40} color={COLORS.white} />
                <Ionicons
                  name="share-social-outline"
                  size={40}
                  color={COLORS.white}
                />
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
  const renderMovieDetails = () => {
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: SIZES.padding,
          marginTop: SIZES.padding,
          justifyContent: "space-around",
        }}
      >
        {/* titme, running time and progress bar */}
        <View>
          <View style={{ flexDirection: "row" }}></View>
        </View>
        {/* watch */}

        <View style={{ width: "100%", alignSelf: "center" }}>
          <Text style={{ color: COLORS.white, textAlign: "justify" }}>
            {movie.storyline}
          </Text>
        </View>
      </View>
    );
  };
  ////////// end of render movie details
  return (
    <SafeAreaView style={styles.container}>
      {resultLength == 0 ? (
        <ActivityIndicator
          animating
          color={"red"}
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
});

export default MovieDetailScreen;
