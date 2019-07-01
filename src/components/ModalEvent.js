import React, { useState } from "react";
import { Overlay } from "react-native-elements";

import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity
} from "react-native";
import Title from "./Title";

export const ModalEvent = props => {
  return (
    <Overlay
      isVisible={true}
      windowBackgroundColor="rgba(255, 255, 255, .5)"
      overlayBackgroundColor="white"
      onBackdropPress={() => props.isClose(false)}
      height="auto"
      width="auto"
    >
      <View>
        <TouchableOpacity
          onPress={() => {
            props.isClose(false);
          }}
        >
          <Image
            source={require("../../assets/cross.png")}
            style={{ width: 35, height: 35 }}
          />
        </TouchableOpacity>
        <Title title="dadadazdza" />
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({});
