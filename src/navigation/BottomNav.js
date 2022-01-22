import React from 'react';
import { TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { getFocusedRouteNameFromRoute, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator,  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem, } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import WelcomePage from "../WelcomePage";
import HomeScreen from "../BottomScreens/HomeScreen";
import SearchScreen from "../BottomScreens/SearchScreen";
import TvShowsScreen from "../BottomScreens/TvShowsScreen";
import MovieDetailScreen from "../MovieDetailScreen";
import ProfileScreen from "../BottomScreens/ProfileScreen";
import LoginScreen from "../auth/LoginScreen";
import FillProfileScreen from "../auth/FillProfileScreen";
import EditProfile from "../components/EditProfile";
import EpisodeDetailScreen from "../EpisodeDetailScreen";
import EmailSignup from "../auth/EmailSignup";
import BitmovinPlayer from '../BitmovinPlayer';
import GenreScreen from '../GenreScreen';
import {
  MOVIES,
  HOME,
  SEARCH,
  SHOWS,
  WELCOMESCREEN,
  MOVIEDETAIL,
  PROFILESCREEN,
  LOGIN,
  FILLPROFILESCREEN,
  EDITPROFILE,
  EPISODEDETAIL, BITMOVINPLAYER, EMAILSIGNUP, GENRE
} from "../../constants/RouteNames";
import { useDispatch, useSelector } from "react-redux";
import profileImgs from '../../constants/profileImgs';
import {useNavigation} from '@react-navigation/native';
import DrawerItems from './DrawerItems';

export default BottomNav = () => {
const user = useSelector((state) => state.user);

  let imageSource;
  try {
   imageSource = profileImgs.find(r => r.name === user.currentProfile.image).path;
  } catch (err) {
    imageSource = profileImgs.find(r => r.name === 'profile0').path;
  }

  const userIconFunc = () => {
    return <FastImage style={{width: 30, height: 30, borderRadius: 120}} source={imageSource}/>
  }



  const Tabs = createBottomTabNavigator();

    return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === HOME) {
            iconName = "md-home";
          } else if (route.name === SEARCH) {
            iconName = "search";
          } else if (route.name == SHOWS) {
            iconName = "television-classic";
          } else if (route.name === PROFILESCREEN) {
            iconName = "user";
          }
  
          if (route.name == SHOWS) {
            return (
              <MaterialCommunityIcons name={iconName} size={size} color={color} />
            );
          } else if (route.name == PROFILESCREEN) {
            return userIconFunc();
          } else {
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: "aqua",
        inactiveTintColor: "gray",
        keyboardHidesTabBar: true,
        style: {
          backgroundColor: "black",
         // height: "7%",
          borderTopWidth: 0,
          justifyContent: "center",
        },
        labelStyle: { fontSize: 0 },
      }}
    >
      <Tabs.Screen name={HOME} component={HomeScreen} options={{ title: " " }} />
      <Tabs.Screen
        name={SHOWS}
        component={TvShowsScreen}
        options={{ title: " " }}
      />
      <Tabs.Screen
        name={SEARCH}
        component={SearchScreen}
        options={{ title: " " }}
      />
      <Tabs.Screen
        name={PROFILESCREEN}
        component={ProfileScreen}
        options={{ title: " " }}
      />
    </Tabs.Navigator>
    )
  };
