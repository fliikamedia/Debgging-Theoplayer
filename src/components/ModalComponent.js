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
import IconAnt from "react-native-vector-icons/AntDesign";

const ModalComponent = ({
  text,
  type,
  isVisible,
  setShowModal,
  seasons,
  seasonNumber,
  setSeasonNumber,
}) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // const seasons = [
  //   1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  //   22, 23, 24, 25,
  // ];

  const renderSeasons = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSeasonNumber(item);
          setShowModal(false);
        }}
        style={{ marginBottom: 10 }}
      >
        <Text
          style={{
            color: item === seasonNumber ? "#fff" : "#A9A9A9",
            fontFamily: item === seasonNumber ? "Sora-Bold" : "Sora-Regular",
            fontSize: item === seasonNumber ? 22 : 18,
            textAlign: "center",
          }}
        >
          {`Season ${item}`}
        </Text>
      </TouchableOpacity>
    );
  };
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
    } else if (type === "update-password") {
      return (
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{text}</Text>
            <IconAnt name="checkcircle" color="lime" size={70} />
            <TouchableOpacity
              style={styles.close}
              onPress={() => {
                setShowModal(false);
              }}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (type === "seasons") {
      return (
        // <View style={styles.centeredView}>
        <View
          style={{
            flex: 1,
            // width: "100%",
            backgroundColor: "rgba(0,0,0,0.8)",
            // alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setShowModal(false);
            }}
            style={{ position: "absolute", top: 50, right: 50 }}
          >
            <IconAnt
              name="closecircle"
              size={50}
              color="rgba(255,255,255, 0.8)"
            />
          </TouchableOpacity>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              // backgroundColor: "red",
              maxHeight: "70%",
            }}
          >
            {/* {seasons.map((season, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSeasonNumber(season);
                  setShowModal(false);
                }}
                style={{ marginBottom: 10 }}
              >
                <Text
                  style={{
                    color: season === seasonNumber ? "#fff" : "#A9A9A9",
                    fontFamily:
                      season === seasonNumber ? "Sora-Bold" : "Sora-Regular",
                    fontSize: season === seasonNumber ? 22 : 18,
                    textAlign: "center",
                  }}
                >
                  {`Season ${season}`}
                </Text>
              </TouchableOpacity>
            ))} */}
            <FlatList
              data={seasons}
              renderItem={renderSeasons}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              // contentContainerStyle={{ backgroundColor: "red" }}
            />
          </View>
        </View>
        // </View>
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
      statusBarTranslucent={true}
      animationType={type === "seasons" ? "slide" : "none"}
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
