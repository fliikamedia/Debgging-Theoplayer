import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  AppState,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import firebase from "firebase";
import { LOGIN, MOVIES, FILLPROFILESCREEN } from "../../constants/RouteNames";
import { HelperText } from "react-native-paper";
import { LogBox } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  addUser,
  createUser,
  fillingProfile,
  subscribing,
  postGeolocation,
  setEmailFunc,
} from "../../store/actions/user";
import { useDispatch } from "react-redux";
import { firebaseConfig } from "../api/FirebaseConfig";
import AsyncStorage from "@react-native-community/async-storage";
import NewTextInput from "../components/TextInput";
import LinearGradient from "react-native-linear-gradient";
import axios from "axios";
import expressApi from "../api/expressApi";
import {
  CREATE_USER,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILED,
} from "../../store/actions/user";
import ModalComponent from "../components/ModalComponent";
// import { firestore } from "@react-native-firebase/firestore";
const EmailSignup = ({ navigation }) => {
  const appState = useRef(AppState.currentState);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [fullName, setfullName] = useState("");
  const [yearOfBirth, setYearOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [doneEmail, setDoneEmail] = useState(false);
  const [donePassword, setDonePassword] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(Date.now());
  const [signedup, setSignedup] = useState(false);
  const [btnClicked, setBtnClicked] = useState(false);

  const resetPassword = (email) => {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(function (user) {
        alert("Please check your email...");
        navigation.navigate(LOGIN);
      })
      .catch(function (e) {
        console.log(e);
      });
  };
  const signupUser = async (email, password) => {
    setEmailFunc(email)(dispatch);
    setBtnClicked(true);
    // try {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (currentUser) => {
        const { uid, emailVerified } = currentUser;
        const idToken = await firebase.auth().currentUser.getIdToken();
        const result = await expressApi.post(
          "/users/create-user",
          { email: email, uid: uid, email_verified: emailVerified },
          {
            headers: {
              authtoken: idToken,
            },
          }
        );
        // console.log(result.data);
        if (result.status === 200) {
          dispatch({ type: CREATE_USER_SUCCESS, payload: result.data });
        } else {
          dispatch({ type: CREATE_USER_FAILED });
          return;
        }
      })
      .then(async () => {
        console.log("geo");
        const response = await axios.get(
          "https://ipgeolocation.abstractapi.com/v1/?api_key=1a9aca489f7a4011bf341eb6c3883062"
        );
        // const { email } = currentUser;
        if (response.data) {
          await postGeolocation(email, response.data)(dispatch);
        }
      })
      .then(() => {
        console.log("done");
        setBtnClicked(false);
        subscribing()(dispatch);
      })
      // .then(() => {
      //   const user = firebase.auth().currentUser;

      //   const db = firebase.firestore();
      //   db.collection("collected_emails").doc(user.uid).set({
      //     email: email,
      //   });
      // })
      .catch((error) => {
        console.log("errrrrss1", error);
        setBtnClicked(false);
      });
    // const currentUser = firebase.auth().currentUser;
    // if (currentUser) {
    //   const db = firebase.firestore();
    //   await db
    //     .collection("collected_emails")
    //     .doc(currentUser.uid)
    //     .set({
    //       email: email,
    //     })
    //     .then(async () => {
    //       console.log("current user");
    //       const { uid, emailVerified } = currentUser;
    //       const idToken = await firebase.auth().currentUser.getIdToken();
    //       createUser(email, uid, idToken, emailVerified)(dispatch);
    //     })
    //     .then(async () => {
    //       await axios.get(
    //         "https://ipgeolocation.abstractapi.com/v1/?api_key=1a9aca489f7a4011bf341eb6c3883062"
    //       );
    //     })
    //     .then((response) => {
    //       // console.log(response.data);
    //       // const { email } = currentUser;

    //       postGeolocation(email, response.data)(dispatch);
    //     })
    //     .then(() => {
    //       subscribing()(dispatch);
    //     })
    //     .catch((error) => {
    //       console.log("err", error);
    //     });
    // }
    // currentUser.sendEmailVerification().then(function () {
    //   Alert.alert("", "An Email verification was sent to you", [
    //     {
    //       text: "Ok",
    //       onPress: () => {
    //         setSignedup(true);
    //       },
    //     },
    //   ]);
    // });

    //console.log('current user',currentUser);
    // } catch (err) {
    //   console.log(err);
    //   setError(err.message);
    //   setBtnClicked(false);
    // }
  };
  /// to be fixed
  LogBox.ignoreLogs(["Setting a timer"]);
  const inputColor = "teal";

  //console.log('errrr',error);
  return (
    <View style={styles.container}>
      <Text
        style={{
          color: "white",
          fontSize: 20,
          textAlign: "center",
          marginBottom: 40,
          marginTop: Dimensions.get("window").height < 900 ? 0 : 80,
        }}
      >
        Enter Your Email To Get Started
      </Text>
      {/* <TextInput
          label="Email"
          onChangeText={(email) => setEmail(email)}
          style={styles.textInput}
          autoCorrect={false}
          autoCapitalize="none"
          value={email}
          mode="outlined"
          keyboardType="email-address"
          onEndEditing={() => setDoneEmail(true)}
          theme={{
            colors: { primary: `${inputColor}`, underlineColor: "transparent" },
          }}
        /> */}
      <NewTextInput
        iconName="mail"
        iconSize={25}
        iconColor="darkgrey"
        type="email"
        placeholder="Enter your Email"
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

      {email && doneEmail && !email.includes("@") ? (
        <HelperText
          style={{ fontSize: 14 }}
          type="error"
          visible={email && doneEmail && !email.includes("@")}
        >
          Email address is invalid!
        </HelperText>
      ) : null}
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
      {password && donePassword && password.length < 6 ? (
        <HelperText
          style={{ fontSize: 14 }}
          type="error"
          visible={password && donePassword && password.length < 6}
        >
          Password must be at least 6 characters long
        </HelperText>
      ) : null}
      <NewTextInput
        iconName="lock"
        iconSize={25}
        iconColor="darkgrey"
        placeholder="Confirm your password"
        type="password"
        value={passwordConfirm}
        onChangeText={(passwordConfirm) => setPasswordConfirm(passwordConfirm)}
        autoCorrect={false}
        autoCapitalize="none"

        // mode="outlined"
        // theme={{
        //   colors: { primary: `${inputColor}`, underlineColor: "transparent" },
        // }}
      />
      {password?.length <= passwordConfirm?.length &&
      password !== passwordConfirm ? (
        <HelperText
          style={{ fontSize: 14, textAlign: "center" }}
          type="error"
          visible={
            password?.length <= passwordConfirm?.length &&
            password !== passwordConfirm
          }
        >
          Password confirmation do not match
        </HelperText>
      ) : null}
      {error == "The email address is already in use by another account." ? (
        <View>
          <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
          <TouchableOpacity onPress={() => resetPassword(email)}>
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
              Reset Password?
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <TouchableOpacity
        disabled={
          (!email && !password) || passwordConfirm !== password || btnClicked
        }
        onPress={() => signupUser(email, password)}
        style={styles.signupBtn}
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
            GET STARTED
          </Text>
        </LinearGradient>
      </TouchableOpacity>
      <Text
        style={{
          color: "white",
          fontSize: 14,
          textAlign: "center",
          marginTop: 30,
        }}
      >
        Already have an account ?
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate(LOGIN)}
        style={styles.signinBtn}
      >
        <Text
          style={{
            color: "white",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          Sign in
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
    marginVertical: Dimensions.get("window").height < 900 ? 10 : 20,
  },
  signupBtn: {
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
    marginVertical: 20,
    backgroundColor: "transparent",
    borderColor: "white",
    borderWidth: 2,
    width: Dimensions.get("window").height < 900 ? "40%" : "20%",
    height: 60,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
});
export default EmailSignup;
