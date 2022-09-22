import React, { useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { PayWithFlutterwave } from "flutterwave-react-native";
import { useDispatch, useSelector } from "react-redux";
import { fillingProfile } from "../store/actions/user";
import { addMomoPassDetails } from "../store/actions/mobileMoneyPass";
import firebase from "firebase";
const MomoPass = ({ route }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {
    userCurrency,
    email,
    fullName,
    phoneNumber,
    amountToPay,
    planNickname,
  } = route.params;
  // console.log(user);
  /* An example function called when transaction is completed successfully or canceled */
  const handleOnRedirect = (data) => {
    console.log(data);
    if (data.status === "failed") {
      firebase.auth().onAuthStateChanged(function (isUser) {
        if (isUser) {
          isUser.getIdToken().then(function (idToken) {
            addMomoPassDetails(
              user?.user?._id,
              data,
              planNickname,
              2629743,
              idToken
            )(dispatch).then(() => {
              // fillingProfile()(dispatch);
            });
          });
        }
      });
    }
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (isUser) {
      if (isUser) {
        isUser.getIdToken().then(function (idToken) {
          addMomoPassDetails(
            user?.user?._id,
            {
              status: "failed",
              transaction_id: "null",
              tx_ref: "flw_tx_ref_QXnGWluJnA",
            },
            planNickname,
            2629743,
            idToken
          )(dispatch).then(() => {
            // fillingProfile()(dispatch);
          });
        });
      }
    });
  }, []);
  /* An example function to generate a random transaction reference */
  const generateTransactionRef = (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return `flw_tx_ref_${result}`;
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PayWithFlutterwave
        onRedirect={handleOnRedirect}
        options={{
          tx_ref: generateTransactionRef(10),
          authorization: "FLWPUBK_TEST-0ba3fc8bc0f6b72395c17db76ed4c6cb-X",
          customer: {
            email: email,
            name: fullName,
            phonenumber: phoneNumber,
          },
          amount: 1,
          currency: userCurrency,
          // payment_options: "card",
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000",
  },
});
export default MomoPass;
