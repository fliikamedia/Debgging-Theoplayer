import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { useSelector } from "react-redux";
import { SIZES, icons, COLORS } from "../../constants";
import * as Animatable from "react-native-animatable";
import { BITMOVINPLAYER, MOVIEDETAIL } from "../../constants/RouteNames";
import IonIcon from "react-native-vector-icons/Ionicons";
import IconFeather from "react-native-vector-icons/Feather";
import { addToProfileWatchList } from "../../store/actions/user";
import IconAwesome from "react-native-vector-icons/FontAwesome5";

const RbSheetMovieItem = ({ movieTitle, navigate, closeRBSheet }) => {
  const movies = useSelector((state) => state.movies);
  const currentMovie = movies.availableMovies.find(
    (r) => r.title === movieTitle
  );

  const dvdPoster = () => {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.posterContainer}>
            <FastImage
              style={styles.poster}
              source={{ uri: currentMovie.dvd_thumbnail_link }}
            />
            <TouchableOpacity
              style={{
                padding: 20,
                borderRadius: 40,
                justifyContent: "center",
                alignItems: "center",
                elevation: 25,
                borderWidth: 1,
                borderColor: "#fff",
              }}
              onPress={() => {
                closeRBSheet();
                navigate(BITMOVINPLAYER, {
                  movieId: currentMovie._id,
                  time: null,
                });
              }}
            >
              <IconAwesome
                name="play"
                size={20}
                color="#fff"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.textContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingRight: 5,
              }}
            >
              <Text style={styles.detailText}>{currentMovie.runtime}</Text>
              <View style={{ maxWidth: 150, marginRight: 10 }}>
                <Text style={styles.detailText}>
                  {currentMovie.genre.toString().replace(/,/g, ", ")}
                </Text>
              </View>
            </View>
            <Text style={styles.titleText}>Cast</Text>
            <Text style={styles.detailText}>
              {currentMovie.cast.toString().replace(/,/g, ", ")}
            </Text>
            <Text style={styles.titleText}>Directors</Text>
            <Text style={styles.detailText}>
              {currentMovie.directors.toString().replace(/,/g, ", ")}
            </Text>
            <Text style={styles.titleText}>Writers</Text>
            <Text style={styles.detailText}>
              {currentMovie.writers.toString().replace(/,/g, ", ")}
            </Text>
          </View>
        </View>
        {/* storyLine and other icons */}
        <View style={styles.bottomIcons}>
          <View style={{ width: "70%" }}>
            <Text style={styles.titleText}>Storyline</Text>
            <Text style={styles.detailText}>{currentMovie.storyline}</Text>
          </View>
          {/* Info and add to watchList Icons */}
          <View style={styles.iconsContainer}>
            <TouchableOpacity
              onPress={() => {
                //showToast("Added to watch list");
                addToProfileWatchList(
                  user.user._id,
                  currentMovie,
                  user.currentProfile._id
                )(dispatch);
              }}
            >
              <IconFeather name="plus" size={40} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                closeRBSheet();
                navigate(MOVIEDETAIL, {
                  selectedMovie: currentMovie._id,
                  isSeries: currentMovie.film_type,
                  seriesTitle: currentMovie.name,
                });
              }}
              style={{
                margin: -5,
                padding: 4,
                height: 35,
                width: 35,
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
          </View>
        </View>
      </View>
    );
  };

  //   const widePoster = () => {
  //     return (
  //       <View>
  //         <FastImage
  //           style={styles.posterWide}
  //           source={{ uri: currentMovie.wide_thumbnail_link }}
  //         />
  //         <View style={{ marginBottom: 20 }}>
  //           <Text style={styles.title}>{movieTitle}</Text>
  //           <Text style={styles.titleText}>Cast</Text>
  //           <Text style={styles.detailText}>
  //             {currentMovie.cast.toString().replace(/,/g, ", ")}
  //           </Text>
  //           <Text style={styles.titleText}>Directors</Text>
  //           <Text style={styles.detailText}>
  //             {currentMovie.directors.toString().replace(/,/g, ", ")}
  //           </Text>
  //         </View>
  //         {/* play and other icons */}
  //         <View style={styles.bottomIcons}>
  //           <TouchableOpacity
  //             onPress={() => {
  //               closeRBSheet();
  //               navigate(BITMOVINPLAYER, {
  //                 movieId: currentMovie._id,
  //                 time: null,
  //               });
  //             }}
  //           >
  //             <View
  //               style={{
  //                 justifyContent: "center",
  //                 alignItems: "center",
  //                 width: 100,
  //                 height: 100,
  //                 borderRadius: 60,
  //                 backgroundColor: "rgba(255,255,255,0.2)",
  //                 alignSelf: "flex-start",
  //                 borderWidth: 0.2,
  //                 borderColor: "#fff",
  //               }}
  //             >
  //               <FastImage
  //                 source={icons.play}
  //                 tintColor="#fff"
  //                 resizeMode="contain"
  //                 style={{
  //                   width: 30,
  //                   height: 30,
  //                 }}
  //               />
  //             </View>
  //           </TouchableOpacity>
  //           {/* Info and add to watchList Icons */}
  //           <View style={styles.iconsContainer}>
  //             <TouchableOpacity
  //               onPress={() => {
  //                 //showToast("Added to watch list");
  //                 addToProfileWatchList(
  //                   user.user._id,
  //                   currentMovie,
  //                   user.currentProfile._id
  //                 )(dispatch);
  //               }}
  //             >
  //               <IconFeather name="plus" size={40} color={COLORS.white} />
  //             </TouchableOpacity>
  //             <TouchableOpacity
  //               onPress={() => {
  //                 closeRBSheet();
  //                 navigate(MOVIEDETAIL, {
  //                   selectedMovie: currentMovie._id,
  //                   isSeries: currentMovie.film_type,
  //                   seriesTitle: currentMovie.name,
  //                 });
  //               }}
  //               style={{
  //                 margin: -5,
  //                 padding: 4,
  //                 height: 40,
  //                 width: 40,
  //                 borderRadius: 100,
  //                 justifyContent: "center",
  //                 alignItems: "center",
  //                 elevation: 25,
  //                 borderWidth: 1,
  //                 borderColor: "white",
  //               }}
  //             >
  //               <IonIcon name="information" size={18} color="white" />
  //             </TouchableOpacity>
  //           </View>
  //         </View>
  //       </View>
  //     );
  //   };

  return (
    <View
      style={{
        flex: 1,
        marginLeft: -10,
      }}
    >
      {dvdPoster()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  textContainer: {
    width: 0,
    flexGrow: 1,
    flex: 1,
    marginLeft: 10,
  },
  posterContainer: {
    width: SIZES.width * 0.3,
    height: SIZES.width * 0.43,
    borderRadius: 5,
    marginLeft: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  poster: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 5,
  },
  titleText: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: "#E8E8E8",
  },
  detailText: {
    fontFamily: "Sora-Light",
    fontSize: 10.5,
    color: "#A9A9A9",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "25%",
  },
  bottomIcons: {
    flexDirection: "row",
    width: "95%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: -10,
  },
  posterWide: {
    width: "90%",
    aspectRatio: 16 / 9,
    alignSelf: "center",
  },
});
export default RbSheetMovieItem;
