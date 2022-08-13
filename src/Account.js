import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { UPDATEPASSWORD } from "../constants/RouteNames";
const Account = ({ navigation }) => {
  const user = useSelector((state) => state.user);
  return (
    <View>
      <View style={styles.itemContainer}>
        <Text style={styles.item}>{user.email}</Text>
        {/* <Text style={styles.change}>Change</Text> */}
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.item}>Password: ********</Text>
        <TouchableOpacity onPress={() => navigation.navigate(UPDATEPASSWORD)}>
          <Text style={styles.change}>Change</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    width: "90%",
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#A9A9A9",
  },
  item: {
    color: "#fff",
    fontFamily: "Sora-Regular",
    fontSize: 16,
    // marginTop: 10,
  },
  change: {
    color: "#A9A9A9",
  },
});
export default Account;
