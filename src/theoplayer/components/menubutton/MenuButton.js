// import type { ImageSourcePropType, ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import React, { useState } from "react";
import { ActionButton } from "../actionbutton/ActionButton";
import { ModalMenu } from "../modalmenu/ModalMenu";
import { MenuRow } from "../modalmenu/MenuRow";

export const MenuButton = (props) => {
  const {
    icon,
    title,
    data,
    keyExtractor,
    onItemSelected,
    selectedItem,
    modalStyle,
    iconStyle,
    modalTitleStyle,
    style,
    minimumItems,
    cleartimeout,
    setScreenClicked,
  } = props;
  const [modalVisible, setModalVisible] = useState(false);
  // console.log("dataaaaaaaaas", selectedItem);
  // Don't show the menu if it has less items than the preset minimum.
  if (!data || data.length < minimumItems) {
    return <></>;
  }

  return (
    <>
      <ActionButton
        icon={icon}
        iconStyle={iconStyle}
        onPress={() => {
          setModalVisible(true);
          cleartimeout();
        }}
        style={style}
      />

      {modalVisible && (
        <ModalMenu
          visible={modalVisible}
          style={modalStyle}
          titleStyle={modalTitleStyle}
          onRequestClose={() => {
            setModalVisible(false);
            setScreenClicked(false);
          }}
          title={title}
        >
          {data.map((item, index) => (
            <MenuRow
              key={keyExtractor ? keyExtractor(index) : ""}
              onSelected={() => {
                if (onItemSelected) {
                  onItemSelected(index);
                }
                setModalVisible(false);
                setScreenClicked(false);
              }}
              onUnselected={() => {
                if (onItemSelected) {
                  onItemSelected(-1);
                }
                setModalVisible(false);
                setScreenClicked(false);
              }}
              selected={selectedItem === index}
              data={item}
            />
          ))}
        </ModalMenu>
      )}
    </>
  );
};

MenuButton.defaultProps = {
  minimumItems: 1,
};
