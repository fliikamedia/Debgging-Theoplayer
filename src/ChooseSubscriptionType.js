import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { SUBSCRIPTIONS } from "../constants/RouteNames";

const ChooseSubscriptionType = ({ navigation }) => {
  const user = useSelector((state) => state.user);

  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate(SUBSCRIPTIONS)}>
        <Text style={{ color: "#fff" }}>Stripe</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChooseSubscriptionType;
