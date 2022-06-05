import React, { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import RecycleViewVertical from "./components/RecycleViewVertical";
import RBSheet from "react-native-raw-bottom-sheet";
import IconAnt from "react-native-vector-icons/AntDesign";
import { MOVIEDETAIL } from "../constants/RouteNames";
import { removeFromProfileWatchList } from "../store/actions/user";
import FastImage from "react-native-fast-image";
import { SIZES } from "../constants";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

const WatchList = ({ navigation }) => {
  const user = useSelector((state) => state.user);
  const movies = useSelector((state) => state.movies);
  const dispatch = useDispatch();
  const refRBSheet = useRef(null);
  const [rbTitle, setRbTitle] = useState({});
  const [rbItem, setRbItem] = useState({});
  const [movieWatchList, setMovieWatchlist] = useState([]);
  let watchList = [];
  try {
    watchList = user.currentProfile.watchList;
  } catch (err) {
    watchList = [];
  }

  let watchListLength;
  try {
    watchListLength = watchList.length;
  } catch (err) {}

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
  // let moviesList;
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     console.log("focused");
  //     getWatchList();
  //   });
  //   return () => unsubscribe();
  // }, [navigation, watchListLength]);

  // useEffect(() => {
  //   getWatchList();
  // }, [watchListLength]);
  // const getWatchList = () => {
  useEffect(() => {
    const myList = [];

    for (let i = 0; i < watchListLength; i++) {
      for (let c = 0; c < movies?.availableMovies?.length; c++) {
        if (watchList[i]?.season) {
          if (
            watchList[i]?.title == movies.availableMovies[c].title &&
            watchList[i]?.season == movies.availableMovies[c].season_number &&
            movies.availableMovies[c].dvd_thumbnail_link
          ) {
            myList.push(movies.availableMovies[c]);
          }
        } else {
          if (
            watchList[i]?.title == movies.availableMovies[c].title &&
            movies.availableMovies[c].dvd_thumbnail_link
          ) {
            myList.push(movies.availableMovies[c]);
          }
        }
      }
    }

    setMovieWatchlist(myList);
  }, [watchList]);

  // return myList;
  // };
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
              fontSize: 22,
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
                  removeFromProfileWatchList(
                    user.user._id,
                    rbTitle,
                    user.currentProfile._id,
                    rbItem.season_number
                  )(dispatch);
                showToast("Removed from watch list");
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
  const renderWatchList = () => {
    if (watchListLength) {
      return (
        <View style={styles.listContainer}>
          {movieWatchList.map((movie) => (
            <TouchableOpacity
              onLongPress={() => {
                refRBSheet.current.open(),
                  setRbTitle({
                    type: movie.film_type,
                    title: movie.title,
                    id: movie._id,
                  });
                setRbItem(movie);
              }}
            >
              <FastImage
                style={{
                  width: SIZES.width * 0.3,
                  height: SIZES.width * 0.45,
                  borderRadius: 2,
                  margin: SIZES.width * 0.008,
                }}
                source={{ uri: movie.dvd_thumbnail_link }}
              />
            </TouchableOpacity>
          ))}
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            width: "80%",
            alignSelf: "center",
          }}
        >
          <Text style={{ fontSize: 20, color: "#fff", textAlign: "center" }}>
            Add movies and TV shows so you can watch them later
          </Text>
          {/* <TouchableOpacity style={{width: 180, height: 40, backgroundColor: '#505050', justifyContent: 'center', alignItems: 'center', borderRadius: 5}}>
            <Text style={{fontSize: 18, fontFamily: 'Sora-Regular', color: '#fff'}}>Search Movies</Text>
        </TouchableOpacity> */}
        </View>
      );
    }
  };
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>{renderWatchList()}</View>
      {renderBotomSheet()}
      <Toast config={toastConfig} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
export default WatchList;
