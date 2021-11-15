import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  ActivityIndicator,
  StatusBar
} from "react-native";
import { LOGIN, SIGNUP, FORGOTPASSWORD, MOVIES, EMAILSIGNUP } from "../constants/RouteNames";
import firebase from "firebase";
import Video from 'react-native-video'

const WelcomePage = ({ navigation }) => {
  const [isPreloading, setIsPreloading] = useState(true);
  console.log(Dimensions.get('window').height);

  /*
  const checkIFLoggedIn = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate(MOVIES);
      }
    });
  };
  useEffect(() => {
    checkIFLoggedIn();
  }, []);
  */
  // Button Width Responsive
  var buttonWidth;
  if (Dimensions.get("window").width < 350) {
    buttonWidth = 230;
  } else if (Dimensions.get("window").width < 800) {
    buttonWidth = 250;
  } else {
    buttonWidth = 350;
  }

  const createBtn = {
    backgroundColor: "#f3f8ff",
    padding: 15,
    borderRadius: Dimensions.get("window").width < 800 ? 30 : 34,
    justifyContent: "center",
    width: buttonWidth,
    marginBottom: 20,
  };
  const loginBtn = {
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: Dimensions.get("window").width < 800 ? 30 : 34,
    justifyContent: "center",
    width: buttonWidth,
    borderWidth: 1,
    borderColor: "#f3f8ff",
  };
  //////////////////////////

  const video = React.useRef(null);
  return (
    <View style={styles.container}>
      {isPreloading && (
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <ActivityIndicator
            animating
            color={"teal"}
            size="large"
            style={{ flex: 1, position: "absolute", top: "50%", left: "45%" }}
          />
        </View>
      )}
      <Video
        onReadyForDisplay={() => setIsPreloading(false)}
        ref={video}
        style={styles.video}
        source={{
          uri: "https://fliikaimages.azureedge.net/hero-container/boxing_hero.mp4",
        }}
       repeat
        isMuted
        shouldPlay
        resizeMode="cover"
        rate={1.0}
      />
      {isPreloading ? null : (
        <View style={styles.Wrapper}>
          <Image
            source={{
              uri: "https://fliikaimages.azureedge.net/logos/FLiiKA.png",
            }}
            style={styles.logo}
          />
          <View>
            <Text style={styles.textDescriptionLg}>
              Watch African movies you love
            </Text>
            <Text style={styles.textDescriptionSm}>
              Sign Up for your account today and watch amazing blockbuster
              African movies. Save 30% if you sign up annually
            </Text>
          </View>
          <View>
            <Text style={styles.textDescriptionSb}>join us now</Text>
            <TouchableOpacity
              style={createBtn}
              onPress={() => navigation.navigate(EMAILSIGNUP)}
            >
              <Text style={styles.createText}>create account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate(LOGIN)}
              style={loginBtn}
            >
              <Text style={styles.loginText}>login</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/*<StatusBar style="light" />*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
  video: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.9,
  },
  Wrapper: {
    height: "95%",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
    flexDirection: "column",
  },
  logo: {
    height: Dimensions.get("window").width < 800 ? "5%" : "3%",
    width: Dimensions.get("window").width < 800 ? "30%" : "20%",
    marginTop: 30,
  },
  textDescriptionLg: {
    color: "#f3f8ff",
    fontSize: Dimensions.get("window").width < 350 ? 26 : 30,
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 3,
    marginBottom: 10,
  },
  textDescriptionSm: {
    letterSpacing: 3,
    color: "#f4f4f4",
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 20,
    fontSize: Dimensions.get("window").width < 800 ? 8 : 14,
  },
  textDescriptionSb: {
    letterSpacing: 3,
    color: "#f4f4f4",
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 20,
    fontSize: Dimensions.get("window").width < 800 ? 12 : 16,
  },
  createText: {
    textTransform: "uppercase",
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 3,
    color: "#666",
    fontSize: Dimensions.get("window").width < 800 ? 16 : 24,
  },
  loginText: {
    textTransform: "uppercase",
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 3,
    color: "#f3f8ff",
    fontSize: Dimensions.get("window").width < 800 ? 16 : 24,
  },
});

export default WelcomePage;
