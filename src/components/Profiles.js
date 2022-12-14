import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import {
  dummyData,
  COLORS,
  SIZES,
  FONTS,
  icons,
  images,
} from "../../constants";
import FastImage from "react-native-fast-image";

const Profiles = ({ profiles }) => {
  if (profiles.length <= 3) {
    return (
      <View style={styles.container}>
        {profiles.map((item, index) => {
          <View
            key={`profile-${index}`}
            style={index == 0 ? null : { marginLeft: -15 }}
          >
            <FastImage
              source={item.profile}
              resizeMode="cover"
              style={styles.profileImage}
            />
          </View>;
        })}
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {profiles.map((item, index) => {
          if (index <= 2) {
            return (
              <View
                key={`profile-${index}`}
                style={index == 0 ? null : { marginLeft: -15 }}
              >
                <FastImage
                  source={item.profile}
                  resizeMode="cover"
                  style={styles.profileImage}
                />
              </View>
            );
          }
        })}
        <Text
          style={{ marginLeft: SIZES.base, color: COLORS.white, fontSize: 16 }}
        >
          +{profiles.length - 3}
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.black,
  },
});
export default Profiles;
