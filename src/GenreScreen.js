import React from 'react';
import {View,Text, StyleSheet} from 'react-native';
const GenreScreen = ({route}) => {
const {genre} = route.params;
    console.log(genre);
  return <View style={styles.container}>
      <Text style={{color: "#fff"}}>{`Genre is ${genre}`}</Text>
  </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center', 
        justifyContent: 'center'
    }
})

export default GenreScreen;
