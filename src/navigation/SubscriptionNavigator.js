import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { SUBSCRIPTIONS, SELECTSUBSCRIPTION } from "../../constants/RouteNames";
import ChooseSubscriptionType from "../ChooseSubscriptionType";
import Subscriptions from "../StripeSubscriptions";
const Stack = createStackNavigator();
export default SubscriptionNavigator = (props) => {
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
        name={SELECTSUBSCRIPTION}
        component={ChooseSubscriptionType}
        options={{
          headerShown: true,
          headerTitle: "Subscriptions",
          headerTitleAlign: "center",
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name={SUBSCRIPTIONS}
        component={Subscriptions}
        options={{
          headerShown: true,
          headerTitle: "Stripe",
          headerTitleAlign: "center",
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
};
