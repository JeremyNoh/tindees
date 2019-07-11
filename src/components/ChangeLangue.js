import React, { useState } from "react";

import { StyleSheet, Image, Alert } from "react-native";
import { BUTTON_COLOR_ONE } from "../../utils/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { setAppLang } from "../../locale/local";

import { Updates, Expo } from "expo";

export const ChangeLangue = () => {
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
      "Langue non supportée",
      "Cette langue n'est pas encore supportée 😥",
      [
        {
          text: "Choisir une nouvelle langue",
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
      "Pick a Language for your App",
      "",
      [
        {
          text: "Francais",
          onPress: () => {
            setLang("fr");
          }
        },
        {
          text: "Anglais",
          onPress: () => {
            setLang("en");
          }
        },
        {
          text: "Espagnol",
          onPress: () => {
            setLang("es");
          }
        },
        {
          text: "Annuler",
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
