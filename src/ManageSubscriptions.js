import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Awesome from "react-native-vector-icons/FontAwesome";
import firebase from "firebase";
import {
  cancelSubscription,
  getSubscriptions,
} from "../store/actions/subscriptions";
import expressApi from "./api/expressApi";
import ModalComponent from "./components/ModalComponent";
const ManageSubscriptions = () => {
  const dispatch = useDispatch();
  const subscriptions_state = useSelector((state) => state.subscriptions);

  const user_state = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  //   console.log(subscriptions_state);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.getIdToken().then(function (idToken) {
          getSubscriptions(
            user_state.user.stripe_customer_id,
            idToken
          )(dispatch);
        });
      }
    });
  }, [user_state.user.stripe_customer_id]);
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
  const parseCurr = (value) => "$" + (value / 100).toFixed(2);

  function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t.toDateString();
  }

  const cancelSubscription = () => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.getIdToken().then(async function (idToken) {
          // cancelSubscription(
          //   subscriptions_state.mySubscriptions.subscriptions.data[0]
          //     .id,
          //   idToken
          // )();
          console.log(
            idToken,
            subscriptions_state.mySubscriptions.subscriptions.data[0].id
          );
          try {
            const result = await expressApi.post(
              "/mobile-subs/cancel-subscriptions",
              {
                subscriptionId:
                  subscriptions_state.mySubscriptions.subscriptions.data[0].id,
              },
              {
                headers: {
                  authtoken: idToken,
                },
              }
            );
            console.log(result);
            if (result.status === 200) {
              setShowModal(true);
            }
          } catch (err) {
            console.log(err);
          }
        });
      }
    });
  };
  let cardDetails;
  let plan;
  let periodEnd;
  try {
    cardDetails =
      user_state?.user?.subscriptions[0]?.subscriptions?.data[0]
        ?.default_payment_method?.card;
    plan = user_state?.user?.subscriptions[0]?.subscriptions?.data[0].plan;
    periodEnd =
      user_state?.user?.subscriptions[0]?.subscriptions?.data[0]
        ?.current_period_end;
  } catch (err) {
    console.log(err);
    cardDetails = {};
    plan = {};
    periodEnd = null;
  }
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Text style={styles.header}>Current Plan</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "95%",
          paddingLeft: 10,
        }}
      >
        <Text style={styles.descriptionTxt}>{plan.nickname}</Text>
        <Text style={styles.priceText}>
          {parseCurr(plan.amount)}
          {dynamicSlash(plan.nickname)}
        </Text>
      </View>
      <Text
        style={{
          color: "#fff",
          fontFamily: "Sora-Regular",
          fontSize: 16,
          marginLeft: 10,
        }}
      >{`Your plan renews on ${toDateTime(periodEnd)}`}</Text>
      {/* Buttons */}
      <View>
        <TouchableOpacity
          style={styles.cancelBTN}
          onPress={() => cancelSubscription()}
        >
          <Text style={styles.cancelBtnTxt}>Cancel Subscription</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator}></View>

      <Text style={styles.header}>Payment Method</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          //   justifyContent: "space-evenly",
          paddingLeft: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Awesome name="cc-visa" size={30} color="#fff" />
          <Text
            style={{ color: "#fff", marginLeft: 10 }}
          >{`*****${cardDetails.last4}`}</Text>
        </View>
        <View>
          <Text
            style={{ color: "#fff", marginLeft: 30 }}
          >{`Expires ${cardDetails.exp_month}/${cardDetails.exp_year}`}</Text>
        </View>
      </View>
      <ModalComponent
        type="update-password"
        isVisible={showModal}
        text="Subscription Canceled successfully!"
        setShowModal={setShowModal}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontFamily: "Sora-Bold",
    fontSize: 20,
    color: "#A9A9A9",
    marginBottom: 20,
  },
  separator: {
    width: "95%",
    height: 1,
    backgroundColor: "#505050",
    alignSelf: "center",
    marginVertical: 30,
  },
  planText: {
    color: "#fff",
    fontFamily: "Sora-Regular",
    fontSize: 20,
    // textAlign: "center",
  },
  priceText: {
    color: "#fff",
    fontFamily: "Sora-Regular",
    fontSize: 20,
    // textAlign: "center",
    marginBottom: 7,
  },
  trialTxt: {
    color: "#89CFF0",
    fontFamily: "Sora-Regular",
    fontSize: 16,
    // textAlign: "center",
  },
  descriptionTxt: {
    color: "#fff",
    fontFamily: "Sora-Regular",
    fontSize: 18,
    // textAlign: "center",
    // width: "80%",
  },
  cancelBTN: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 50,
  },
  cancelBtnTxt: {
    fontFamily: "Sora-Regular",
    fontSize: 16,
    color: "red",
  },
});
export default ManageSubscriptions;
