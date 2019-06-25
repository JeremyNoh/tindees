import React, { useState } from "react";

import { View, StyleSheet, TextInput, Alert, AsyncStorage } from "react-native";
import { withNavigation } from "react-navigation";

// Internal Component
import {
  BACKGROUND_BODY,
  BUTTON_COLOR_ONE,
  COLOR_TEXT,
  TEXT_HEADER,
  BACKGROUND_HEADER
} from "../../utils/colors";
import Container from "../components/Container";
import Title from "../components/Title";

// Libs Extenal
import { Button, ButtonGroup } from "react-native-elements";

import { Loading } from "../components/Loading";

import { saveInfo } from "../../utils/functionNative";
import useInput from "../hooks/useInput";
import { registerUser, connecteUser } from "../../api/auth";

function Auth({ navigation }) {
  navigation.navigate("Home");

  const [selectedIndex, setSelectedIndex] = useState(0);

  // input Value
  const username = useInput();
  const email = useInput();
  const password = useInput();

  // SWITCH INTO SIGNIN | SIGNUP
  _updateIndex = selectedIndex => {
    setSelectedIndex(selectedIndex);
  };

  // RECUP champs User and Try to Register
  _signUp = () => {
    let user = {
      email: email.value,
      nickname: username.value,
      password: password.value,
      password_confirmation: password.value
    };

    // for register in DB online

    // registerUser(user)
    //   .then(res => {
    //     Alert.alert(
    //       "Inscription réussi",
    //       "Je t'invite à te connecter ",
    //       [{ text: "OK" }]
    //     );
    //   })
    //   .catch(err => {
    //     alert("Error please retry");
    //   });
  };

  // RECUP champs User and Try to Connect & Stock INfo to Storage
  _signIn = () => {
    let user = {
      username: username.value,
      password: password.value
    };

    // for connect in DB online

    // connecteUser(user)
    // .then(async res => {
    //   let data = {
    //     email: res.data.user.email,
    //     nickname: res.data.user.nickname,
    //     uuid: res.data.user.uuid,
    //     token: res.token,
    //     firstname: res.data.user.firstname,
    //     lastname: res.data.user.lastname
    //   };
    //   await AsyncStorage.setItem("infoUser", JSON.stringify(data));
    //   navigation.navigate("Home");
    // })
    // .catch(err => {
    //   alert("Error please retry");
    //   console.log(err);
    // });

    navigation.navigate("Home");
  };

  // Regex for Check Email
  _validateEmail = mail => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  };

  // VIEW - For Connect
  connectionView = () => {
    return (
      <View style={{ marginTop: 200 }}>
        <TextInput
          style={styles.TextInput}
          placeholderTextColor={BUTTON_COLOR_ONE}
          {...username}
          placeholder="Username"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.TextInput}
          placeholderTextColor={BUTTON_COLOR_ONE}
          placeholder="Password"
          autoCapitalize="none"
          textContentType="password"
          autoCorrect={false}
          secureTextEntry={true}
          {...password}
        />

        <Button
          onPress={() => _signIn()}
          buttonStyle={styles.Button}
          disabled={!(username.value.length >= 2 && password.value.length >= 4)}
          disabledStyle={styles.desabled}
          disabledTitleStyle={{ color: BUTTON_COLOR_ONE }}
          title="Se connecter"
        />
        {/* 
        <Text style={{ textDecorationLine: "underline" }}>
          Mot de Passe oublié
        </Text> */}
      </View>
    );
  };

  // VIEW - For Register
  registerView = () => {
    return (
      <View style={{ marginTop: 200 }}>
        <TextInput
          style={styles.TextInput}
          placeholderTextColor={BUTTON_COLOR_ONE}
          placeholder="Email"
          autoCapitalize="none"
          textContentType="emailAddress"
          {...email}
        />
        <TextInput
          style={styles.TextInput}
          placeholderTextColor={BUTTON_COLOR_ONE}
          placeholder="Username"
          autoCapitalize="none"
          autoCorrect={false}
          {...username}
        />
        <TextInput
          style={styles.TextInput}
          placeholderTextColor={BUTTON_COLOR_ONE}
          placeholder="Password"
          secureTextEntry={true}
          {...password}
        />

        <Button
          onPress={() => _signUp()}
          buttonStyle={styles.Button}
          title="S'enregistrer"
          disabled={
            !(
              username.value.length >= 1 &&
              password.value.length >= 4 &&
              _validateEmail(email.value)
            )
          }
          disabledStyle={styles.desabled}
          disabledTitleStyle={{ color: BUTTON_COLOR_ONE }}
        />
      </View>
    );
  };

  return (
    <Container>
      <View style={{ position: "absolute", top: 70, alignItems: "center" }}>
        <Title title="Tindees" style={{ color: BUTTON_COLOR_ONE }} />
        <ButtonGroup
          onPress={_updateIndex}
          selectedIndex={selectedIndex}
          buttons={["Se Connecter", "S'inscrire"]}
          containerStyle={{
            height: 30,
            width: 300,
            marginTop: 100,
            borderRadius: 5,
            backgroundColor: BACKGROUND_BODY,
            borderColor: BUTTON_COLOR_ONE
          }}
          selectedButtonStyle={[
            {
              backgroundColor: BUTTON_COLOR_ONE
            }
          ]}
          selectedTextStyle={{
            color: BACKGROUND_BODY
          }}
        />
      </View>
      {selectedIndex === 0 && connectionView()}
      {selectedIndex === 1 && registerView()}
    </Container>
  );
}

const styles = StyleSheet.create({
  TextInput: {
    alignItems: "center",
    height: 40,
    marginVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: BUTTON_COLOR_ONE,
    color: COLOR_TEXT,
    width: 300
  },
  Button: {
    height: 50,
    backgroundColor: BUTTON_COLOR_ONE,
    marginBottom: 10,
    marginTop: 90,
    borderRadius: 5
  },
  desabled: {
    height: 50,
    backgroundColor: BACKGROUND_BODY,
    borderWidth: 1,
    borderColor: BUTTON_COLOR_ONE,
    borderRadius: 5
  }
});

Auth.navigationOptions = () => ({
  title: "Partage sur des sujets Communs",
  headerTintColor: TEXT_HEADER,
  headerStyle: {
    backgroundColor: BACKGROUND_HEADER
  }
});

export default withNavigation(Auth);
