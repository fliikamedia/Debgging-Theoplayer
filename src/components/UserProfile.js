import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { setProfile } from "../../store/actions/user";
import { useDispatch, useSelector } from "react-redux";
import {
  removeProfile,
  changeProfile,
  loggedIn,
  changeProfileNew,
} from "../../store/actions/user";
import { EDITPROFILE } from "../../constants/RouteNames";
import IconAnt from "react-native-vector-icons/AntDesign";
import IconAwesome from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-community/async-storage";
import FastImage from "react-native-fast-image";
import IconMaterial from "react-native-vector-icons/MaterialIcons";

const UserProfile = ({
  name,
  main,
  editing,
  image,
  navigation,
  setEditing,
  profileId,
  from,
  navigate,
}) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  let borderColor;
  try {
    if (name == user.currentProfile.name) {
      borderColor = "#6495ED";
    } else {
      borderColor = "grey";
    }
  } catch (err) {}
  const container = {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
    height:
      from === "settings"
        ? Dimensions.get("window").width * 0.2
        : Dimensions.get("window").width * 0.3,
    borderRadius: from === "settings" ? 24 : 34,
    width:
      from === "settings"
        ? Dimensions.get("window").width * 0.2
        : Dimensions.get("window").width * 0.3,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: borderColor,
  };

  return (
    <View style={{ alignItems: "center", marginVertical: 10 }}>
      <TouchableOpacity
        onPress={async () => {
          // changeProfile(user, profileId)(dispatch);
          setProfile(name)(dispatch);
          changeProfileNew(
            user.email,
            profileId,
            navigation,
            navigate
          )(dispatch);
          await AsyncStorage.setItem("profileName", name);
          if (from && from === "select") {
            loggedIn()(dispatch);
          }
        }}
        style={container}
      >
        {image ? (
          <>
            <FastImage
              style={{
                width: "100%",
                height: undefined,
                aspectRatio: 1,
                borderRadius: from === "settings" ? 24 : 34,
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
                  borderRadius: from === "settings" ? 24 : 34,
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
                  borderRadius: from === "settings" ? 24 : 34,
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
            // flexDirection: "row",
            // width: "100%",
            justifyContent: "space-between",
            marginVertical: 20,
          }}
        >
          {/* <Text style={{ color: "white", fontSize: 12 }}>Remove</Text> */}
          <TouchableOpacity
            onPress={() => removeProfile(user.user._id, profileId)(dispatch)}
          >
            {/* <IconAnt name="delete" size={30} color="white" /> */}
            <IconMaterial name="delete" size={45} color="red" />
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
