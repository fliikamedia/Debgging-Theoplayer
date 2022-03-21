import React from 'react';
import {View,Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity} from 'react-native';
import { useSelector } from 'react-redux';
import MovieDetailIcon from './components/MovieDetailIcon';
import LinearGradient from 'react-native-linear-gradient';
import { SIZES,  icons } from "../constants";
import RecycleView from './components/RecycleView';
import IconAwesome from 'react-native-vector-icons/FontAwesome5';
import { MOVIEDETAIL } from '../constants/RouteNames';
const GenreScreen = ({route, navigation}) => {
const movies = useSelector(state => state.movies);
const {genre} = route.params;
    

const currentGenreMovies = movies.availableMovies.filter(r => r.genre.includes(genre));
const shuffled = currentGenreMovies.sort(() => 0.5 - Math.random());

let currentMovie;

try {
currentMovie = shuffled[0];
} catch (err) {}

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
      </View>
    );
  };
const genrePoster = () => {

return (
    <View>
          <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(MOVIEDETAIL, {
                      selectedMovie: currentMovie._id,
                      isSeries: currentMovie.film_type,
                      seriesTitle: currentMovie.name,
                    });
                  }
                  }
                >
    <ImageBackground
            source={{ uri: currentMovie.dvd_thumbnail_link }}
            resizeMode="cover"
            style={{
              width: SIZES.width,
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
                  <View style={styles.movieInfoContainer}>
                <View style={{ justifyContent: "center", maxWidth: SIZES.width / 1.5}}>
                  <Text style={styles.movieName}>{currentMovie.title}</Text>
                </View>
                <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(MOVIEDETAIL, {
                      selectedMovie: currentMovie._id,
                      isSeries: currentMovie.film_type,
                      seriesTitle: currentMovie.name,
                    });
                  }
                  }
                  style={styles.playIconContainer}
                >
                  <IconAwesome
                    name="play"
                    size={22}
                    color="#fff"
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
                </View>
                </View>
              </LinearGradient>
            </View>
          </ImageBackground>
          </TouchableOpacity>
    </View>
    )    


}


  return (
    <ScrollView 
    showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.container}>
     {genrePoster()}
     <View style={{ marginTop: 50, marginBottom: 30}}>
     <RecycleView movie={shuffled}  index={0} title={`Most watched ${genre} movies`} navigation={navigation} from={'genre'} />
     </View>
  </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'black',
    },
    imagePoster: {
        width: SIZES.width / 4,
        height: 100
    },
    movieInfoContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: '90%',
    },
    movieName: {
      color: "white",
      fontFamily: 'Sora-Bold',
      fontSize: 18,
    },
    playIconContainer: {
      backgroundColor: "transparent",
      padding: 18,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      elevation: 25,
      borderWidth: 1,
      borderColor: "#fff",
    },
})

export default GenreScreen;
