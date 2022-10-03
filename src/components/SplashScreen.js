import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Video from "react-native-video";
import FastImage from "react-native-fast-image";
import { hideSplashScreen } from "../../store/actions/user";
import { useDispatch } from "react-redux";

const SplashScreen = () => {
  const [isVideoReady, setIsVideoReady] = React.useState(false);
  const dispatch = useDispatch();

  return (
    <View style={styles.SplashScreen}>
      {!isVideoReady && (
        <FastImage
          style={styles.frame}
          source={require("../../assets/splash-screen.jpg")}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
      <Video
        source={require("../../assets/splash-screen-video.mp4")}
        style={styles.video}
        onReadyForDisplay={() => setIsVideoReady(true)}
        resizeMode="cover"
        onEnd={() => {
          console.log("eeeeeend");
          hideSplashScreen()(dispatch);
        }}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  SplashScreen: {
    flex: 1,
    backgroundColor: "black",
  },
  video: {
    // flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
  frame: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 2,
  },
});
