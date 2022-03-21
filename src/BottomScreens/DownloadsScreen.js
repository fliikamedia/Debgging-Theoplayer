import React from 'react';
import {View,Text, StyleSheet} from 'react-native'; 
const DownloadsScreen = () => {
  return (
    <View style={styles.container}>
        <Text style={{color: '#fff'}}>Downloads Screen</Text>
    </View>
  )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default DownloadsScreen;
