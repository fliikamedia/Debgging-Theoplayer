import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
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
import LinearGradient from "react-native-linear-gradient";
import SubscriptionCard from "./components/SubscriptionCard";
import Spinner from "react-native-spinkit";
const Subscriptions = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const subscriptions_state = useSelector((state) => state.subscriptions);
  const stripe = useStripe();
  // console.log("subsc state", subscriptions_state?.subscriptions);
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
      // console.log(response.status);
      if (response.status !== 200) return Alert.alert(data.message);
      const clientSecret = data.clientSecret;
      // console.log("clientSecret", clientSecret);
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

  const showSubscription = () => {
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

  const showSubscriptions = () => {
    return (
      <View>
        {subscriptions_state.subscriptions.map((subscription, index) => (
          <SubscriptionCard
            key={index}
            plan={subscription?.nickname}
            trialText="14 days free trial"
            price={subscription?.unit_amount}
            description="Create up to 5 profiles for family members and loved ones"
            btnText="Start Free Trial"
            id={subscription.id}
          />
        ))}
      </View>
    );
  };
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        // start={{ x: 0.7, y: 0 }}
        //colors={["#003366", "#483D8B", "#4682B4"]}
        // colors={["#000020", "#000080", "#4682B4"]}
        // colors={["#000025", "#000020", "black"]}
        colors={["#141a5c", "#218ae3", "#0d0526"]}
        style={{ flex: 1, justifyContent: "center" }}
      >
        {/* <TouchableOpacity
          onPress={() =>
            firebase.auth().onAuthStateChanged(function (user) {
              if (user) {
                user.getIdToken().then(function (idToken) {
                  cancelSubscription(
                    subscriptions_state.mySubscriptions.subscriptions.data[0]
                      .id,
                    idToken
                  )();
                });
              }
            })
          }
        ></TouchableOpacity> */}
        {!subscriptions_state?.isFetching ? (
          showSubscriptions()
        ) : (
          <View style={styles.spinnerContainer}>
            <Spinner
              isVisible={subscriptions_state?.isFetching}
              size={70}
              type={"ThreeBounce"}
              color={"#fff"}
            />
          </View>
        )}
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "#fff",
  },
  spinnerContainer: {
    width: "100%",
    alignItems: "center",
  },
});
export default Subscriptions;
