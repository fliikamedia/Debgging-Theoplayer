import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  Image,
} from "react-native";
import UserProfile from "../components/UserProfile";
import { useSelector, useDispatch } from "react-redux";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { addProfile } from "../../store/actions/user";
import { WELCOMESCREEN } from "../../constants/RouteNames";
import firebase from "firebase";
import profileImgs from "../../constants/profileImgs";
const ProfileScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  let profilesLength;
  try {
    profilesLength = user.user.profiles.length;
  } catch (err) {}

  const logOut = async () => {
    try {
      await firebase.auth().signOut();
      navigation.navigate(WELCOMESCREEN);
    } catch (err) {
      Alert.alert(
        "There is something wrong! Please try again later",
        err.message
      );
    }
  };
  const profileImg1 = require("../../assets/profileImg/profile1.jpg");
  const creatingProfile = () => {
    if (name) {
      setName("");
      addProfile(user.email, name, "profile1")(dispatch);
      setCreating(false);
    } else {
      Alert.alert("", "Please Select a name first", [
        { text: "Ok", cancelable: true },
      ]);
    }
  };
  const createProfile = () => {
    if (creating) {
      return (
        <View>
          <UserProfile editing={editing} main={false} name="" />
          <TextInput
            placeholder="Name"
            placeholderTextColor="white"
            style={styles.input}
            onChangeText={(newValue) => setName(newValue)}
            value={name}
          />
          <FlatList
            horizontal
            data={profileImgs}
            keyExtractor={(item) => item.name}
            renderItem={({ item, index }) => (
              <TouchableOpacity>
                <Image
                  source={item.path}
                  style={{ width: 100, height: 100, marginLeft: 20 }}
                />
              </TouchableOpacity>
            )}
          />
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.save}
              onPress={() => creatingProfile()}
            >
              <Text style={{ color: "white", fontSize: 18 }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancel}
              onPress={() => {
                setCreating(false);
              }}
            >
              <Text style={{ color: "white", fontSize: 18 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (editing) {
      return (
        <View>
          {user.user.profiles.map((item) => {
            return (
              <UserProfile
                editing={editing}
                main={false}
                key={item.name}
                name={item.name}
                image={item.image}
              />
            );
          })}
          <View>
            <TouchableOpacity
              onPress={() => setEditing(false)}
              style={{
                alignSelf: "center",
                width: 100,
                height: 50,
                borderWidth: 2,
                borderColor: "teal",
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <Text style={{ color: "white" }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <View>
            <Text
              style={{
                fontSize: 24,
                color: "teal",
                textAlign: "center",
                marginBottom: 30,
                marginTop: 20,
              }}
            >
              Who's Watching ?
            </Text>
            <UserProfile
              editing={editing}
              main={true}
              name={user.user.fullName}
              image={user.image}
            />
            {user.user.profiles.map((item) => {
              return (
                <UserProfile
                  editing={editing}
                  main={false}
                  key={item.name}
                  name={item.name}
                  image={item.image}
                />
              );
            })}
            {profilesLength < 2 ? (
              <TouchableOpacity
                onPress={() => setCreating(true)}
                style={{ alignSelf: "center" }}
              >
                <AntDesign name="pluscircleo" size={60} color="grey" />
              </TouchableOpacity>
            ) : null}
          </View>
          {profilesLength > 0 ? (
            <TouchableOpacity
              onPress={() => setEditing(true)}
              style={{
                height: 50,
                width: 160,
                borderWidth: 2,
                borderColor: "white",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
                alignSelf: "center",
                marginTop: 30,
                backgroundColor: "teal",
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Manage Profiles
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            width: "95%",
            justifyContent: "space-between",
            alignSelf: "center",
            marginTop: 40,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={40} color="teal" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => logOut()}>
            <MaterialCommunityIcons name="logout" size={40} color="white" />
          </TouchableOpacity>
        </View>
        {
          <View style={{ flex: 1, justifyContent: "center" }}>
            {createProfile()}
          </View>
        }
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  input: {
    backgroundColor: "grey",
    width: "90%",
    height: 60,
    alignSelf: "center",
    borderRadius: 5,
    padding: 10,
  },
  btnContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  save: {
    height: 60,
    width: 120,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  cancel: {
    height: 60,
    width: 120,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});
export default ProfileScreen;
