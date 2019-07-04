import React from "react";

import { TextInput, StyleSheet } from "react-native";
import { BUTTON_COLOR_ONE } from "../../utils/colors";
import useInput from "../hooks/useInput";

export const TextInputComponent = props => {
  return (
    <TextInput
      style={[styles.TextInput, props.style]}
      placeholderTextColor={BUTTON_COLOR_ONE}
      placeholder="Nom de l'event"
      autoCapitalize="none"
      autoCorrect={false}
      secureTextEntry={true}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  TextInput: {
    alignItems: "center",
    height: 40,
    marginVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: BUTTON_COLOR_ONE,
    color: COLOR_TEXT,
    width: 300
  }
});

export default TextInputComponent;
