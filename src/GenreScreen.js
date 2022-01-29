import React from 'react';
import {View,Text, StyleSheet, ImageBackground, ScrollView} from 'react-native';
import { useSelector } from 'react-redux';
import MovieDetailIcon from './components/MovieDetailIcon';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SIZES, FONTS, icons, images } from "../constants";
import FastImage from 'react-native-fast-image';
import RecycleViewVertical from './components/RecycleViewVertical';
import RecycleView from './components/RecycleView';
const GenreScreen = ({route, navigation}) => {
const movies = useSelector(state => state.movies);
const {genre} = route.params;
    

const currentGenreMovies = movies.availableMovies.filter(r => r.genre.includes(genre));
const shuffled = currentGenreMovies.sort(() => 0.5 - Math.random());

let genreLength;
try {
genreLength = currentGenreMovies.length;
} catch (err){}
console.log(genreLength);


const imageRow = (number) => {
    let imagesArray = [];
    for (let i = 0; i < number; i++) {
        imagesArray.push(shuffled[i].dvd_thumbnail_link);
    }
    return (
    <View  style={{flexDirection: 'row',flexWrap: 'wrap', alignItems: 'flex-start'}}>
        {imagesArray.map((image, index) => (
            <FastImage style={styles.imagePoster} key = {index} source={{uri: image}} />
        ))}
    </View>
    )
}
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

    
let thumbnail;

try {
thumbnail = shuffled[0].dvd_thumbnail_link;
} catch (err) {}

if(genreLength < 12) {
return (
    <View>
    <ImageBackground
            source={{ uri: thumbnail }}
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
                <Text
                  style={{
                    color: COLORS.white,
                    textTransform: "uppercase",
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  {genre}
                </Text>
              </LinearGradient>
            </View>
          </ImageBackground>
    </View>
    )    
} else if (genreLength >= 24) {

let gridImages = [];
for (let i = 0; i < 12; i++) {
    gridImages.push(shuffled[i].dvd_thumbnail_link)
} 
    return (
        <View>
       {/*  <GridImageView 
        //heightOfGridImage={SIZES.width * 0.5}
        data={gridImages} />
        <Text style={{color: '#fff'}}>{genre}</Text> */}
        {imageRow(12)}
       </View>
    )
}

}


  return <ScrollView contentContainerStyle={styles.container}>
     {genrePoster()}
     <View style={{ marginTop: 50, marginBottom: 30}}>
     <RecycleView movie={shuffled}  index={0} title={genre} />
     </View>
  </ScrollView>;
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'black',
    },
    imagePoster: {
        width: SIZES.width / 4,
        height: 100
    }
})

export default GenreScreen;
