import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import NewTextInput from "./components/TextInput";
import firebase from "firebase";
import ModalComponent from "./components/ModalComponent";
import { useTranslation } from "react-i18next";
const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmMassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const updateUserPassword = () => {
    if (!password || !confirmMassword) return;
    const user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      oldPassword
    );
    console.log(credential);

    user
      .reauthenticateWithCredential(credential)
      .then(() => {
        // User re-authenticated.
        user
          .updatePassword(password)
          .then(() => {
            // Update successful.
            console.log("success");
            setShowModal(true);
            setOldPassword("");
            setPassword("");
            setConfirmPassword("");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        // An error occurred
        console.log(error);
        // ...
      });
  };

  return (
    <View style={styles.container}>
      <NewTextInput
        iconName="lock"
        iconSize={25}
        iconColor="darkgrey"
        placeholder={t("common:currentPassword")}
        type="password"
        value={oldPassword}
        onChangeText={(password) => setOldPassword(password)}
        autoCorrect={false}
        autoCapitalize="none"
      />
      <NewTextInput
        iconName="lock"
        iconSize={25}
        iconColor="darkgrey"
        placeholder={t("common:newPassword")}
        type="password"
        value={password}
        onChangeText={(password) => setPassword(password)}
        autoCorrect={false}
        autoCapitalize="none"
      />
      <NewTextInput
        iconName="lock"
        iconSize={25}
        iconColor="darkgrey"
        placeholder={t("common:confirmPassword")}
        type="password"
        value={confirmMassword}
        onChangeText={(password) => setConfirmPassword(password)}
        autoCorrect={false}
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={updateUserPassword} style={styles.updateBTN}>
        <Text style={styles.updateBtnText}>{t("common:updatePassword")}</Text>
      </TouchableOpacity>
      <ModalComponent
        type="update-password"
        isVisible={showModal}
        text="Password updated successfully!"
        setShowModal={setShowModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  updateBTN: {
    // height: 50,
    // width: 240,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 50,
  },
  updateBtnText: {
    color: "#fff",
    fontFamily: "Sora-Regular",
    fontSize: 18,
  },
});

export default UpdatePassword;
