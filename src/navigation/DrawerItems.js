import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import { createDrawerNavigator,  DrawerContentScrollView,
    DrawerItemList,
    DrawerItem, } from '@react-navigation/drawer';
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from '../../store/actions/movies';
import { GENRE } from '../../constants/RouteNames';
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
      <DrawerContentScrollView style={{backgroundColor: "rgb(40,40,40)"}} {...props}>
         <TouchableOpacity
         style={{ marginLeft: 20}}
         onPress={() => props.navigation.closeDrawer()}
         >
         <AntDesign name="close" size={25} color="#fff"  />
         </TouchableOpacity>
         
        {
                genres.map((item, index) => (
                  <DrawerItem key={index} label={item} labelStyle={{fontSize: 20, color: "#fff"}} onPress={()=> {
                      props.navigation.closeDrawer();
                      props.navigation.navigate(GENRE, {genre: item})
                  }} />
                ))
              }
      </DrawerContentScrollView>
  )
};

export default DrawerItems;
