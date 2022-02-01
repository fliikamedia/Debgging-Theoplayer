import React from 'react';
import {View,Text,StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
const WatchList = () => {

const user = useSelector(state => state.user);
console.log(user.currentProfile.watchList);
  return (
      <View style={styles.container}>
          <Text style={{color: '#fff'}}>Watch List</Text>
      </View>
  )
};

const styles = StyleSheet.create({
container : {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
}
})
export default WatchList;
