import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import firebase from "firebase";
import { useStripe } from "@stripe/stripe-react-native";
import expressApi from "../api/expressApi";
import { fillingProfile } from "../../store/actions/user";
import { useSelector, useDispatch } from "react-redux";
const SubscriptionCard = ({
  plan,
  price,
  trialText,
  description,
  btnText,
  id,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const subscriptions_state = useSelector((state) => state.subscriptions);
  const stripe = useStripe();
  const dynamicDescription = (plan) => {
    if (plan === "Fliika Yearly") {
      return "Annual Plan";
    } else if (plan === "Fliika Monthly") {
      return "Monthly Plan";
    }
  };
  //   console.log(id);
  const dynamicSlash = (plan) => {
    if (plan === "Fliika Yearly") {
      return "/year";
    } else if (plan === "Fliika Monthly") {
      return "/month";
    }
  };

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
  const parseCurr = (value) => "$" + (value / 100).toFixed(2);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            user.getIdToken().then(function (idToken) {
              subscribe(id, idToken);
            });
          }
        })
      }
    >
      <Text style={styles.planText}>{dynamicDescription(plan)}</Text>
      <Text style={styles.descriptionTxt}>{description}</Text>
      <Text style={styles.trialTxt}>{trialText}</Text>
      <Text style={styles.priceText}>
        {parseCurr(price)}
        {dynamicSlash(plan)}
      </Text>

      {/* <TouchableOpacity style={styles.btnContainer}>
        <Text style={styles.buttonText}>{btnText}</Text>
      </TouchableOpacity> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
    height: 200,
    backgroundColor: "#000",
    marginBottom: 30,
    borderRadius: 15,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-around",
  },
  planText: {
    color: "#fff",
    fontFamily: "Sora-Regular",
    fontSize: 20,
    textAlign: "center",
  },
  priceText: {
    color: "#fff",
    fontFamily: "Sora-Regular",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 7,
  },
  trialTxt: {
    color: "#89CFF0",
    fontFamily: "Sora-Regular",
    fontSize: 16,
    textAlign: "center",
  },
  descriptionTxt: {
    color: "#fff",
    fontFamily: "Sora-Regular",
    fontSize: 14,
    textAlign: "center",
    width: "80%",
  },
  btnContainer: {
    borderWidth: 1,
    borderColor: "#89CFF0",
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Sora-Regular",
    fontSize: 20,
    marginBottom: 5,
  },
});
export default SubscriptionCard;
