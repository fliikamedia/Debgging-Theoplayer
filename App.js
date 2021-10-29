import * as React from "react";
import { View, ActivityIndicator, StatusBar} from "react-native";
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
import EditProfile from "./src/components/EditProfile";
import EpisodeDetailScreen from "./src/EpisodeDetailScreen";
import EmailSignup from "./src/auth/EmailSignup";
import BitmovinPlayer from './src/BitmovinPlayer';
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
  EDITPROFILE,
  EPISODEDETAIL, BITMOVINPLAYER, EMAILSIGNUP
} from "./constants/RouteNames";
import { COLORS } from "./constants/theme";
import firebase from "firebase";
import { firebaseConfig } from "./src/api/FirebaseConfig";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {PersistGate} from 'redux-persist/integration/react'
import {store, persistor} from './store/index'

StatusBar.setBarStyle("light-content");
if (Platform.OS === "android") {
  StatusBar.setBackgroundColor("rgba(0,0,0,0)");
  StatusBar.setTranslucent(true);
}


  // Bottom Tab Navigator
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
  
  // Stack Navigator
 
export default App = () => {
  const [ready, setReady] = React.useState(false);
  const [route, setRoute] = React.useState("");

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }else {
    firebase.app(); // if already initialized, use that one
  }
  
  const checkIFLoggedIn = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user && user.emailVerified) {
        // console.log(user);
        setRoute(MOVIES);
        setReady(true);
      } else {
        setRoute(WELCOMESCREEN);
        setReady(true);
      }
      //console.log('user',user);
    });
  };
  React.useEffect(() => {
    checkIFLoggedIn();
  }, []);

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
      <StoreProvider store={store}>
        <PersistGate persistor={persistor} loading={null}>
        <PaperProvider>
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
        </PaperProvider>
        </PersistGate>
      </StoreProvider>
    );
    
  }


