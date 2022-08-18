import { Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
// import type { MenuItem } from './MenuItem';
import { Switch } from "react-native-paper";
// export interface MenuRowProps {
//   onSelected?: () => void;
//   selected?: boolean;
//   hasTVPreferredFocus?: boolean;
//   data: MenuItem;
// }

export const MenuRow = (props) => {
  const { selected, onSelected, hasTVPreferredFocus, data, onUnselected } =
    props;
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  if (!data || data?.label === "CC") return <></>;
  const { label } = data;
  // console.log("daaaaaaaaaaaata", selected);
  const onToggleSwitch = () => {
    // setIsSwitchOn(!isSwitchOn);
    if (!selected) {
      onSelected();
    } else {
      onUnselected();
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
      <Switch value={selected} onValueChange={onToggleSwitch} color="aqua" />
    </TouchableOpacity>
  );
};
