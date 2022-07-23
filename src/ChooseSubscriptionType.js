import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { SUBSCRIPTIONS } from "../constants/RouteNames";
import LinearGradient from "react-native-linear-gradient";
import { SIZES } from "../constants";
import Awesome from "react-native-vector-icons/FontAwesome";
import Fontisto from "react-native-vector-icons/Fontisto";
const ChooseSubscriptionType = ({ navigation }) => {
  const user = useSelector((state) => state.user);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        // start={{ x: 0.7, y: 0 }}
        //colors={["#003366", "#483D8B", "#4682B4"]}
        // colors={["#000020", "#000080", "#4682B4"]}
        // colors={["#000025", "#000020", "black"]}
        colors={["#141a5c", "#218ae3", "#0d0526"]}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <TouchableOpacity
          style={styles.stripeCard}
          onPress={() => navigation.navigate(SUBSCRIPTIONS)}
        >
          <Text style={styles.trialText}>14 days Trial</Text>
          <Text style={styles.subscribeText}>
            Subscribe with a debit or credit card
          </Text>
          <View style={styles.cardsContainer}>
            <Awesome name="cc-mastercard" size={30} color="#fff" />
            <Awesome name="cc-visa" size={30} color="#fff" />
            <Fontisto name="american-express" size={26} color="#fff" />
            <Awesome name="cc-discover" size={30} color="#fff" />
            <Fontisto name="apple-pay" size={26} color="#fff" />
            <Awesome name="cc-jcb" size={30} color="#fff" />
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // alignItems: "center",
    justifyContent: "center",
  },
  stripeCard: {
    height: SIZES.height * 0.25,
    width: "80%",
    borderRadius: 45,
    backgroundColor: "#000",
    alignItems: "center",
    marginBottom: 50,
    // marginTop: 50,
  },
  cardsContainer: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trialText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Sora-Bold",
    marginTop: 20,
    marginBottom: 10,
  },
  subscribeText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Sora-Regular",
    textAlign: "center",
    marginBottom: 30,
  },
});
export default ChooseSubscriptionType;
