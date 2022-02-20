import React from 'react';
import { TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { getFocusedRouteNameFromRoute} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator} from '@react-navigation/drawer';
import Feather from 'react-native-vector-icons/Feather';
import MovieDetailScreen from "../MovieDetailScreen";
import EditProfile from "../components/EditProfile";
import EpisodeDetailScreen from "../EpisodeDetailScreen";
import BitmovinPlayer from '../BitmovinPlayer';
import GenreScreen from '../GenreScreen';
import WatchList from '../WatchList';
import {
  MOVIES,
  HOME,
  SEARCH,
  SHOWS,
  MOVIEDETAIL,
  PROFILESCREEN,
  EDITPROFILE,
  EPISODEDETAIL, BITMOVINPLAYER, GENRE, MOVIESTACK, WATCHLIST
} from "../../constants/RouteNames";
import {useNavigation} from '@react-navigation/native';
import DrawerItems from './DrawerItems';
import BottomNav from './BottomNav';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const MoviesNavogator = (props) => {
 
  const getHeaderTitle =(route) => {
    let routeName = getFocusedRouteNameFromRoute(route);

   if(!routeName) {
     routeName = HOME;
   }
  
    switch (routeName) {
      case HOME:
        return <FastImage style={{height: 32, width: 100}} source={require("../../assets/fliika-logo.png")}/>;
      case SEARCH:
        return null;
      case SHOWS:
        return null;
      case PROFILESCREEN:
        return null;
    }
  }

  const getHeaderLeft = (route) => {

    const {toggleDrawer} = useNavigation();
    let routeName = getFocusedRouteNameFromRoute(route);

    if(!routeName) {
      routeName = HOME;
    }
   
     switch (routeName) {
       case HOME:
         return  (
         <TouchableOpacity onPress={() =>toggleDrawer()}>
           <Feather name="menu" size={25} color="#fff" style={{marginLeft: 20}} />
         </TouchableOpacity>
         );
       case SEARCH:
         return null;
       case SHOWS:
         return null;
       case PROFILESCREEN:
         return null;
     }

  }
    return (
      <Stack.Navigator
      mode='modal'
              initialRouteName={MOVIES}
              screenOptions={{
                animationEnabled: false,
                headerTintColor: "white",
                backgroundColor: "black",
                headerStyle: {
                backgroundColor: 'black'
                },
                cardStyle: { backgroundColor: 'black' },
              cardStyleInterpolator: ({ current: { progress } }) => ({
                cardStyle: {
                  opacity: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
                overlayStyle: {
                  opacity: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.5],
                    extrapolate: 'clamp',
                  }),
                },
              }),
              }}
              detachInactiveScreens={false}
              >
                  <Stack.Screen
                    name={" "}
                    component={BottomNav}
                    options={{ headerShown: false }}
                    
                    />
              <Stack.Screen
                name={MOVIEDETAIL}
                component={MovieDetailScreen}
                options={{ headerShown: false }}
                />
              <Stack.Screen
                name={EDITPROFILE}
                component={EditProfile}
                options={{ headerShown: true, headerTitle: " "}}
                />
              <Stack.Screen
                name={EPISODEDETAIL}
                component={EpisodeDetailScreen}
                options={{ headerShown: false }}
                />
                <Stack.Screen
                name={BITMOVINPLAYER}
                component={BitmovinPlayer}
                options={{ headerShown: false }}
                />
                <Stack.Screen
                name={GENRE}
                component={GenreScreen}
                options={{
                  headerShown: false,
                }}
                />
                <Stack.Screen
                name={WATCHLIST}
                component={WatchList}
                options={{
                  headerShown: true,
                  headerTitle: "My Watchlist",
                  headerStyle : {
                    backgroundColor: 'black',
                  },
                  headerTitleAlign: 'center',
                  headerTintColor: '#fff'
                }}
                />
            </Stack.Navigator>
    )
              }

export default MoviesStack = () => (
  <Drawer.Navigator sceneContainerStyle={{backgroundColor: 'black'}} drawerContent={props => <DrawerItems {...props} />} initialRouteName={MOVIESTACK}
  >
 <Drawer.Screen name={MOVIESTACK} component={MoviesNavogator} />
</Drawer.Navigator>

)
  

  
  




