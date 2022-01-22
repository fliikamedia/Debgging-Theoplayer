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

/* StatusBar.setBarStyle("light-content");
if (Platform.OS === "android") {
  StatusBar.setBackgroundColor("rgba(0,0,0,0)");
  StatusBar.setTranslucent(true);
}
 */
  
export default AppRoute = () => {

const user = useSelector(state => state.user);

console.log('user',user.isLoggedIn);
  const navigatorFunc = () => {

    if (user.isLoggedIn === 'loggedIn') {
        return <MoviesNavigator routeName={MOVIES} /> 
    } else if (user.isLoggedIn === 'signedUp' ) {
        return <WelcomeNavigator  routeName={FILLPROFILESCREEN} /> 
    } else {
        return <WelcomeNavigator routeName={WELCOMESCREEN} /> 
    }
  }
  return  (
    <NavigationContainer>
     {navigatorFunc()}
     </NavigationContainer>
    );
    
  }


