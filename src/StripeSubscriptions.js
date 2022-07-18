import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import {
  getSubscriptions,
  getStripePrices,
  cancelSubscription,
} from "../store/actions/subscriptions";
import { useSelector, useDispatch } from "react-redux";
import { useStripe } from "@stripe/stripe-react-native";
import expressApi from "./api/expressApi";
import { fillingProfile } from "../store/actions/user";
import firebase from "firebase";
const Subscriptions = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const subscriptions_state = useSelector((state) => state.subscriptions);
  const stripe = useStripe();
  console.log("subsc state", user.user._id);
  // console.log("subsc state");

  useEffect(() => {
    getStripePrices()(dispatch);
  }, []);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.getIdToken().then(function (idToken) {
          // getSubscriptions(user.user.stripe_customer_id, idToken)(dispatch);
        });
      }
    });
  }, [user.user.stripe_customer_id]);

  const subscribe = async (priceId) => {
    try {
      const idToken = await firebase.auth().currentUser.getIdToken();
      const response = await expressApi.post(
        "/mobile-subs/create-subscription",
        {
          customerId: user.user.stripe_customer_id,
          priceId: priceId,
        },
        {
          headers: {
            authtoken: idToken,
          },
        }
      );
      const { data } = response;
      console.log(response.status);
      if (response.status !== 200) return Alert.alert(data.message);
      const clientSecret = data.clientSecret;
      console.log("clientSecret", clientSecret);
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Fliika",
      });
      if (initSheet.error) return Alert.alert(initSheet.error.message);
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret,
      });
      if (presentSheet.error) return Alert.alert(presentSheet.error.message);

      // Alert.alert("Payment complete, thank you!");
      const result = await expressApi.post(
        "/mobile-subs/get-subscriptions",
        {
          customerId: user.user.stripe_customer_id,
        },
        {
          headers: {
            authtoken: idToken,
          },
        }
      );

      const subscription_response = await expressApi.post(
        "/mobile-subs/update-subscription-after-success",
        { userId: user.user._id, subscription: result.data },
        {
          headers: {
            authtoken: idToken,
          },
        }
      );
      fillingProfile()(dispatch);
    } catch (err) {
      console.error(err);
      Alert.alert("Something went wrong, try again later!");
    }
  };

  const showSubscriptions = () => {
    return (
      <View>
        {subscriptions_state.subscriptions.map((subscription, index) => (
          <View key={index}>
            <TouchableOpacity
              onPress={() =>
                firebase.auth().onAuthStateChanged(function (user) {
                  if (user) {
                    user.getIdToken().then(function (idToken) {
                      subscribe(subscription.id, idToken);
                    });
                  }
                })
              }
              style={{ padding: 30, borderWidth: 1, borderColor: "blue" }}
            >
              <Text style={{ color: "#fff" }}>{subscription.nickname}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };
  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
              user.getIdToken().then(function (idToken) {
                cancelSubscription(
                  subscriptions_state.mySubscriptions.subscriptions.data[0].id,
                  idToken
                )();
              });
            }
          })
        }
      >
        <Text style={styles.text}>Cancel</Text>
      </TouchableOpacity>
      {!subscriptions_state?.isFetching &&
      subscriptions_state.subscriptions?.length == 2
        ? showSubscriptions()
        : null}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "#fff",
  },
});
export default Subscriptions;
