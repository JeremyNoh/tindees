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
import { Button } from "react-native-elements";
import { joinEvent } from "../../api/event";
import { BUTTON_COLOR_ONE, BACKGROUND_BODY } from "../../utils/colors";

export const ModalEvent = ({ event, isClose, token, uuid }) => {
  const _joinEvent = () => {
    joinEvent({
      event_id: event.id,
      uuid,
      token
    })
      .then(res => {
        console.log(res);

        console.log("OKKKEYYYY");
      })
      .catch(err => {
        console.log("EERRRROO");

        console.log(err);
      });
  };

  return (
    <Overlay
      isVisible={true}
      windowBackgroundColor="rgba(255, 255, 255, .5)"
      overlayBackgroundColor="white"
      onBackdropPress={() => isClose(false)}
      height="auto"
      width="auto"
    >
      <View>
        <TouchableOpacity
          onPress={() => {
            isClose(false);
          }}
        >
          <Image
            source={require("../../assets/cross.png")}
            style={{ width: 35, height: 35 }}
          />
        </TouchableOpacity>
        <Title title={event.name} />

        <Button
          onPress={() => {
            _joinEvent();
          }}
          buttonStyle={[
            styles.Button,
            {
              height: 50,
              backgroundColor: BACKGROUND_BODY,
              borderWidth: 1,
              borderColor: BUTTON_COLOR_ONE,
              borderRadius: 5
            }
          ]}
          title="Je Participe"
          titleStyle={{ color: "black" }}
        />
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  Button: {
    height: 50,
    backgroundColor: BUTTON_COLOR_ONE,
    marginBottom: 10,
    marginTop: 90,
    borderRadius: 5
  }
});
