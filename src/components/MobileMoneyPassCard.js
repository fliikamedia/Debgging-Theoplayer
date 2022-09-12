import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import firebase from "firebase";
import { useStripe } from "@stripe/stripe-react-native";
import expressApi from "../api/expressApi";
import { fillingProfile, loggedIn } from "../../store/actions/user";
import { useSelector, useDispatch } from "react-redux";
import {
  GET_MY_SUBSCRIPTION,
  GET_MY_SUBSCRIPTION_SUCCESS,
  GET_MY_SUBSCRIPTION_FAILED,
} from "../../store/actions/subscriptions";
import { useNavigation } from "@react-navigation/native";
import { MOMOPASSCLIENTDETAILS } from "../../constants/RouteNames";

const MobileMoneyPassCard = ({
  plan,
  price,
  trialText,
  description,
  btnText,
  id,
  conversionAmount,
  planNickname,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate(MOMOPASSCLIENTDETAILS, {
          conversionAmount: conversionAmount,
          //   plan: plan,
          planNickname: planNickname,
        })
      }
    >
      <Text style={styles.planText}>{plan}</Text>
      <Text style={styles.descriptionTxt}>{description}</Text>
      <Text style={styles.trialTxt}>{trialText}</Text>
      <Text style={styles.priceText}>{price}</Text>
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
export default MobileMoneyPassCard;
