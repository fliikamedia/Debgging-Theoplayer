import * as React from "react";
import { StatusBar} from "react-native";
import {
  MOVIES,
  WELCOMESCREEN,
  FILLPROFILESCREEN,
} from "./constants/RouteNames";
import firebase from "firebase";
import { firebaseConfig } from "./src/api/FirebaseConfig";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";
import {PersistGate} from 'redux-persist/integration/react'
import {store, persistor} from './store/index'
import MoviesNavigator from "./src/navigation/MoviesNavigator";
import WelcomeNavigator from "./src/navigation/WelcomeNavigator";
import AsyncStorage from "@react-native-community/async-storage";
import AppRoute from './src/navigation/AppRoute';

StatusBar.setBarStyle("light-content");
if (Platform.OS === "android") {
  StatusBar.setBackgroundColor("rgba(0,0,0,0)");
  StatusBar.setTranslucent(true);
}

  
export default App = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }else {
    firebase.app(); // if already initialized, use that one
  }
  return  (
      <StoreProvider store={store}>
        <PersistGate persistor={persistor} loading={null}>
        <PaperProvider>
         <AppRoute />
        </PaperProvider>
        </PersistGate>
      </StoreProvider>
    );
    
  }


