import React from "react";

import { View, StyleSheet, TextInput, Alert } from "react-native";

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

class Auth extends React.Component {
  state = {
    user: {
      email: "",
      username: "",
      password: ""
    },
    selectedIndex: 0
  };

  static navigationOptions = ({ navigation }) => ({
    title: "Viens partager sur des sujets Communs",
    headerTintColor: TEXT_HEADER,
    headerStyle: {
      backgroundColor: BACKGROUND_HEADER
    }
  });

  componentDidMount() {
    // this.props.navigation.navigate("Home");
  }

  // SWITCH INTO SIGNIN | SIGNUP
  _updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
  };

  //  UPDATE INFO of User
  updateStateHandler = (key, value) => {
    let { user } = this.state;

    user[key] = value;
    this.setState({
      user
    });
  };

  _stockInfoStorage = async userInfo => {
    // stokage du token
    const resStorage = await saveInfo(userInfo);
    if (resStorage.data.success === false) {
      alert(resStorage.data.errorMessage);
      return false;
    }
    // Redirection
    this.props.navigation.navigate("Home");
  };

  // RECUP champs User and Try to Register
  _signUp = async () => {};

  // RECUP champs User and Try to Connect & Stock INfo to Storage
  _signIn = async () => {
    this.props.navigation.navigate("Home");
  };

  // Regex for Check Email
  _validateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  }

  // VIEW - For Connect
  connectionView = () => {
    let { user } = this.state;

    return (
      <View style={{ marginTop: 200 }}>
        <TextInput
          style={styles.TextInput}
          placeholderTextColor={BUTTON_COLOR_ONE}
          value={user.email}
          placeholder="Username"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={val => this.updateStateHandler("email", val)}
        />
        <TextInput
          style={styles.TextInput}
          placeholderTextColor={BUTTON_COLOR_ONE}
          value={user.password}
          placeholder="Password"
          autoCapitalize="none"
          textContentType="password"
          autoCorrect={false}
          secureTextEntry={true}
          onChangeText={val => this.updateStateHandler("password", val)}
        />

        <Button
          onPress={() => this._signIn()}
          buttonStyle={styles.Button}
          disabled={!(user.email.length >= 6 && user.password.length >= 6)}
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
    let { user } = this.state;
    return (
      <View style={{ marginTop: 200 }}>
        <TextInput
          style={styles.TextInput}
          placeholderTextColor={BUTTON_COLOR_ONE}
          value={user.email}
          placeholder="Email"
          autoCapitalize="none"
          textContentType="emailAddress"
          onChangeText={val => this.updateStateHandler("email", val)}
        />
        <TextInput
          style={styles.TextInput}
          placeholderTextColor={BUTTON_COLOR_ONE}
          value={user.username}
          placeholder="Username"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={val => this.updateStateHandler("username", val)}
        />
        <TextInput
          style={styles.TextInput}
          placeholderTextColor={BUTTON_COLOR_ONE}
          value={user.password}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={val => this.updateStateHandler("password", val)}
        />
        {/* <TextInput
          style={styles.TextInput}
          placeholderTextColor={BUTTON_COLOR_ONE}
          value={user.confirmPassword}
          placeholder="Confirmer le password"
          secureTextEntry={false}
          autoCorrect={false}
          onChangeText={val => this.updateStateHandler("confirmPassword", val)}
        /> */}

        <Button
          onPress={() => this._signUp()}
          buttonStyle={styles.Button}
          title="S'enregistrer"
          disabled={
            !(
              user.username.length >= 1 &&
              user.password.length >= 5 &&
              this._validateEmail(user.email)
            )
          }
          disabledStyle={styles.desabled}
          disabledTitleStyle={{ color: BUTTON_COLOR_ONE }}
        />
      </View>
    );
  };

  render() {
    let { selectedIndex } = this.state;

    return (
      <Container>
        <View style={{ position: "absolute", top: 70, alignItems: "center" }}>
          <Title title="Tindees" style={{ color: BUTTON_COLOR_ONE }} />
          <ButtonGroup
            onPress={this._updateIndex}
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
        {selectedIndex === 0 && this.connectionView()}
        {selectedIndex === 1 && this.registerView()}
      </Container>
    );
  }
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

export default Auth;
