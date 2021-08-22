import React, {useCallback} from 'react'
import {View, Text, StyleSheet, FlatList, TouchableWithoutFeedback, Image} from 'react-native'
import { COLORS, SIZES, icons } from "../../constants";
import { MOVIEDETAIL } from '../../constants/RouteNames';

const MoviesList = ({title, movies, index, navigation}) => {
    const renderItem = useCallback(({ item, index }) => {
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
      }, [])

      const keyextractor = useCallback ((item) => item._id.toString(), []);
    return (
        <View>
          <Text
            style={{
              color: COLORS.white,
              fontSize: 24,
              marginVertical: 5,
              fontWeight: "bold",
            }}
          >
            {title}
          </Text>
          <FlatList
            data={movies }
            keyExtractor={keyextractor}
            horizontal
            showsHorizontalScrollIndicator
            renderItem={renderItem}
            maxToRenderPerBatch={3}
            windowSize={4}
          />
        </View>
     )
}

export default MoviesList
