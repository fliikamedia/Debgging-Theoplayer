import * as React from "react";
import { StatusBar} from "react-native";
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
const checkIFVerified = async () => {
  firebase.auth().onAuthStateChanged((user) => {
   if (user && user.emailVerified ) {
     setVerified(true);
    } 
    //console.log('user verified',user?.emailVerified);
  });
};
React.useEffect(() => {
  checkIFVerified();
}, []);

//console.log('user',user.isLoggedIn);
  const navigatorFunc = () => {

    if (verified && user.isLoggedIn === 'loggedIn') {
        return <MoviesNavigator routeName={MOVIES} /> 
    } else if (verified && user.isLoggedIn === 'signedUp' ) {
        return <WelcomeNavigator  routeName={FILLPROFILESCREEN} /> 
    } else if (user.isLoggedIn === 'loggedOut' || user.isLoggedIn === ''){
        return <WelcomeNavigator routeName={WELCOMESCREEN} /> 
    }
  }
  return  (
    <NavigationContainer>
     {navigatorFunc()}
     </NavigationContainer>
    );
    
  }


