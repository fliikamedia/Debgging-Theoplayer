import * as React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import WelcomePage from "./src/WelcomePage";
import HomeScreen from "./src/BottomScreens/HomeScreen";
import SearchScreen from "./src/BottomScreens/SearchScreen";
import TvShowsScreen from "./src/BottomScreens/TvShowsScreen";
import MovieDetailScreen from "./src/MovieDetailScreen";
import ProfileScreen from "./src/BottomScreens/ProfileScreen";
import LoginScreen from "./src/auth/LoginScreen";
import SignupScreen from "./src/auth/SignupScreen";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import {
  MOVIES,
  HOME,
  SEARCH,
  SHOWS,
  WELCOMESCREEN,
  MOVIEDETAIL,
  PROFILESCREEN,
  LOGIN,
  SIGNUP,
} from "./constants/RouteNames";
import { COLORS } from "./constants/theme";
import firebase from "firebase";
import { firebaseConfig } from "./src/api/FirebaseConfig";

firebase.initializeApp(firebaseConfig);
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
      activeBackgroundColor: COLORS.blue,
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
    <Tabs.Screen
      name={PROFILESCREEN}
      component={ProfileScreen}
      options={{ title: " " }}
    />
  </Tabs.Navigator>
);

// Stack Navigator
const Stack = createStackNavigator();
export default () => {
  const [ready, setReady] = React.useState(false);
  const [route, setRoute] = React.useState("");

  const checkIFLoggedIn = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // console.log(user);
        setRoute(MOVIES);
        setReady(true);
      } else {
        setRoute(WELCOMESCREEN);
        setReady(true);
      }
    });
  };
  React.useEffect(() => {
    checkIFLoggedIn();
  }, []);
  console.log(route == WELCOMESCREEN);
  return !ready && route != MOVIES && route != WELCOMESCREEN ? (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <ActivityIndicator
        animating
        color={"teal"}
        size="large"
        style={{ flex: 1, position: "absolute", top: "50%", left: "45%" }}
      />
    </View>
  ) : (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={route}
        screenOptions={{
          animationEnabled: true,
          headerTintColor: "teal",
          cardStyle: { opacity: 1, backgroundColor: "black" },
          backgroundColor: "black",
        }}
        detachInactiveScreens={false}
      >
        {route == WELCOMESCREEN ? (
          <>
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
          </>
        ) : (
          <>
            <Stack.Screen
              name={MOVIES}
              component={BottomTab}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={WELCOMESCREEN}
              component={WelcomePage}
              options={{ headerShown: false }}
            />
          </>
        )}
        <Stack.Screen
          name={MOVIEDETAIL}
          component={MovieDetailScreen}
          options={{ headerShown: false }}
        />
        <Tabs.Screen
          name={LOGIN}
          component={LoginScreen}
          options={{
            title: " ",
            headerStyle: {
              backgroundColor: "black",
            },
          }}
        />
        <Tabs.Screen
          name={SIGNUP}
          component={SignupScreen}
          options={{
            title: " ",
            headerStyle: {
              backgroundColor: "black",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
