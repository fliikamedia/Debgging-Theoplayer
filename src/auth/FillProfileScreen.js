import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  AppState,
  Dimensions,
  FlatList,
  Image
} from "react-native";
import firebase from "firebase";
import { LOGIN, MOVIES } from "../../constants/RouteNames";
import { TextInput, HelperText } from "react-native-paper";
import { LogBox } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addUser } from "../../store/actions/user";
import { useDispatch } from "react-redux";
import { firebaseConfig } from "../api/FirebaseConfig";
import AsyncStorage from "@react-native-community/async-storage";
import profileImgs from "../../constants/profileImgs";

const SignupScreen = ({ navigation }) => {
  const appState = useRef(AppState.currentState);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [yearOfBirth, setYearOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [doneEmail, setDoneEmail] = useState(false);
  const [donePassword, setDonePassword] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [imageName, setImageName] = useState('profile0');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    setDate(currentDate);
    if (event.type == "set") {
      setYearOfBirth(`${day}/${month}/${year}`);
      setShow(false);
    } else {
      setShow(false);
    }
  };
  const showMode = (currentMode) => {
    setMode(currentMode);
  };

/*   const checkIFLoggedIn = () => {
    firebase.app().delete().then(function() {
      console.log('initializing');
      firebase.initializeApp(firebaseConfig);
    }).then(function(){
      firebase.auth().onAuthStateChanged((user) => {
        if (user && user.emailVerified) {
          console.log('success',user);
         
        } else {
          console.log('failed',user);
        }
      });
    })
   
    
  }; */

 /*  useEffect(() => {
    AppState.addEventListener("change",   checkIFLoggedIn,
    );
    
    return () => {
      AppState.removeEventListener("change",   checkIFLoggedIn);
    };
  }, [appState]); */
  const showDatepicker = () => {
    setShow(true);
    showMode("date");
  };

  /// to be fixed
  LogBox.ignoreLogs(["Setting a timer"]);
  const inputColor = "teal";
  
  const signupUser = async (email, password) => {
    try {
      /* await firebase.auth().createUserWithEmailAndPassword(email, password);
      const currentUser = firebase.auth().currentUser;
    
      currentUser.sendEmailVerification().then(function () {
        alert("A verification E-mail was sent to you...");
      });
    
      console.log('current user',currentUser);
      const db = firebase.firestore();
      await db.collection("users").doc(currentUser.uid).set({
        email: currentUser.email,
        fullName: fullName,
        yearOfBirth: yearOfBirth,
        phoneNumber: phoneNumber,
      }); */
      //console.log("response", currentUser);
      const { uid, email,emailVerified } = firebase.auth().currentUser;
      const idToken = await firebase.auth().currentUser.getIdToken();

       
        addUser(email,firstName, lastName, yearOfBirth, phoneNumber,uid, emailVerified, imageName, idToken )(dispatch);
        navigation.reset({
          index: 0,
          routes: [{ name: MOVIES }],
        });
        await AsyncStorage.setItem("whatPhase", "LoggedIn");
        navigation.navigate(MOVIES);
    
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };
  
  /*
  const checkIFLoggedIn = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user && user.emailVerified) {
        navigation.reset({
          index: 0,
          routes: [{ name: MOVIES }],
        });
        navigation.navigate(MOVIES);
      }
      console.log("reloading", user);
    });
  };

  useEffect(() => {
    checkIFLoggedIn();
  }, [appState.current]);
*/
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
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
        <Text
          style={{
            color: "white",
            fontSize: 20,
            textAlign: "center",
            marginBottom: 40,
            marginTop: Dimensions.get("window").height < 900 ? 0 : 80,
          }}
        >
          Create your account
        </Text>
        <TextInput
          label="First Name"
          onChangeText={(firstName) => setFirstName(firstName)}
          style={styles.textInput}
          autoCorrect={false}
          autoCapitalize="words"
          value={firstName}
          mode="outlined"
          theme={{
            colors: { primary: `${inputColor}`, underlineColor: "transparent" },
          }}
        />
                <TextInput
          label="Last Name"
          onChangeText={(lastName) => setLastName(lastName)}
          style={styles.textInput}
          autoCorrect={false}
          autoCapitalize="words"
          value={lastName}
          mode="outlined"
          theme={{
            colors: { primary: `${inputColor}`, underlineColor: "transparent" },
          }}
        />
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
        />
        {email && doneEmail && !email.includes("@") ? (
          <HelperText
            style={{ fontSize: 14 }}
            type="error"
            visible={email && doneEmail && !email.includes("@")}
          >
            Email address is invalid!
          </HelperText>
        ) : null} */}
     {/*    <TextInput
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
        ) : null} */}
        <TextInput
          showSoftInputOnFocus={false}
          onFocus={() => showDatepicker()}
          label="Date of birth"
          value={yearOfBirth}
          onChangeText={(yearOfBirth) => setYearOfBirth(yearOfBirth)}
          style={styles.textInput}
          autoCorrect={false}
          autoCapitalize="none"
          mode="outlined"
          theme={{
            colors: { primary: `${inputColor}`, underlineColor: "transparent" },
          }}
        />
        <TextInput
          label="Phone number"
          onFocus={() => setPhoneNumber("+")}
          value={phoneNumber}
          onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
          style={styles.textInput}
          autoCorrect={false}
          autoCapitalize="none"
          mode="outlined"
          keyboardType="numeric"
          theme={{
            colors: { primary: `${inputColor}`, underlineColor: "transparent" },
          }}
        />
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
        <View style={{marginVertical: 20}}>
          <Text style={{color: '#fff', fontSize: 18, marginLeft: 20, marginBottom: 20}}>Choose a profile image</Text>
        <FlatList
      showsHorizontalScrollIndicator={false}
        horizontal
        data={profileImgs}
        keyExtractor={(item) => item.name}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => setImageName(item.name)}>
            <Image
              source={item.path}
              style={{
                width: 100,
                height: 100,
                borderRadius: 120,
                marginLeft: 20,
                borderWidth: imageName === item.name ? 6 : 0,
                borderColor: imageName === item.name ? 'teal' : null
              }}
            />
          </TouchableOpacity>
        )}
      />
        </View>
        
        <TouchableOpacity
          disabled={
            !firstName &&
            !lastName &&
            !email &&
            !password &&
            !yearOfBirth &&
            phoneNumber.length > 1
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
            Submit Profile
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
      </ScrollView>
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
export default SignupScreen;
