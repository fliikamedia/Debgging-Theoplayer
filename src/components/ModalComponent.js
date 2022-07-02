import React, { useState, useCallback, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Modal,
  Pressable,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { removeProfileError, getUser } from "../../store/actions/user";
import Spinner from "react-native-spinkit";
import firebase from "firebase";

const ModalComponent = ({ text, type, isVisible }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const modalFunc = () => {
    if (type === "loader") {
      return (
        <View style={styles.centeredView}>
          <View
            style={{
              flex: 1,
              width: "100%",
              backgroundColor: "rgba(0,0,0,0.6)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spinner
              isVisible={isVisible}
              size={70}
              type={"ThreeBounce"}
              color={"#fff"}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{text}</Text>
            <TouchableOpacity
              style={styles.close}
              onPress={() => {
                removeProfileError()(dispatch);
                firebase.auth().onAuthStateChanged(function (user) {
                  if (user) {
                    user.getIdToken().then(function (idToken) {
                      getUser(user.email, idToken)(dispatch);
                    });
                  }
                });
              }}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };
  return (
    <Modal
      //   animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        console.log("closing");
        removeProfileError()(dispatch);
      }}
    >
      {modalFunc()}
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "darkgrey",
    borderRadius: 20,
    padding: 35,
    width: "90%",
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  close: {
    borderRadius: 5,
    padding: 10,
    // elevation: 2,
    backgroundColor: "black",
    borderWidth: 1,
    position: "absolute",
    bottom: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Sora-Bold",
    color: "black",
    fontSize: 20,
  },
});
export default ModalComponent;
