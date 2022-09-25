import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import {
  SUBSCRIPTIONS,
  SELECTSUBSCRIPTION,
  MOBILEMONEY,
  MOMOPASS,
  MOMOPASSCLIENTDETAILS,
} from "../../constants/RouteNames";
import ChooseSubscriptionType from "../ChooseSubscriptionType";
import Subscriptions from "../StripeSubscriptions";
import MobileMoney from "../MobileMoney";
import MobileMoneyPassCard from "../components/MobileMoneyPassCard";
import MomoPass from "../MomoPass";
import MomoPassClientDetails from "../MomoPassClientDetails";
import { useTranslation } from "react-i18next";
const Stack = createStackNavigator();
export default SubscriptionNavigator = (props) => {
  const { t } = useTranslation();
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
          headerTitle: `${t("headers:subscriptions")}`,
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
      <Stack.Screen
        name={MOBILEMONEY}
        component={MobileMoney}
        options={{
          headerShown: true,
          headerTitle: "Mobile Money",
          headerTitleAlign: "center",
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name={MOMOPASS}
        component={MomoPass}
        options={{
          headerShown: true,
          headerTitle: "Mobile Money Pass",
          headerTitleAlign: "center",
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name={MOMOPASSCLIENTDETAILS}
        component={MomoPassClientDetails}
        options={{
          headerShown: true,
          headerTitle: "Mobile Money Pass",
          headerTitleAlign: "center",
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
};
