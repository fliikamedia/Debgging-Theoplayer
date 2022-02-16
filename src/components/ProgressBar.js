import React from "react";
import { View, Text } from "react-native";
import { COLORS, SIZES } from "../../constants";
import LinearGradient from "react-native-linear-gradient";
const ProgressBar = ({ containerStyle, barStyle, percentage }) => {
  return (
    <View style={{ ...containerStyle }}>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          marginTop: SIZES.base,
          backgroundColor: COLORS.gray,
          ...barStyle,
        }}
      ></View>
      <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#87CEEB", "#4169E1"]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: percentage,
          marginTop: SIZES.base,
          ...barStyle,
        }}
      ></LinearGradient>
    </View>
  );
};

export default ProgressBar;
