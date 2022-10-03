import * as React from "react";
import { StatusBar } from "react-native";
import {
  MOVIES,
  WELCOMESCREEN,
  FILLPROFILESCREEN,
} from "./constants/RouteNames";
import firebase from "firebase";
import { firebaseConfig } from "./src/api/FirebaseConfig";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/index";
import MoviesNavigator from "./src/navigation/MoviesNavigator";
import WelcomeNavigator from "./src/navigation/WelcomeNavigator";
import AsyncStorage from "@react-native-community/async-storage";
import AppRoute from "./src/navigation/AppRoute";
import { StripeProvider } from "@stripe/stripe-react-native";
import "./constants/DCSLocalize";

StatusBar.setBarStyle("light-content");
if (Platform.OS === "android") {
  StatusBar.setBackgroundColor("rgba(0,0,0,0)");
  StatusBar.setTranslucent(true);
}

export default App = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }

  // React.useEffect(() => {

  // }, []);

  // React.useEffect(() => {
  //   setTimeout(() => {
  //     console.log("hiding");
  //     SplashScreen.hide();
  //   }, 4000);

  //   return () => {
  //     clearTimeout();
  //   };
  // }, []);
  return (
    <StoreProvider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <PaperProvider>
          <StripeProvider
            publishableKey="pk_test_51LIGZaIkBj7UEE6aoz8fVKxgBWJFRT9vhRjKjm1k13C0q1NAIdBQlEmUHxB5xpbkn3wsw8EuU54Lhw2k0Z9ZljdN00BevCtWyp"
            merchantIdentifier="merchant.identifier"
          >
            <AppRoute />
          </StripeProvider>
        </PaperProvider>
      </PersistGate>
    </StoreProvider>
  );
};
