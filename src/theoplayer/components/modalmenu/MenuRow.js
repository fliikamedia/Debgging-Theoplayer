import React, { useState } from "react";
import { Text, TouchableOpacity, Platform } from "react-native";
// import type { MenuItem } from './MenuItem';
import { Switch } from "react-native-paper";
// export interface MenuRowProps {
//   onSelected?: () => void;
//   selected?: boolean;
//   hasTVPreferredFocus?: boolean;
//   data: MenuItem;
// }

export const MenuRow = (props) => {
  const {
    selected,
    onSelected,
    hasTVPreferredFocus,
    data,
    onUnselected,
    subtitleLabel,
  } = props;
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  if (!data || data?.label === "CC" || data?.label === "" || !data?.label)
    return <></>;
  const { label } = data;
  // console.log("daaaaaaaaaaaata", data);
  const onToggleSwitch = () => {
    // setIsSwitchOn(!isSwitchOn);
    if (Platform.OS === "android") {
      if (!selected) {
        console.log("activate");
        onSelected();
      } else {
        console.log("deactivate");
        onUnselected();
      }
    } else {
      if (subtitleLabel !== label) {
        console.log("activate");
        onSelected();
      } else {
        console.log("deactivate");
        onUnselected();
      }
    }
  };
  return (
    <TouchableOpacity
      hasTVPreferredFocus={hasTVPreferredFocus}
      onPress={() => {}}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 10,
      }}
    >
      <Text
        style={{
          color: selected ? "#fff" : "darkgrey",
          fontSize: 16,
          marginVertical: 5,
        }}
      >
        {label}
      </Text>
      <Switch
        value={selected || subtitleLabel === label}
        onValueChange={onToggleSwitch}
        color="aqua"
      />
    </TouchableOpacity>
  );
};
