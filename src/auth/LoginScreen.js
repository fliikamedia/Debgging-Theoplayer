import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
  TextInput,
} from "react-native";
import firebase from "firebase";
import {
  EMAILSIGNUP,
  MOVIES,
  SIGNUP,
  FILLPROFILESCREEN,
  SELECTPROFILE,
} from "../../constants/RouteNames";
// import { TextInput, HelperText } from "react-native-paper";
import {
  setEmailFunc,
  getUser,
  loggedIn,
  fillingProfile,
  postGeolocation,
  selectedProfile,
} from "../../store/actions/user";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";
import NewTextInput from "../components/TextInput";
import LinearGradient from "react-native-linear-gradient";
import geoLocationApi from "../api/geoLocationApi";
import axios from "axios";
import { StackActions } from "@react-navigation/native";
import ModalComponent from "../components/ModalComponent";
const LoginScreen = ({ navigation }) => {
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [btnClicked, setBtnClicked] = useState(false);

  // console.log("before", userState.user);

  // const navigateUser = () => {
  //   if (!btnClicked) return;
  //   if (userState?.user) {
  //     loggedIn()(dispatch);
  //     setEmailFunc(email)(dispatch);
  //   } else {
  //     setBtnClicked(false);
  //     fillingProfile()(dispatch);
  //     // navigation.navigate(FILLPROFILESCREEN);
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: FILLPROFILESCREEN }],
  //     });
  //     console.log("back to false");
  //   }
  // };

  // useEffect(() => {
  //   navigateUser();
  // }, [userState.user]);
  const loginUser = async (email, password) => {
    if (!email || !password) return;
    setBtnClicked(true);
    // try {
    //   firebase
    //     .auth()
    //     .signInWithEmailAndPassword(email, password)
    //     .then(async (userCredential) => {
    //       // Signed in
    //       var user = userCredential.user;
    //       const idToken = await user.getIdToken();
    //       await getUser(user.email, idToken)(dispatch);

    //       //console.log(user);
    //       // ...
    //     })
    //     .then(async () => {
    //       await navigateUser();
    //     })
    //     .catch((error) => {
    //       var errorCode = error.code;
    //       var errorMessage = error.message;
    //       console.log(errorMessage);
    //       setError(errorMessage);
    //       setBtnClicked(false);
    //     });
    // } catch (err) {
    //   console.log(err);
    //   setBtnClicked(false);
    // }
    try {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(async (userCredential) => {
          // Signed in
          var user = userCredential.user;
          const idToken = await user.getIdToken();
          getUser(user.email, idToken)(dispatch);

          if (user) {
            selectedProfile()(dispatch);
            setEmailFunc(email)(dispatch);
            // navigation.reset({
            //   index: 0,
            //   routes: [{ name: SELECTPROFILE }],
            // });
            //  await AsyncStorage.setItem("whatPhase", "LoggedIn");
            // navigation.navigate(SELECTPROFILE);
            navigation.dispatch(StackActions.popToTop());
            navigation.dispatch(StackActions.replace(SELECTPROFILE));

            await axios
              .get(
                "https://ipgeolocation.abstractapi.com/v1/?api_key=1a9aca489f7a4011bf341eb6c3883062"
              )
              .then((response) => {
                // console.log(response.data);

                postGeolocation(email, response.data)(dispatch);
              })
              .catch((error) => {
                console.log("err 1", error);
              });
          }

          //console.log(user);
          // ...
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorMessage);
          setError(errorMessage);
          setBtnClicked(false);
        });
    } catch (err) {
      console.log(err);
    }
  };
  const inputColor = "teal";

  const resetPassword = (email) => {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(function (user) {
        alert("Please check your email...");
      })
      .catch(function (err) {
        console.log(err);
        setError(err.message);
      });
  };
  return (
    <View style={styles.container}>
      <Text
        style={{
          color: "white",
          fontSize: 20,
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        Sign in to your account
      </Text>
      <NewTextInput
        iconName="mail"
        iconSize={25}
        iconColor="darkgrey"
        type="email"
        placeholder="Enter your Email"
        label="Email"
        onChangeText={(email) => setEmail(email)}
        autoCorrect={false}
        autoCapitalize="none"
        value={email}
        // mode="outlined"
        keyboardType="email-address"
        // theme={{
        //   colors: { primary: `${inputColor}`, underlineColor: "transparent" },
        // }}
      />
      <NewTextInput
        iconName="lock"
        iconSize={25}
        iconColor="darkgrey"
        placeholder="Enter your password"
        type="password"
        value={password}
        onChangeText={(password) => setPassword(password)}
        autoCorrect={false}
        autoCapitalize="none"

        // mode="outlined"
        // theme={{
        //   colors: { primary: `${inputColor}`, underlineColor: "transparent" },
        // }}
      />
      {error ==
      "There is no user record corresponding to this identifier. The user may have been deleted." ? (
        <View>
          <Text style={{ color: "red", textAlign: "center" }}>
            No user corresponding to this Email
          </Text>
          {/*<TouchableOpacity onPress={() => navigation.navigate(SIGNUP)}>
            <Text
              style={{
                color: "aquamarine",
                textTransform: "uppercase",
                fontStyle: "italic",
                fontWeight: "bold",
                fontSize: 16,
                textDecorationLine: "underline",
                textAlign: "center",
                marginTop: 10,
              }}
            >
              create an account?
            </Text>
            </TouchableOpacity>*/}
        </View>
      ) : null}
      {error == "The email address is badly formatted." ? (
        <View>
          <Text style={{ color: "red", textAlign: "center" }}>
            Please enter a valid email
          </Text>
          {/*<TouchableOpacity onPress={() => navigation.navigate(SIGNUP)}>
            <Text
              style={{
                color: "aquamarine",
                textTransform: "uppercase",
                fontStyle: "italic",
                fontWeight: "bold",
                fontSize: 16,
                textDecorationLine: "underline",
                textAlign: "center",
                marginTop: 10,
              }}
            >
              create an account?
            </Text>
            </TouchableOpacity>*/}
        </View>
      ) : null}
      {error ==
      "The password is invalid or the user does not have a password." ? (
        <View>
          <Text style={{ color: "red", textAlign: "center" }}>
            Invalid Password
          </Text>
          {/*<TouchableOpacity onPress={() => resetPassword(email)}>
            <Text
              style={{
                color: "aquamarine",
                textTransform: "uppercase",
                fontStyle: "italic",
                fontWeight: "bold",
                fontSize: 16,
                textDecorationLine: "underline",
                textAlign: "center",
                marginTop: 10,
              }}
            >
              Reset password?
            </Text>
            </TouchableOpacity>*/}
        </View>
      ) : null}
      {!email && error == "The email address is badly formatted." ? (
        <View>
          <Text style={{ color: "red", textAlign: "center" }}>
            Please enter your email first
          </Text>
          {/*<TouchableOpacity onPress={() => resetPassword(email)}>
            <Text
              style={{
                color: "aquamarine",
                textTransform: "uppercase",
                fontStyle: "italic",
                fontWeight: "bold",
                fontSize: 16,
                textDecorationLine: "underline",
                textAlign: "center",
                marginTop: 10,
              }}
            >
              Reset password?
            </Text>
            </TouchableOpacity>*/}
        </View>
      ) : null}

      <TouchableOpacity
        onPress={() => {
          loginUser(email, password);
        }}
        style={styles.loginBtn}
        disabled={(!email && !password) || btnClicked}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          // colors={["#483D8B", "#1E90FF", "#87CEEB"]}
          colors={["#191960", "#0000FF", "#4169E1"]}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Sign in
          </Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => resetPassword(email)}
        style={styles.signinBtn}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            textAlign: "center",
            marginTop: 30,
          }}
        >
          Forgot password ?
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate(EMAILSIGNUP)}
        style={styles.signinBtn}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            textAlign: "center",
          }}
        >
          Create Account
        </Text>
      </TouchableOpacity>
      <ModalComponent isVisible={btnClicked} type="loader" />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
  textInput: {
    color: "white",
    width: Dimensions.get("window").height < 900 ? "90%" : "70%",
    alignSelf: "center",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  loginBtn: {
    marginTop: 20,
    height: 60,
    width: Dimensions.get("window").height < 900 ? "90%" : "70%",
    // backgroundColor: "mediumseagreen",
    // alignItems: "center",
    // justifyContent: "center",
    borderRadius: 5,
    alignSelf: "center",
  },
  signinBtn: {
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
});
export default LoginScreen;
