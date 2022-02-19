import * as React from "react";
import { View,ActivityIndicator} from "react-native";
import {
  MOVIES,
  WELCOMESCREEN,
  FILLPROFILESCREEN,
} from "../../constants/RouteNames";
import firebase from "firebase";
import { firebaseConfig } from "../../src/api/FirebaseConfig";
import MoviesNavigator from "./MoviesNavigator";
import WelcomeNavigator from "./WelcomeNavigator";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { createStackNavigator } from '@react-navigation/stack';
import { loggedOut } from "../../store/actions/user";

/* StatusBar.setBarStyle("light-content");
if (Platform.OS === "android") {
  StatusBar.setBackgroundColor("rgba(0,0,0,0)");
  StatusBar.setTranslucent(true);
}
 */
export default AppRoute = () => {

const user = useSelector(state => state.user);

const [verified, setVerified] = React.useState(false);
const [ready, setReady] = React.useState(false);
const checkIFVerified = async () => {
  firebase.auth().onAuthStateChanged((user) => {
   if (user && user.emailVerified ) {
     setVerified(true);
     setReady(true);
    } else {
      setReady(true);
    }
    //console.log('user verified',user?.emailVerified);
  });
};
React.useEffect(() => {
  checkIFVerified();
}, [ready]);

console.log('user',user.isLoggedIn);

if (!ready) {
  return (
    <View style={{  flex: 1,
      backgroundColor: "black",}}>
    <ActivityIndicator
    animating
    color={"teal"}
    size="large"
    style={{ flex: 1, position: "absolute", top: "50%", left: "45%" }}
  />
  </View>
  )
}
  const navigatorFunc = () => {

    if (ready && verified && user.isLoggedIn === 'loggedIn') {
      console.log('1');
        return <MoviesNavigator routeName={MOVIES} /> 
    } else if (ready && verified && (user.isLoggedIn === 'signedUp' || user.isLoggedIn === '') ) {
      console.log('2');
        return <WelcomeNavigator  routeName={FILLPROFILESCREEN} /> 
    } else if (ready && !verified && user.isLoggedIn === 'loggedOut' || user.isLoggedIn === ''){
      console.log('3');
        return <WelcomeNavigator routeName={WELCOMESCREEN} /> 
    }
  }
  return  (
    <NavigationContainer>
     {navigatorFunc()}
     </NavigationContainer>
    );
    
  }


