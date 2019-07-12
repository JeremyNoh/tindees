import React, { useState } from "react";

import { StyleSheet, Image, Alert } from "react-native";
import { BUTTON_COLOR_ONE } from "../../utils/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { setAppLang, translate } from "../../locale/local";

import { Updates, Expo } from "expo";

export const ChangeLangue = ({ LangApp }) => {
  const setLang = async lang => {
    let result = await setAppLang(lang);
    if (result) {
      Updates.reload();
    } else {
      AlertNotLangSupported();
    }
  };
  AlertNotLangSupported = () => {
    Alert.alert(
      translate("ALERT.LANGUE_NO_AVAILABLE_TITLE", LangApp),
      translate("ALERT.LANGUE_NO_AVAILABLE_DESC", LangApp),
      [
        {
          text: `${translate("ALERT.LANGUE_CHOICE_LANGUE", LangApp)}`,
          onPress: () => {
            alertChangeLangue();
          }
        },
        {
          text: "OK",
          onPress: () => {}
        }
      ],
      { cancelable: false }
    );
  };

  // View for change the Langue
  alertChangeLangue = () => {
    Alert.alert(
      translate("ALERT.LANGUE_PICK", LangApp),
      "",
      [
        {
          text: `${translate("ALERT.FRENCH", LangApp)}`,
          onPress: () => {
            setLang("fr");
          }
        },
        {
          text: `${translate("ALERT.ENGLISH", LangApp)}`,
          onPress: () => {
            setLang("en");
          }
        },
        {
          text: `${translate("ALERT.SPANISH", LangApp)}`,
          onPress: () => {
            setLang("es");
          }
        },
        {
          text: `${translate("ALERT.CANCEL", LangApp)}`,
          onPress: () => {}
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity onPress={alertChangeLangue}>
      <Image
        source={require("../../assets/langue.png")}
        style={{ width: 50, height: 50 }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});
