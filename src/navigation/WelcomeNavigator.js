import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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
  EPISODEDETAIL, BITMOVINPLAYER, EMAILSIGNUP
} from "../../constants/RouteNames";

export default WelcomeNavogator = () => {


    const Tabs = createBottomTabNavigator();
  const Stack = createStackNavigator();
  const BottomTab = () => {
   

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
            return <Feather name={iconName} size={size} color={color} />;
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
  
    return (
        <NavigationContainer>
            <Stack.Navigator
              initialRouteName={WELCOMESCREEN}
              screenOptions={{
                animationEnabled: true,
                headerTintColor: "teal",
                cardStyle: { opacity: 1, backgroundColor: "black" },
                backgroundColor: "black",
              }}
              detachInactiveScreens={false}
              >
                   <Stack.Screen
                    name={WELCOMESCREEN}
                    component={WelcomePage}
                    options={{ headerShown: false }}
                    />
                  <Stack.Screen
                    name={MOVIES}
                    component={BottomTab}
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
                options={{ headerShown: false }}
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
                name={EMAILSIGNUP}
                component={EmailSignup}
                options={{
                  title: " ",
                  headerStyle: {
                    backgroundColor: "black",
                  },
                }}
                />
              <Stack.Screen
                name={LOGIN}
                component={LoginScreen}
                options={{
                  title: " ",
                  headerStyle: {
                    backgroundColor: "black",
                  },
                }}
                />
              <Stack.Screen
                name={FILLPROFILESCREEN}
                component={FillProfileScreen}
                options={{
                  title: " ",
                  headerStyle: {
                    backgroundColor: "black",
                  },
                }}
                />
            </Stack.Navigator>
          </NavigationContainer>
    )
}



