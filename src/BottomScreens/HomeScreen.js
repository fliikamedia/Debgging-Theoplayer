import React, { useState, useEffect, useCallback } from "react";
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
} from "react-native";
import FliikaApi from "../api/FliikaApi";
import { COLORS, SIZES, icons } from "../../constants";
import { MOVIEDETAIL } from "../../constants/RouteNames";
import Profiles from "../components/Profiles";
const HomeScreen = ({ navigation }) => {
  const [result, setResult] = useState([]);

  const getMovies = useCallback(async () => {
    const response = await FliikaApi.get("/posts");
    setResult(response.data);
  }, []);

  useEffect(() => {
    getMovies();
  }, []);

  const genreArray = result.map((r) => r.genre);
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
  /////// The new season section function
  const newSeasonScrollX = React.useRef(new Animated.Value(0)).current;
  const renderNewSeasonSection = () => {
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
        data={result}
        keyExtractor={(item) => `${item._id}`}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: newSeasonScrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item, index }) => {
          return (
            <TouchableWithoutFeedback
              onPress={() =>
                navigation.navigate(MOVIEDETAIL, { selectedMovie: item._id })
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
                <ImageBackground
                  source={{ uri: item.dvd_thumbnail_link }}
                  resizeMode="cover"
                  style={{
                    width: SIZES.width * 0.85,
                    height: SIZES.width * 0.85,
                    justifyContent: "flex-end",
                  }}
                  imageStyle={{ borderRadius: 40 }}
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
              </View>
            </TouchableWithoutFeedback>
          );
        }}
      ></Animated.FlatList>
    );
  };

  ///// End of The new season section function

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
  let resultLength;
  try {
    resultLength = result.length;
  } catch (err) {}
  const renderMovies = () => {
    return newResults.map((item, index) => {
      return (
        <View key={item.genre}>
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
            color={"red"}
            size="large"
            style={{ flex: 1, position: "absolute", top: "50%", left: "45%" }}
          />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 100,
            marginTop: "10%",
          }}
        >
          {renderNewSeasonSection()}
          {renderDots()}
          {renderMovies()}
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
});

export default HomeScreen;
