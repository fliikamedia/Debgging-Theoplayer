import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import UserProfile from "./components/UserProfile";
import { useSelector, useDispatch } from "react-redux";
import {
  PROFILESCREEN,
  SUBSCRIPTIONS,
  WATCHLIST,
} from "../constants/RouteNames";
import { loggedOut } from "../store/actions/user";
import firebase from "firebase";
import Icon from "react-native-vector-icons/AntDesign";
const AccountSettings = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [editing, setEditing] = useState(false);
  const accountItems = [
    { title: "Watchlist", func: () => navigation.navigate(WATCHLIST) },
    { title: "App Settings", func: () => console.log("click") },
    { title: "Account", func: () => navigation.navigate(SUBSCRIPTIONS) },
    {
      title: "Switch Profiles",
      func: () => navigation.navigate(PROFILESCREEN),
    },
    { title: "Legal", func: () => console.log("click") },
    { title: "Help", func: () => console.log("click") },
    { title: "Log Out", func: () => logOut() },
  ];

  const logOut = async () => {
    // await AsyncStorage.setItem("whatPhase", "Null");
    try {
      await firebase.auth().signOut();
      loggedOut()(dispatch);
      //navigation.navigate(WELCOMESCREEN);
    } catch (err) {
      Alert.alert(
        "There is something wrong! Please try again later",
        err.message
      );
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profilesContainer}>
        {/* {user?.currentProfile?.map((item) => { */}
        {/* return ( */}
        <UserProfile
          editing={editing}
          setEditing={setEditing}
          main={user?.currentProfile?.name === user.user.firstName}
          key={user?.currentProfile?.name}
          name={user?.currentProfile?.name}
          image={user?.currentProfile?.image}
          profileId={user?.currentProfile?._id}
          from="settings"
          navigation={navigation}
          navigate={false}
        />
        {/* ); */}
        {/* })} */}
      </View>
      <View style={styles.itemsContainer}>
        {accountItems.map((item, index) => (
          <TouchableOpacity
            style={styles.itemContainer}
            key={index}
            onPress={item.func}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Icon name="right" size={20} color="#fff" />
          </TouchableOpacity>
        ))}
        <Text style={styles.version}>Version: 1.0.1</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000",
    paddingBottom: 100,
  },
  profilesContainer: {
    flexDirection: "row",
    marginTop: 60,
    // width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  itemsContainer: {
    width: "95%",
    alignSelf: "center",
    // marginVertical: 15,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginVertical: 15,
    height: 70,
    borderBottomColor: "grey",
    borderBottomWidth: 0.5,
  },
  title: {
    color: "#fff",
    fontSize: 20,
  },
  version: {
    fontSize: 16,
    color: "#A9A9A9",
    marginTop: 20,
  },
});
export default AccountSettings;
