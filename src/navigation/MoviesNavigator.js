import React from "react";
import { TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Feather from "react-native-vector-icons/Feather";
import MovieDetailScreen from "../MovieDetailScreen";
import EditProfile from "../components/EditProfile";
import EpisodeDetailScreen from "../EpisodeDetailScreen";
import BitmovinPlayer from "../BitmovinPlayer";
import GenreScreen from "../GenreScreen";
import WatchList from "../WatchList";
import AccountSettings from "../AccountSettings";
import {
  MOVIES,
  HOME,
  SEARCH,
  SHOWS,
  MOVIEDETAIL,
  PROFILESCREEN,
  EDITPROFILE,
  EPISODEDETAIL,
  BITMOVINPLAYER,
  GENRE,
  MOVIESTACK,
  WATCHLIST,
  ACCOUNTSETTINGS,
  ACCOUNT,
  THEOPLAYER,
} from "../../constants/RouteNames";
import { useNavigation } from "@react-navigation/native";
import DrawerItems from "./DrawerItems";
import BottomNav from "./BottomNav";
import ProfileScreen from "../BottomScreens/ProfileScreen";
import Account from "../Account";
import TheoPlayer from "../TheoPlayerPage";
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const MoviesNavogator = (props) => {
  return (
    <Stack.Navigator
      mode="modal"
      initialRouteName={MOVIES}
      screenOptions={{
        animationEnabled: false,
        headerBackTitleVisible: false,
        headerTintColor: "white",
        backgroundColor: "black",
        headerStyle: {
          backgroundColor: "black",
          shadowColor: "transparent", // this covers iOS
          elevation: 0, // this covers Android
        },
        cardStyle: { backgroundColor: "black" },
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
              extrapolate: "clamp",
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
        options={{ headerShown: true, headerTitle: " " }}
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
        name={PROFILESCREEN}
        component={ProfileScreen}
        options={{
          headerShown: true,
          headerTitle: "Profiles",
          headerTitleAlign: "center",
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name={WATCHLIST}
        component={WatchList}
        options={{
          headerShown: true,
          headerTitle: "My Watchlist",
          headerTitleAlign: "center",
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name={ACCOUNT}
        component={Account}
        options={{
          headerShown: true,
          headerTitle: ACCOUNT,
          headerTitleAlign: "center",
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name={THEOPLAYER}
        component={TheoPlayer}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MoviesStack = (route) => {
  // let routeName = getFocusedRouteNameFromRoute(route);
  let routeName = getFocusedRouteNameFromRoute(route);

  // if (!routeName) {
  //   routeName = HOME;
  // }

  return (
    <Drawer.Navigator
      screenOptions={{
        swipeEnabled: routeName === HOME ? true : false,
      }}
      sceneContainerStyle={{ backgroundColor: "black" }}
      drawerContent={(props) => <DrawerItems {...props} />}
      initialRouteName={MOVIESTACK}
    >
      <Drawer.Screen name={MOVIESTACK} component={MoviesNavogator} />
    </Drawer.Navigator>
  );
};
