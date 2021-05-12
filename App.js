import * as React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import WelcomePage from "./src/WelcomePage";
import HomeScreen from "./src/BottomScreens/HomeScreen";
import SearchScreen from "./src/BottomScreens/SearchScreen";
import TvShowsScreen from "./src/BottomScreens/TvShowsScreen";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  MOVIES,
  HOME,
  SEARCH,
  SHOWS,
  WELCOMESCREEN,
} from "./constants/RouteNames";

// Bottom Tab Navigator
const Tabs = createBottomTabNavigator();
const BottomTab = () => (
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
        }

        if (route.name == "TV Shows") {
          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        } else {
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      },
    })}
    tabBarOptions={{
      activeBackgroundColor: "red",
      activeTintColor: "black",
      inactiveTintColor: "gray",
      keyboardHidesTabBar: true,
      style: {
        backgroundColor: "black",
        height: "7%",
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
  </Tabs.Navigator>
);

// Stack Navigator
const Stack = createStackNavigator();

export default () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName={WELCOMESCREEN}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={WELCOMESCREEN} component={WelcomePage} />
      <Stack.Screen name={MOVIES} component={BottomTab} />
    </Stack.Navigator>
  </NavigationContainer>
);
