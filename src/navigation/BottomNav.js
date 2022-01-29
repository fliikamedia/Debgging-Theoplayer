import React from 'react';
import FastImage from 'react-native-fast-image';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import HomeScreen from "../BottomScreens/HomeScreen";
import SearchScreen from "../BottomScreens/SearchScreen";
import TvShowsScreen from "../BottomScreens/TvShowsScreen";
import ProfileScreen from "../BottomScreens/ProfileScreen";
import {
  MOVIES,
  HOME,
  SEARCH,
  SHOWS,
  PROFILESCREEN,
 DOWNLOADSCREEN
} from "../../constants/RouteNames";
import { useSelector } from "react-redux";
import profileImgs from '../../constants/profileImgs';
import DownloadsScreen from '../BottomScreens/DownloadsScreen';


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
            iconName = "home";
          } else if (route.name === SEARCH) {
            iconName = "search";
          } else if (route.name == SHOWS) {
            iconName = "television-classic";
          } else if (route.name === PROFILESCREEN) {
            iconName = "user";
          } else if (route.name == DOWNLOADSCREEN) {
            iconName = 'download';
          }
  
          if (route.name == SHOWS) {
            return (
              <MaterialCommunityIcons name={iconName} size={size} color={color} />
            );
          } else if (route.name == PROFILESCREEN) {
            return userIconFunc();
          } else if (route.name == HOME) {
            return <Feather name={iconName} size={size} color={color} />;
          } else if (route.name == DOWNLOADSCREEN) {
            return <Entypo name={iconName} size={size} color={color} />;
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
        name={DOWNLOADSCREEN}
        component={DownloadsScreen}
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
