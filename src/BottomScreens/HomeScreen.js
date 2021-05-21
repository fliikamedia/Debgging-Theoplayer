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
  RefreshControl,
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

const HomeScreen = ({ navigation }) => {
  const [result, setResult] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getMovies = useCallback(async () => {
    const response = await FliikaApi.get("/posts");
    setResult(response.data);
  }, []);

  useEffect(() => {
    getMovies();
  }, []);

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

  ///// End of The new season section function

  ///// Render New season second design
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
  const renderNewSeasonSecondDesign = () => {
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
                if (item.dvd_thumbnail_link) {
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
                }
              }}
            />
          </SafeAreaView>
        </FlingGestureHandler>
      </FlingGestureHandler>
    );
  };
  ///// End of render new season second design
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

  //// On Refresh Control
  const onRefresh = useCallback(() => {
    getMovies();
  }, []);
  //////////////////

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
            marginTop: "10%",
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {renderNewSeasonSection()}
          {renderDots()}
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
});

export default HomeScreen;
