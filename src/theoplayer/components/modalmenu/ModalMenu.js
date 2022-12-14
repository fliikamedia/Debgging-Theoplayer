import {
  Modal,
  StyleProp,
  View,
  ViewStyle,
  TextStyle,
  Text,
  ViewProps,
  Platform,
  TouchableOpacity,
} from "react-native";
import React from "react";
import styles from "./ModalMenu.style";

export const ModalMenu = (props) => {
  const { visible, style, children, title, titleStyle, onRequestClose } = props;
  return (
    <>
      {visible && (
        <Modal
          animationType="fade"
          supportedOrientations={["landscape"]}
          transparent={true}
          visible={visible}
          onRequestClose={() => {
            if (onRequestClose) {
              onRequestClose();
            }
          }}
        >
          {!Platform.isTV && (
            <TouchableOpacity
              style={styles.container}
              onPress={() => {
                if (onRequestClose) {
                  onRequestClose();
                }
              }}
            >
              <View style={[styles.modal, style]}>
                {title && (
                  <Text
                    style={[
                      styles.title,
                      titleStyle,
                      { color: "black", backgroundColor: "aqua" },
                    ]}
                  >
                    {title}
                  </Text>
                )}
                <View style={styles.rowContainer}>{children}</View>
              </View>
            </TouchableOpacity>
          )}

          {Platform.isTV && (
            <View style={styles.container}>
              <View style={[styles.modal, style]}>
                {title && (
                  <Text
                    style={[
                      styles.title,
                      titleStyle,
                      { color: "black", backgroundColor: "#ffc50f" },
                    ]}
                  >
                    {title}
                  </Text>
                )}
                <View style={styles.rowContainer}>{children}</View>
              </View>
            </View>
          )}
        </Modal>
      )}
    </>
  );
};
