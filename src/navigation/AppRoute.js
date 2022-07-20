import * as React from "react";
import { View, ActivityIndicator } from "react-native";
import {
  MOVIES,
  WELCOMESCREEN,
  FILLPROFILESCREEN,
  SELECTPROFILE,
  SUBSCRIPTIONS,
  SELECTSUBSCRIPTION,
} from "../../constants/RouteNames";
import firebase from "firebase";
import { firebaseConfig } from "../../src/api/FirebaseConfig";
import MoviesNavigator from "./MoviesNavigator";
import WelcomeNavigator from "./WelcomeNavigator";
import SubscriptionNavigator from "./SubscriptionNavigator";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { loggedOut } from "../../store/actions/user";
import Spinner from "react-native-spinkit";

/* StatusBar.setBarStyle("light-content");
if (Platform.OS === "android") {
  StatusBar.setBackgroundColor("rgba(0,0,0,0)");
  StatusBar.setTranslucent(true);
}
 */
export default AppRoute = () => {
  const user = useSelector((state) => state.user);

  const [verified, setVerified] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  // const checkIFVerified = async () => {
  //   firebase.auth().onAuthStateChanged((user) => {
  //     if (user && user.emailVerified) {
  //       setVerified(true);
  //       setReady(true);
  //     } else {
  //       setReady(true);
  //       setVerified(false);
  //     }
  //     //console.log('user verified',user?.emailVerified);
  //   });
  // };
  // React.useEffect(() => {
  //   checkIFVerified();
  // }, [ready]);

  // if (!ready) {
  //   return (
  //     // <View style={{ flex: 1, backgroundColor: "black" }}>
  //     //   <ActivityIndicator
  //     //     animating
  //     //     color={"teal"}
  //     //     size="large"
  //     //     style={{ flex: 1, position: "absolute", top: "50%", left: "45%" }}
  //     //   />
  //     // </View>
  //     <View
  //       style={{
  //         flex: 1,
  //         backgroundColor: "black",
  //         alignItems: "center",
  //         justifyContent: "center",
  //       }}
  //     >
  //       <Spinner
  //         isVisible={!ready}
  //         size={70}
  //         type={"ThreeBounce"}
  //         color={"#fff"}
  //       />
  //     </View>
  //   );
  // }
  // console.log("user", user.isLoggedIn);
  const navigatorFunc = () => {
    if (user.isLoggedIn === "loggedIn") {
      return <MoviesNavigator routeName={MOVIES} />;
    } else if (user.isLoggedIn === "selectingSubscription") {
      return <SubscriptionNavigator routeName={SELECTSUBSCRIPTION} />;
    } else if (user.isLoggedIn === "selectingProfile") {
      return <WelcomeNavigator routeName={SELECTPROFILE} />;
    } else if (user.isLoggedIn === "signedUp") {
      return <WelcomeNavigator routeName={FILLPROFILESCREEN} />;
    } else if (user.isLoggedIn === "loggedOut" || user.isLoggedIn === "") {
      return <WelcomeNavigator routeName={WELCOMESCREEN} />;
    }
  };
  return <NavigationContainer>{navigatorFunc()}</NavigationContainer>;
};
