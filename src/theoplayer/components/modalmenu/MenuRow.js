import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
// import type { MenuItem } from './MenuItem';

// export interface MenuRowProps {
//   onSelected?: () => void;
//   selected?: boolean;
//   hasTVPreferredFocus?: boolean;
//   data: MenuItem;
// }

export const MenuRow = props => {
  const {selected, onSelected, hasTVPreferredFocus, data} = props;
  if (!data) return <></>;
  const {label} = data;
  // console.log('daaaaaaaaaaaata', data);
  return (
    <TouchableOpacity
      hasTVPreferredFocus={hasTVPreferredFocus}
      onPress={() => {
        if (onSelected) {
          onSelected();
        }
      }}>
      <Text
        style={{
          color: selected ? '#ffc50f' : 'white',
          fontSize: 16,
          marginVertical: 5,
        }}>
        {label}
        {/* english */}
      </Text>
    </TouchableOpacity>
  );
};
