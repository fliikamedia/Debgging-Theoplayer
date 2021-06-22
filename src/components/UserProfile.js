import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { setProfile, setNotProfile } from "../../store/actions/user";
import { useDispatch, useSelector } from "react-redux";
import { removeProfile } from "../../store/actions/user";
const UserProfile = ({ name, main, editing, image }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  let borderColor;
  try {
    if (name == user.profileName) {
      borderColor = "aqua";
    } else if (!user.profileName && name == user.user.fullName) {
      borderColor = "aqua";
    } else {
      borderColor = "grey";
    }
  } catch (err) {}
  const container = {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
    height: Dimensions.get("window").width * 0.3,
    borderRadius: 120,
    width: Dimensions.get("window").width * 0.3,
    borderRadius: 120,
    marginBottom: 5,
    borderWidth: 4,
    borderColor: borderColor,
  };

  let profileImg;

  if (image == "profile1") {
    profileImg = require(`../../assets/profileImg/profile1.jpg`);
  } else {
    profileImg = require(`../../assets/profileImg/profile2.jpg`);
  }
  return (
    <View style={{ alignItems: "center", marginVertical: 10 }}>
      <TouchableOpacity
        onPress={() => {
          if (main) {
            setNotProfile()(dispatch);
          } else {
            setProfile(name)(dispatch);
          }
        }}
        style={container}
      >
        {image ? (
          <Image
            style={{
              width: "100%",
              height: undefined,
              aspectRatio: 1,
              borderRadius: 120,
            }}
            source={profileImg}
          />
        ) : (
          <AntDesign name="user" size={50} color="white" />
        )}
      </TouchableOpacity>
      <Text style={styles.name}>{name}</Text>
      {editing ? (
        <View
          style={{
            flexDirection: "row",
            width: "60%",
            justifyContent: "space-between",
            marginVertical: 20,
          }}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Remove</Text>
          <TouchableOpacity
            onPress={() => removeProfile(user.email, name)(dispatch)}
          >
            <AntDesign name="delete" size={30} color="white" />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  name: {
    color: "white",
  },
});
export default UserProfile;
