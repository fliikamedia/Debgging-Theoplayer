import React, { useState } from "react";
import { View, StyleSheet, TextInput, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import FoundationIcon from "react-native-vector-icons/Foundation";
import LinearGradient from "react-native-linear-gradient";

const NewTextInput = ({
  iconName,
  iconSize,
  iconColor,
  type,
  onChangeText,
  ...props
}) => {
  const [securePassword, setSecurePassword] = useState(true);

  const renderEyeIcon = () => {
    if (securePassword) {
      return (
        <Icon
          onPress={() => setSecurePassword(!securePassword)}
          name="eye-off"
          size={16}
          color="darkgrey"
          style={styles.eyeIcon}
        />
      );
    } else {
      return (
        <Icon
          onPress={() => setSecurePassword(!securePassword)}
          name="eye"
          size={16}
          color="darkgrey"
          style={styles.eyeIcon}
        />
      );
    }
  };
  return (
    <LinearGradient
      colors={[
        "#00FFFF",
        "#17C8FF",
        "#329BFF",
        "#4C64FF",
        "#6536FF",
        "#8000FF",
      ]}
      start={{ x: 0.0, y: 1.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={styles.linearBorder}
    >
      <View style={styles.container}>
        {iconName === "calendar" ? (
          <FoundationIcon
            style={styles.iconFoundation}
            name={iconName}
            size={iconSize}
            color={iconColor}
          />
        ) : (
          <Icon
            style={styles.icon}
            name={iconName}
            size={iconSize}
            color={iconColor}
          />
        )}
        <TextInput
          {...props}
          style={styles.input}
          underlineColorAndroid="transparent"
          onChangeText={onChangeText}
          secureTextEntry={type === "password" ? securePassword : false}
          placeholderTextColor="#A9A9A9"
        />
        {type === "password" && renderEyeIcon()}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearBorder: {
    // flexDirection: "row",
    width: "90%",
    height: Dimensions.get("window").height < 900 ? 65 : 75,
    // paddingHorizontal: 1.5,
    // paddingVertical: 1.5,
    paddingTop: 1.5,
    paddingBottom: 1.5,
    paddingLeft: 1.5,
    paddingRight: 1.5,
    alignSelf: "center",
    // borderWidth: 1,
    // borderColor: "deepskyblue",
    borderRadius: 5,
    // alignItems: "center",
    marginVertical: 8,
  },
  container: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    borderRadius: 5,
    // paddingHorizontal: 10,
    // alignSelf: "center",
    // borderWidth: 1,
    // borderColor: "deepskyblue",
    // borderRadius: 5,
    alignItems: "center",
    // marginBottom: 20,
    // backgroundColor: "black",
  },
  input: {
    // flex: 1,
    // marginRight: 6,
    fontSize: 18,
    // textAlign: "center",
    color: "#E8E8E8",
    padding: 15,
    // marginLeft: 1,
    // marginRight: 1,
    width: "80%",
    backgroundColor: "black",
  },
  icon: {
    marginRight: 10,
    marginLeft: 10,
    backgroundColor: "black",
  },
  iconFoundation: {
    marginRight: 15,
    marginLeft: 15,
    backgroundColor: "black",
  },
  eyeIcon: {
    // paddingTop: 10,
    // paddingBottom: 10,
    // paddingLeft: 10,
    // marginRight: 80,
    // backgroundColor: "red",
    position: "absolute",
    right: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 5,
    // flex: 1,
    // padding: 30,
  },
});
export default NewTextInput;
