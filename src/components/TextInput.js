import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import FoundationIcon from "react-native-vector-icons/Foundation";
const NewTextInput = ({
  iconName,
  iconSize,
  iconColor,
  type,
  onChangeText,
  ...props
}) => {
  const [securePassword, setSecurePassword] = useState(true);

  return (
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
      />
      {type === "password" && (
        <Icon
          onPress={() => setSecurePassword(!securePassword)}
          name="eye"
          size={16}
          color={securePassword ? "darkgrey" : "#fff"}
          style={styles.eyeIcon}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "90%",
    height: 60,
    paddingHorizontal: 10,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "deepskyblue",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    marginRight: 6,
    fontSize: 18,
  },
  icon: {
    marginRight: 10,
  },
  iconFoundation: {
    marginRight: 10,
    marginLeft: 5,
  },
  eyeIcon: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
  },
});
export default NewTextInput;
