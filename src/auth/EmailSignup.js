import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  AppState,
  Dimensions,
} from "react-native";
import firebase from "firebase";
import { LOGIN, MOVIES, SIGNUP } from "../../constants/RouteNames";
import { TextInput, HelperText } from "react-native-paper";
import { LogBox } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addUser } from "../../store/actions/user";
import { useDispatch } from "react-redux";
import { firebaseConfig } from "../api/FirebaseConfig";


const EmailSignup = ({ navigation }) => {
  const appState = useRef(AppState.currentState);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setfullName] = useState("");
  const [yearOfBirth, setYearOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [doneEmail, setDoneEmail] = useState(false);
  const [donePassword, setDonePassword] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);


  const checkIFLoggedIn = () => {
    firebase.app().delete().then(function() {
      //console.log('initializing');
      firebase.initializeApp(firebaseConfig);
    }).then(function(){
      firebase.auth().onAuthStateChanged((user) => {
        if (user && user.emailVerified) {
         // console.log('success',user);
          navigation.navigate(SIGNUP)
        } else {
          //console.log('failed',user);
        }
      });
    })
   
    
  };

  useEffect(() => {
    AppState.addEventListener("change",   checkIFLoggedIn,
    );
    
    return () => {
      AppState.removeEventListener("change",   checkIFLoggedIn);
    };
  }, [appState]);
  const showDatepicker = () => {
    setShow(true);
    showMode("date");
  };

  const signupUser = async (email, password) => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      const currentUser = firebase.auth().currentUser;
    
      currentUser.sendEmailVerification().then(function () {
        alert("A verification E-mail was sent to you...");
      });
    
      //console.log('current user',currentUser);

    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };
  /// to be fixed
  LogBox.ignoreLogs(["Setting a timer"]);
  const inputColor = "teal";
 
  
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
        <TextInput
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
      <TextInput
          label="Password"
          value={password}
          onChangeText={(password) => setPassword(password)}
          style={styles.textInput}
          autoCorrect={false}
          autoCapitalize="none"
          secureTextEntry
          mode="outlined"
          onEndEditing={() => setDonePassword(true)}
          theme={{
            colors: { primary: `${inputColor}`, underlineColor: "transparent" },
          }}
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
        <TouchableOpacity
          disabled={
            !email &&
            !password
          }
          onPress={() => signupUser(email, password)}
          style={styles.signupBtn}
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
    backgroundColor: "mediumseagreen",
    alignItems: "center",
    justifyContent: "center",
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
