import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants";
import FastImage from "react-native-fast-image";

const MovieDetailIcon = ({ iconFuc, icon }) => {
  return (
    <TouchableOpacity
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        height: 50,
        borderRadius: 20,
        backgroundColor: COLORS.transparentBlack,
      }}
      onPress={iconFuc}
    >
      <Image
        source={icon}
        style={{ width: 20, height: 20, tintColor: COLORS.white }}
      />
    </TouchableOpacity>
  );
};

export default MovieDetailIcon;
