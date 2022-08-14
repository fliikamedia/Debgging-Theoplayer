import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { UPDATEPASSWORD } from "../constants/RouteNames";
import DropDownPicker, { MyArrowUpIcon } from "react-native-dropdown-picker";
import { Switch } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";
const Account = ({ navigation }) => {
  const user = useSelector((state) => state.user);
  // const [value, setValue] = useState(null);
  // const [items, setItems] = useState([
  //   { label: "English", value: "english" },
  //   { label: "French", value: "french" },
  // ]);
  // const [open, setOpen] = useState(false);
  // const languages = [
  //   { label: "English", value: "english" },
  //   { label: "French", value: "french" },
  // ];
  const data = [
    { label: "English", value: "english" },
    { label: "French", value: "french" },
  ];
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);

  const onToggleSwitch = () => {
    setSwitchOn(!switchOn);
  };
  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "blue" }]}>
          Dropdown label
        </Text>
      );
    }
    return null;
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
        <Text style={styles.item}>My Watch History</Text>
        <TouchableOpacity>
          <Text style={styles.change}>Clear</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.item}>Auto play subtitles</Text>
        <Switch value={switchOn} onValueChange={onToggleSwitch} color="aqua" />
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.item}>Favorite Language</Text>
        <View style={{ zIndex: 1000 }}>
          {/* <DropDownPicker
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
          /> */}
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            // search
            // maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Select item" : "..."}
            // searchPlaceholder="Search..."
            dropdownPosition="auto"
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setValue(item.value);
              setIsFocus(false);
            }}
            // renderLeftIcon={() => (
            //   <AntDesign
            //     style={styles.icon}
            //     color={isFocus ? "blue" : "black"}
            //     name="Safety"
            //     size={20}
            //   />
            // )}
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
    marginTop: 20,
  },
  dropdown: {
    // height: 50,
    // borderColor: "gray",
    // borderWidth: 0.5,
    // borderRadius: 8,
    // paddingHorizontal: 8,
    width: 140,
    height: "100%",
    backgroundColor: "#202020",
    borderRadius: 5,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 5,
  },
  selectedTextStyle: {
    fontSize: 18,
    color: "#fff",
    marginLeft: 5,
    fontFamily: "Sora-Regular",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
export default Account;
