import React, { useState, useCallback, useEffect } from "react";
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
  RefreshControl,
  Modal,
  Pressable,
} from "react-native";
import UserProfile from "../components/UserProfile";
import { useSelector, useDispatch } from "react-redux";
import {
  addProfile,
  loggedOut,
  getUser,
  changeProfileNew,
} from "../../store/actions/user";
import { ACCOUNTSETTINGS, WELCOMESCREEN } from "../../constants/RouteNames";
import firebase from "firebase";
import profileImgs from "../../constants/profileImgs";
import { COLORS, SIZES, icons } from "../../constants";
import IconAnt from "react-native-vector-icons/AntDesign";
import IconFeather from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-community/async-storage";
import FastImage from "react-native-fast-image";
import { removeProfileError } from "../../store/actions/user";
import ModalComponent from "../components/ModalComponent";
import Spinner from "react-native-spinkit";
import { useTranslation } from "react-i18next";

const ProfileScreen = ({ navigation, route }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [imageName, setImageName] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          user.getIdToken().then(function (idToken) {
            getUser(user.email, idToken)(dispatch);
          });
        }
      });
    });
    return () => unsubscribe();
  }, [navigation]);
  let profilesLength;
  try {
    profilesLength = user.user.profiles.length;
  } catch (err) {}
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
  const onRefresh = useCallback(() => {
    // console.log("using", user.currentProfile.name);
    // setRefreshing(true);
    // getSeries();
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.getIdToken().then(function (idToken) {
          // <------ Check this line
          // alert(idToken); // It shows the Firebase token now
          // setAuthToken(idToken);
          getUser(user.email, idToken)(dispatch);
        });
      }
    });
  }, []);
  const creatingProfile = () => {
    if (name) {
      setName("");
      setImageName("");
      addProfile(user.user._id, name, imageName)(dispatch);
      setCreating(false);
    } else {
      Alert.alert("", "Please Select a profile name first", [
        { text: "Ok", cancelable: true },
      ]);
    }
  };
  const createProfile = () => {
    if (creating) {
      return (
        <View>
          <UserProfile
            navigation={navigation}
            image={imageName}
            editing={editing}
            setEditing={setEditing}
            main={false}
            name=""
            navigate={true}
          />
          <TextInput
            placeholder={t("common:name")}
            placeholderTextColor="white"
            style={styles.input}
            onChangeText={(newValue) => setName(newValue)}
            value={name}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 20,
              marginHorizontal: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Sora-Regular",
                fontSize: 16,
              }}
            >
              {t("common:selectImg")}
            </Text>
            <Image
              source={icons.right_arrow}
              style={{
                height: 20,
                width: 20,
                tintColor: "teal",
              }}
            />
          </View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={profileImgs}
            keyExtractor={(item) => item}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => setImageName(item)}>
                <FastImage
                  source={{ uri: item }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 120,
                    marginLeft: 20,
                  }}
                />
              </TouchableOpacity>
            )}
          />
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.save}
              onPress={() => creatingProfile()}
            >
              <Text style={{ color: "white", fontSize: 18 }}>
                {" "}
                {t("common:save")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancel}
              onPress={() => {
                setImageName("");
                setCreating(false);
              }}
            >
              <Text style={{ color: "white", fontSize: 18 }}>
                {" "}
                {t("common:cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (editing) {
      return (
        <View>
          {/*     <UserProfile
            navigation={navigation}
            main={true}
            name={user.user.firstName}
            image={user.user.profileImage || ''}
            editing={editing}
            setEditing={setEditing}
          /> */}
          <View style={styles.profilesContainer}>
            {user?.user?.profiles?.map((item) => {
              return (
                <UserProfile
                  navigation={navigation}
                  editing={editing}
                  setEditing={setEditing}
                  main={item.name === user.user.firstName}
                  key={item.name}
                  name={item.name}
                  image={item.image}
                  profileId={item._id}
                  navigate={true}
                />
              );
            })}
          </View>
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
                fontFamily: "Sora-Regular",
                color: "#fff",
                textAlign: "center",
                marginBottom: 30,
                marginTop: 20,
              }}
            >
              {t("common:whosWatching")}
            </Text>
            {/*    <UserProfile
              editing={editing}
              setEditing={setEditing}
              main={true}
              name={user.user.firstName}
              image={user.user.profileImage}
            /> */}
            <View style={styles.profilesContainer}>
              {user?.user?.profiles?.map((item) => {
                return (
                  <UserProfile
                    editing={editing}
                    setEditing={setEditing}
                    main={item.name === user.user.firstName}
                    key={item.name}
                    name={item.name}
                    image={item.image}
                    profileId={item._id}
                    navigation={navigation}
                    navigate={true}
                  />
                );
              })}
            </View>
            {profilesLength < 3 ? (
              <TouchableOpacity
                onPress={() => setCreating(true)}
                style={{ alignSelf: "center" }}
              >
                <IconAnt name="pluscircleo" size={60} color="grey" />
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity
            onPress={() => setEditing(true)}
            style={{
              height: 50,
              width: 160,
              borderWidth: 2,
              borderColor: "#6495ED",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
              alignSelf: "center",
              marginTop: 30,
              backgroundColor: "transparent",
            }}
          >
            <Text style={{ color: "white", fontFamily: "Sora-Bold" }}>
              {t("common:manageProfiles")}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "black",
      }}
      refreshControl={
        <RefreshControl
          tintColor={"#fff"}
          backgroundColor={"#000"}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      {/* {user.isFetching || user.isProfileFetching ? (
      
      ) : ( */}
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            width: "95%",
            justifyContent: "flex-end",
            alignSelf: "center",
            // marginTop: 50,
            alignItems: "center",
          }}
        >
          {/* <TouchableOpacity onPress={() => navigation.goBack()}>
            <IconFeather name="arrow-left" size={30} color="#fff" />
          </TouchableOpacity> */}
          {/* <TouchableOpacity
            onPress={() => navigation.navigate(ACCOUNTSETTINGS)}
          >
            <Icon name="settings" size={35} color="white" />
          </TouchableOpacity> */}
        </View>
        <View style={{ flex: 1, justifyContent: "center", marginBottom: 100 }}>
          {createProfile()}
        </View>
      </View>
      {/* )} */}
      <ModalComponent
        isVisible={user.profileNotFoundError}
        text="Oops, Profile not found!"
      />
      {/* {route.name === "Profile Screen" && (
        <ModalComponent
          isVisible={user.isFetching || user.isProfileFetching}
          type="loader"
        />
      )} */}
      {user.isFetching ||
        (user.isProfileFetching && (
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <Spinner
              isVisible={user.isFetching || user.isProfileFetching}
              size={70}
              type={"ThreeBounce"}
              color={"#fff"}
            />
          </View>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    width: "90%",
    height: 60,
    alignSelf: "center",
    borderRadius: 5,
    padding: 10,
    fontSize: 20,
    color: "white",
    marginBottom: 20,
  },
  btnContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  save: {
    height: 60,
    width: 130,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  cancel: {
    height: 60,
    width: 130,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  profilesContainer: {
    flexDirection: "row",
    width: "70%",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignSelf: "center",
    // backgroundColor: "red",
  },
});
export default ProfileScreen;
