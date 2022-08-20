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
import { loggedIn, loggedOut, subscribing } from "../../store/actions/user";
import Spinner from "react-native-spinkit";
import expressApi from "../api/expressApi";
/* StatusBar.setBarStyle("light-content");
if (Platform.OS === "android") {
  StatusBar.setBackgroundColor("rgba(0,0,0,0)");
  StatusBar.setTranslucent(true);
}
 */
export default AppRoute = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
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
  // console.log("user", ready);
  var seconds = new Date().getTime() / 1000;
  // console.log(seconds + 2629743);
  React.useEffect(() => {
    if (!user?.user?.stripe_customer_id) {
      setReady(true);
      return;
    }
    firebase.auth().onAuthStateChanged(function (isUser) {
      if (isUser) {
        isUser.getIdToken().then(async function (idToken) {
          const result = await expressApi.post(
            "/mobile-subs/get-subscriptions",
            {
              customerId: user?.user?.stripe_customer_id,
            },
            {
              headers: {
                authtoken: idToken,
              },
            }
          );
          // console.log(
          //   "subscribed? ",
          //   result.data?.subscriptions?.data[0]?.plan.nickname
          // );
          // console.log(
          //   "subscribed? ",
          //   result.data?.subscriptions?.data[0]?.start_date + 2629743 > seconds
          // );
          // console.log(
          //   "date",
          //   result.data?.subscriptions?.data[0]?.plan?.nickname ===
          //     "Fliika Monthly" &&
          //     result.data?.subscriptions?.data[0]?.start_date + 2629743 <
          //       seconds &&
          //     result.data?.subscriptions?.data[0]?.status !== "active"
          // );
          // console.log(
          //   "subscribed? ",
          //   result.data?.subscriptions?.data[0]?.status
          // );
          if (
            // user?.user?.subscriptions?.length === 0 ||
            result.data?.subscriptions?.data[0]?.plan?.nickname ===
              "Fliika Monthly" &&
            result.data?.subscriptions?.data[0]?.start_date + 2629743 <
              seconds &&
            result.data?.subscriptions?.data[0]?.status !== "active"
          ) {
            setReady(true);
            subscribing()(dispatch);
          } else if (
            result.data?.subscriptions?.data[0]?.plan?.nickname ===
              "Fliika Yearly" &&
            result.data?.subscriptions?.data[0]?.start_date + 31556926 <
              seconds &&
            result.data?.subscriptions?.data[0]?.status !== "active"
          ) {
            setReady(true);
            subscribing()(dispatch);
          } else {
            setReady(true);
            // loggedIn()(dispatch);
          }
        });
      } else {
        setReady(true);
      }
    });
  }, [user?.user?.stripe_customer_id]);
  const navigatorFunc = () => {
    if (user.isLoggedIn === "loggedIn") {
      // console.log(1);
      return <MoviesNavigator routeName={MOVIES} />;
    } else if (user.isLoggedIn === "selectingSubscription") {
      // console.log(2);
      return <SubscriptionNavigator routeName={SELECTSUBSCRIPTION} />;
    } else if (ready && user.isLoggedIn === "selectingProfile") {
      // console.log(3);
      return <WelcomeNavigator routeName={SELECTPROFILE} />;
    } else if (ready && user.isLoggedIn === "signedUp") {
      // console.log(4);
      return <WelcomeNavigator routeName={FILLPROFILESCREEN} />;
    } else if (
      (ready && user.isLoggedIn === "loggedOut") ||
      user.isLoggedIn === ""
    ) {
      // console.log(5);
      return <WelcomeNavigator routeName={WELCOMESCREEN} />;
    }
  };
  return (
    <NavigationContainer>
      {!ready ? (
        <View
          style={{
            flex: 1,
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner
            isVisible={!ready}
            size={70}
            type={"ThreeBounce"}
            color={"#fff"}
          />
        </View>
      ) : (
        navigatorFunc()
      )}
    </NavigationContainer>
  );
};
