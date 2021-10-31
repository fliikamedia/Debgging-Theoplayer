import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import firebase from "firebase";
import { EMAILSIGNUP, MOVIES, SIGNUP } from "../../constants/RouteNames";
import { TextInput, HelperText } from "react-native-paper";
import { setEmailFunc, getUser } from "../../store/actions/user";
import { useDispatch } from "react-redux";

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginUser = async (email, password) => {
    try {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(async (userCredential) => {
          // Signed in
          var user = userCredential.user;
          const idToken = await user.getIdToken();
          getUser(user.email, idToken)(dispatch);

          setEmailFunc(email)(dispatch);
         navigation.reset({
            index: 0,
            routes: [{ name: MOVIES }],
          });
          navigation.navigate(MOVIES);

          //console.log(user);
          // ...
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorMessage);
          setError(errorMessage);
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
      <TextInput
        label="Email"
        onChangeText={(email) => setEmail(email)}
        style={styles.textInput}
        autoCorrect={false}
        autoCapitalize="none"
        value={email}
        mode="outlined"
        keyboardType="email-address"
        theme={{
          colors: { primary: `${inputColor}`, underlineColor: "transparent" },
        }}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={(password) => setPassword(password)}
        style={styles.textInput}
        autoCorrect={false}
        autoCapitalize="none"
        secureTextEntry
        mode="outlined"
        theme={{
          colors: { primary: `${inputColor}`, underlineColor: "transparent" },
        }}
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
        onPress={() => loginUser(email, password)}
        style={styles.loginBtn}
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
  },
  loginBtn: {
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
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
});
export default LoginScreen;
