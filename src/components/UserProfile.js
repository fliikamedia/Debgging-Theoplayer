import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { setProfile } from "../../store/actions/user";
import { useDispatch, useSelector } from "react-redux";
import { removeProfile, changeProfile } from "../../store/actions/user";
import { EDITPROFILE } from "../../constants/RouteNames";
import IconAnt from "react-native-vector-icons/AntDesign";
import IconAwesome from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-community/async-storage";

const UserProfile = ({
  name,
  main,
  editing,
  image,
  navigation,
  setEditing,
  profileId,
}) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  let borderColor;
  try {
    if (name == user.currentProfile.name) {
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
    marginBottom: 5,
    borderWidth: 4,
    borderColor: borderColor,
  };

  // let profileImg;

  // if (image == "profile1") {
  //   profileImg = require(`../../assets/profileImg/profile1.jpg`);
  // } else if (image == "profile2") {
  //   profileImg = require(`../../assets/profileImg/profile2.jpg`);
  // } else if (image == "profile3") {
  //   profileImg = require(`../../assets/profileImg/profile3.jpg`);
  // } else if (image == "profile4") {
  //   profileImg = require(`../../assets/profileImg/profile4.jpg`);
  // } else if (image == "profile5") {
  //   profileImg = require(`../../assets/profileImg/profile5.jpg`);
  // } else if (image == "profile6") {
  //   profileImg = require(`../../assets/profileImg/profile6.jpg`);
  // } else if (image == "profile7") {
  //   profileImg = require(`../../assets/profileImg/profile7.jpg`);
  // }

  return (
    <View style={{ alignItems: "center", marginVertical: 10 }}>
      <TouchableOpacity
        onPress={async () => {
          changeProfile(user, profileId)(dispatch);
          setProfile(name)(dispatch);
          await AsyncStorage.setItem("profileName", name);
        }}
        style={container}
      >
        {image ? (
          <>
            <Image
              style={{
                width: "100%",
                height: undefined,
                aspectRatio: 1,
                borderRadius: 120,
              }}
              source={{ uri: image }}
            />
            {editing ? (
              <TouchableOpacity
                onPress={() => {
                  setEditing(false),
                    navigation.navigate(EDITPROFILE, {
                      main: main,
                      profileName: name,
                      imageTitle: image,
                      profileId: profileId,
                    });
                }}
                style={{
                  position: "absolute",
                  backgroundColor: "darkgrey",
                  height: "100%",
                  width: "100%",
                  borderRadius: 120,
                  opacity: 0.7,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconAwesome name="edit" size={40} color="white" />
              </TouchableOpacity>
            ) : null}
          </>
        ) : (
          <>
            <IconAwesome name="user" size={50} color="white" />
            {editing ? (
              <TouchableOpacity
                style={{
                  position: "absolute",
                  backgroundColor: "darkgrey",
                  height: "100%",
                  width: "100%",
                  borderRadius: 120,
                  opacity: 0.7,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  setEditing(false),
                    navigation.navigate(EDITPROFILE, {
                      main: main,
                      profileName: name,
                      imageTitle: image,
                      profileId: profileId,
                    });
                }}
              >
                <IconAwesome name="edit" size={40} color="white" />
              </TouchableOpacity>
            ) : null}
          </>
        )}
      </TouchableOpacity>
      <Text style={styles.name}>{name}</Text>
      {editing && !main ? (
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
            onPress={() => removeProfile(user.user._id, profileId)(dispatch)}
          >
            <IconAnt name="delete" size={30} color="white" />
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
