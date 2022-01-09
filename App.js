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

StatusBar.setBarStyle("light-content");
if (Platform.OS === "android") {
  StatusBar.setBackgroundColor("rgba(0,0,0,0)");
  StatusBar.setTranslucent(true);
}

  
export default App = () => {
  const [ready, setReady] = React.useState(false);
  const [route, setRoute] = React.useState("");

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }else {
    firebase.app(); // if already initialized, use that one
  }
  
  const checkIFLoggedIn = async () => {
    const whatPhase = await AsyncStorage.getItem("whatPhase");
    console.log('where',whatPhase);
    firebase.auth().onAuthStateChanged((user) => {
      if (whatPhase === "Signed up") {
        // console.log(user);
        setRoute(FILLPROFILESCREEN);
      } else if (user && user.emailVerified && whatPhase === "LoggedIn") {
        setRoute(MOVIES);
      } else {
        setRoute(WELCOMESCREEN);
      }
      //console.log('user',user);
    });
  };
  React.useEffect(() => {
    checkIFLoggedIn();
  }, []);


  const navigatorFunc = () => {
    if (route === MOVIES) {
      return  <MoviesNavigator routeName={MOVIES} /> 
    } else if (route === FILLPROFILESCREEN) {
      return  <MoviesNavigator routeName={FILLPROFILESCREEN} /> 
    } else {
      return <WelcomeNavigator />  
    }
  }
  return  (
      <StoreProvider store={store}>
        <PersistGate persistor={persistor} loading={null}>
        <PaperProvider>
         {navigatorFunc()}
        </PaperProvider>
        </PersistGate>
      </StoreProvider>
    );
    
  }


