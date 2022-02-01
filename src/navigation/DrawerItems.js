import React from 'react';
import {SafeAreaView,View, TouchableOpacity} from 'react-native';
import { createDrawerNavigator,  DrawerContentScrollView,
    DrawerItemList,
    DrawerItem, } from '@react-navigation/drawer';
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from '../../store/actions/movies';
import { GENRE, MOVIESTACK, WATCHLIST } from '../../constants/RouteNames';
import AntDesign from 'react-native-vector-icons/AntDesign';

const DrawerItems = (props) => {

const movies = useSelector((state) => state.movies);
const dispatch = useDispatch();

/* React.useEffect(() => {
    fetchMovies()(dispatch);
}, []); */

  const genreArray = movies.availableMovies.map((r) => r.genre);
  let allGenre = [];
  for (let i = 0; i < genreArray.length; i++) {
    allGenre.push(...genreArray[i]);
  }

  const genres = [...new Set(allGenre)];
  return (
    <View style={{flex: 1,backgroundColor: "rgb(40,40,40)", paddingTop: 40}}>
           <TouchableOpacity
         style={{ marginLeft: 20}}
         onPress={() => props.navigation.closeDrawer()}
         >
         <AntDesign name="close" size={25} color="#fff"  />
         </TouchableOpacity>
             <View style={{borderBottomWidth: 2, borderBottomColor: '#fff', paddingBottom: 20}}>
         <DrawerItem
          label={'My watch list'}
          labelStyle={{fontSize: 20, color: "#fff"}}
          onPress={() => props.navigation.navigate(WATCHLIST)}
        />
         </View>
      <DrawerContentScrollView  {...props}>
        {
                genres.map((item, index) => (
                  <DrawerItem key={index} label={item} labelStyle={{fontSize: 20, color: "#fff"}} onPress={()=> {
                      props.navigation.closeDrawer();
                      props.navigation.navigate(GENRE, {genre: item})
                  }} />
                ))
              }
      </DrawerContentScrollView>
      </View>
  )
};

export default DrawerItems;
