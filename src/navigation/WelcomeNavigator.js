import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomePage from "../WelcomePage";
import LoginScreen from "../auth/LoginScreen";
import FillProfileScreen from "../auth/FillProfileScreen";
import EmailSignup from "../auth/EmailSignup";
import SelectProfile from "../SelectProfile";
import {
  WELCOMESCREEN,
  LOGIN,
  FILLPROFILESCREEN,
  EMAILSIGNUP,
  SELECTPROFILE,
} from "../../constants/RouteNames";

const Stack = createStackNavigator();
export default WelcomeNavigator = (props) => {
  return (
    <Stack.Navigator
      mode="modal"
      initialRouteName={props.routeName}
      screenOptions={{
        headerBackTitleVisible: false,
        animationEnabled: false,
        headerTintColor: "#fff",
        headerStyle: {
          backgroundColor: "black",
          shadowColor: "transparent", // this covers iOS
          elevation: 0, // this covers Android
        },
        cardStyle: { opacity: 1, backgroundColor: "black" },
        backgroundColor: "black",
        cardStyle: { backgroundColor: "transparent" },
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
        name={WELCOMESCREEN}
        component={WelcomePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={EMAILSIGNUP}
        component={EmailSignup}
        options={{
          title: " ",
        }}
      />
      <Stack.Screen
        name={LOGIN}
        component={LoginScreen}
        options={{
          title: " ",
        }}
      />
      <Stack.Screen
        name={FILLPROFILESCREEN}
        component={FillProfileScreen}
        options={{
          title: " ",
        }}
      />
      <Stack.Screen
        name={SELECTPROFILE}
        component={SelectProfile}
        options={{
          title: " ",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
