import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { UPDATEPASSWORD } from "../constants/RouteNames";
import DropDownPicker, { MyArrowUpIcon } from "react-native-dropdown-picker";
import { Switch } from "react-native-paper";

const Account = ({ navigation }) => {
  const user = useSelector((state) => state.user);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "English", value: "english" },
    { label: "French", value: "french" },
  ]);
  const [open, setOpen] = useState(false);
  const languages = [
    { label: "English", value: "english" },
    { label: "French", value: "french" },
  ];
  const [switchOn, setSwitchOn] = useState(false);

  const onToggleSwitch = () => {
    setSwitchOn(!switchOn);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Credentials</Text>
      <View style={styles.itemContainer}>
        <Text style={styles.item}>{user.email}</Text>
        {/* <Text style={styles.change}>Change</Text> */}
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.item}>Password: ********</Text>
        <TouchableOpacity onPress={() => navigation.navigate(UPDATEPASSWORD)}>
          <Text style={styles.change}>Change</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Playback Settings</Text>
      <View style={styles.itemContainer}>
        <Text style={styles.item}>Auto play subtitles</Text>
        <Switch value={switchOn} onValueChange={onToggleSwitch} color="aqua" />
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.item}>Favorite Language</Text>
        <View style={{ zIndex: 1000 }}>
          <DropDownPicker
            showArrowIcon={true}
            // ArrowUpIconComponent={({ style }) => (
            //   <MyArrowUpIcon style={style} />
            // )}
            arrowIconStyle={{
              tintColor: "#fff",
            }}
            placeholder={`English`}
            closeOnBackPressed={true}
            style={{
              width: 140,
              backgroundColor: "#202020",
              borderRadius: 5,
            }}
            open={open}
            value={value}
            listMode="SCROLLVIEW"
            itemSeparator={true}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            textStyle={{ color: "white", fontSize: 18 }}
            dropDownContainerStyle={{
              backgroundColor: "black",
              width: 140,
              borderColor: "grey",
            }}
            itemSeparatorStyle={{
              backgroundColor: "#fff",
              width: "90%",
              alignSelf: "center",
              opacity: 0.6,
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  itemContainer: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 10,
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    // borderBottomWidth: 1,
    // borderBottomColor: "#A9A9A9",
    marginBottom: 3,
    backgroundColor: "#303030",
  },
  item: {
    color: "#fff",
    fontFamily: "Sora-Regular",
    fontSize: 16,
    // marginTop: 10,
    // marginBottom: 15,
  },
  change: {
    color: "#A9A9A9",
    // marginBottom: 15,
    fontFamily: "Sora-Bold",
  },
  title: {
    color: "#fff",
    fontFamily: "Sora-Bold",
    fontSize: 18,
    marginBottom: 10,
  },
});
export default Account;
