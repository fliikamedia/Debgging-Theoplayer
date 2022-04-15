import React from "react";
import FastImage from "react-native-fast-image";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
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
  DOWNLOADSCREEN,
} from "../../constants/RouteNames";
import { useSelector } from "react-redux";
import profileImgs from "../../constants/profileImgs";
import DownloadsScreen from "../BottomScreens/DownloadsScreen";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SVGImg from "../../assets/fliika-logo.svg";
const Stack = createStackNavigator();

const getHeaderTitle = (route) => {
  return (
    // <FastImage
    //   style={{ height: 26, width: 80 }}
    //   source={require("../../assets/fliika-logo.png")}
    // />
    <SVGImg width={100} height={36} />
  );
};

const getHeaderLeft = (route) => {
  const { toggleDrawer } = useNavigation();

  return (
    <TouchableOpacity onPress={() => toggleDrawer()}>
      <Feather name="menu" size={25} color="#fff" style={{ marginLeft: 20 }} />
    </TouchableOpacity>
  );
};

function HomeStackScreen() {
  return (
    <Stack.Navigator
      mode="modal"
      initialRouteName={MOVIES}
      // screenOptions={{
      //   animationEnabled: true,
      //   headerTintColor: "teal",
      //   backgroundColor: "black",
      //   headerTransparent: true,
      //   cardStyle: { backgroundColor: 'black' },
      // cardStyleInterpolator: ({ current: { progress } }) => ({
      //   cardStyle: {
      //     opacity: progress.interpolate({
      //       inputRange: [0, 1],
      //       outputRange: [0, 1],
      //     }),
      //   },
      //   overlayStyle: {
      //     opacity: progress.interpolate({
      //       inputRange: [0, 1],
      //       outputRange: [0, 0.5],
      //       extrapolate: 'clamp',
      //     }),
      //   },
      // }),
      // }}
      detachInactiveScreens={false}
    >
      <Stack.Screen
        name={HOME}
        component={HomeScreen}
        options={({ route }) => ({
          headerShown: true,
          headerTransparent: true,
          headerTitle: () => getHeaderTitle(route),
          headerTitleAlign: "center",
          headerLeft: () => getHeaderLeft(route),
        })}
      />
    </Stack.Navigator>
  );
}

const Tabs = createBottomTabNavigator();

export default BottomNav = () => {
  const user = useSelector((state) => state.user);

  let imageSource;
  try {
    imageSource = profileImgs.find(
      (r) => r.name === user.currentProfile.image
    ).path;
  } catch (err) {
    imageSource = profileImgs.find((r) => r.name === "profile0").path;
  }

  const userIconFunc = () => {
    return (
      <FastImage
        style={{ width: 30, height: 30, borderRadius: 120 }}
        source={imageSource}
      />
    );
  };

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === HOME) {
            iconName = "home-outline";
          } else if (route.name === SEARCH) {
            iconName = "search";
          } else if (route.name == SHOWS) {
            iconName = "tv";
          } else if (route.name === PROFILESCREEN) {
            iconName = "user";
          } else if (route.name == DOWNLOADSCREEN) {
            iconName = "download-cloud";
          }

          if (route.name == SHOWS) {
            return <Feather name={iconName} size={size} color={color} />;
          } else if (route.name == PROFILESCREEN) {
            return userIconFunc();
          } else if (route.name == HOME) {
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name == DOWNLOADSCREEN) {
            return <Feather name={iconName} size={size} color={color} />;
          } else {
            return <Feather name={iconName} size={size} color={color} />;
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: "aqua",
        inactiveTintColor: "gray",
        keyboardHidesTabBar: true,
        style: {
          backgroundColor: "rgba(0,0,0,0.9)",
          // height: "7%",
          borderTopWidth: 0,
          justifyContent: "center",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          position: "absolute",
        },
        labelStyle: { fontSize: 0 },
      }}
    >
      <Tabs.Screen
        name={HOME}
        component={HomeStackScreen}
        options={{ title: " " }}
      />
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
  );
};
