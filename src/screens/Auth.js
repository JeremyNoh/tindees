import React, { useState, useEffect } from "react";

import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  AsyncStorage,
  ScrollView
} from "react-native";
import { withNavigation } from "react-navigation";

// Internal Component
import {
  BACKGROUND_BODY,
  BUTTON_COLOR_ONE,
  COLOR_TEXT,
  TEXT_HEADER,
  BACKGROUND_HEADER,
  GREEN
} from "../../utils/colors";
import Container from "../components/Container";
import Title from "../components/Title";

// Libs Extenal
import { Button, ButtonGroup } from "react-native-elements";
import Select from "react-native-select-plus";

import useInput from "../hooks/useInput";
import { registerUser, connecteUser } from "../../api/auth";
import { arrayTypeUsers } from "../../utils/const";
import { country } from "../../assets/country/country";
import { ChangeLangue } from "../components/ChangeLangue";
import { translate, getAppLang } from "../../locale/local";
import { Loading } from "../components/Loading";

function Auth({ navigation }) {
  // for settup ComponentDidMount()
  const [firstInApp, setFirstInApp] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [TypeUser, setTypeUser] = useState(0);
  const [LangApp, setLangApp] = useState(undefined);

  const [Country, setCountry] = useState();
  // input Value
  const username = useInput();
  const email = useInput();
  const password = useInput();
  const lastname = useInput();
  const firstname = useInput();
  const address = useInput();
  const zip_code = useInput();

  useEffect(() => {
    //   ComponentDidMount
    if (firstInApp) {
      setLang();
      setFirstInApp(false);
    }
  });

  setLang = async () => {
    let getApLang = await getAppLang();
    setLangApp(getApLang);
  };

  // SWITCH INTO SIGNIN | SIGNUP
  _updateIndex = selectedIndex => {
    setSelectedIndex(selectedIndex);
  };

  // SWITCH INTO MIGRANT | LOCAUX
  _updateType = selectedIndex => {
    setTypeUser(selectedIndex);
  };
  // RECUP champs User and Try to Register
  _signUp = () => {
    let user = {
      email: email.value.toLowerCase(),
      password: password.value,
      password_confirmation: password.value,
      lastname: lastname.value || undefined,
      firstname: firstname.value || undefined,
      type: arrayTypeUsers[TypeUser],
      country: Country,
      address: address.value || undefined,
      zip_code: zip_code.value || undefined
    };

    // for register in DB online
    registerUser(user)
      .then(res => {
        Alert.alert(
          translate("AUTH.REGISTER_SUCCESS_TITLE", LangApp),
          translate("AUTH.REGISTER_SUCCESS_DESC", LangApp),
          [{ text: "OK" }]
        );
      })
      .catch(err => {
        alert(translate("ERROR.RETRY", LangApp));
      });
  };

  // RECUP champs User and Try to Connect & Stock INfo to Storage
  _signIn = () => {
    let user = {
      email: email.value.toLowerCase(),
      password: password.value
    };

    connecteUser(user)
      .then(async res => {
        let data = {
          email: res.data.user.email,
          nickname: username.value,
          uuid: res.data.user.uuid,
          token: res.token,
          firstname: res.data.user.firstname,
          lastname: res.data.user.lastname,
          type: res.data.user.type,
          birthdate: res.data.user.birthdate,
          city: res.data.user.city,
          country: res.data.user.country,
          zipCode: res.data.user.zipCode,
          country: res.data.user.country,
          address: res.data.user.address,
          zip_code: res.data.user.zip_code,
          photo_url: res.data.user.photo_url
        };
        await AsyncStorage.setItem("infoUser", JSON.stringify(data));
        navigation.navigate("Home");
      })
      .catch(err => {
        alert(err);
      });

    // navigation.navigate("Home");
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
          {...email}
          placeholder={translate("FIELDS.EMAIL", LangApp)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.TextInput}
          placeholderTextColor={BUTTON_COLOR_ONE}
          placeholder={translate("FIELDS.PASSWORD", LangApp)}
          autoCapitalize="none"
          textContentType="password"
          autoCorrect={false}
          secureTextEntry={true}
          {...password}
        />

        <Button
          onPress={() => _signIn()}
          buttonStyle={styles.Button}
          disabled={!(email.value.length >= 2 && password.value.length >= 4)}
          disabledStyle={styles.desabled}
          disabledTitleStyle={{ color: BUTTON_COLOR_ONE }}
          title={translate("AUTH.CONNECT", LangApp)}
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
      <View style={{ marginTop: 150, height: 350 }}>
        <ScrollView style={{ height: "100%" }}>
          <ButtonGroup
            onPress={setTypeUser}
            selectedIndex={TypeUser}
            buttons={arrayTypeUsers}
            containerStyle={{
              height: 30,
              width: 300,
              borderRadius: 20
            }}
            selectedButtonStyle={[
              {
                backgroundColor: GREEN
              }
            ]}
            selectedTextStyle={{
              color: "black"
            }}
          />
          <TextInput
            style={styles.TextInput}
            placeholderTextColor={BUTTON_COLOR_ONE}
            placeholder={translate("FIELDS.EMAIL", LangApp)}
            autoCapitalize="none"
            textContentType="emailAddress"
            {...email}
          />
          <TextInput
            style={styles.TextInput}
            placeholderTextColor={BUTTON_COLOR_ONE}
            placeholder={translate("FIELDS.PASSWORD", LangApp)}
            secureTextEntry={true}
            {...password}
          />
          <TextInput
            style={styles.TextInput}
            placeholderTextColor={BUTTON_COLOR_ONE}
            placeholder={translate("FIELDS.LASTNAME", LangApp)}
            autoCapitalize="none"
            autoCorrect={false}
            {...lastname}
          />
          <TextInput
            style={styles.TextInput}
            placeholderTextColor={BUTTON_COLOR_ONE}
            placeholder={translate("FIELDS.FIRSTNAME", LangApp)}
            autoCapitalize="none"
            autoCorrect={false}
            {...firstname}
          />
          <TextInput
            style={styles.TextInput}
            placeholderTextColor={BUTTON_COLOR_ONE}
            placeholder={translate("FIELDS.ADDRESS", LangApp)}
            dataDetectorTypes="address"
            {...address}
          />
          <TextInput
            style={styles.TextInput}
            placeholderTextColor={BUTTON_COLOR_ONE}
            placeholder={translate("FIELDS.ZIP_CODE", LangApp)}
            keyboardType="numeric"
            autoCorrect={false}
            maxLength={5}
            {...zip_code}
          />
          <Select
            data={country}
            width={300}
            placeholder={translate("FIELDS.ORIGIN", LangApp)}
            onSelect={(key, value) => {
              setCountry(value);
            }}
            search={true}
            style={[styles.TextInput, {}]}
          />
        </ScrollView>
        <Button
          onPress={() => _signUp()}
          buttonStyle={styles.Button}
          title={translate("AUTH.REGISTER_ACTION", LangApp)}
          disabled={
            !(password.value.length >= 4 && _validateEmail(email.value))
          }
          disabledStyle={styles.desabled}
          disabledTitleStyle={{ color: BUTTON_COLOR_ONE }}
        />
      </View>
    );
  };

  if (!LangApp) {
    return <Loading />;
  }

  return (
    <Container>
      <View
        style={{
          position: "absolute",
          bottom: 50,
          // right: 20,
          alignItems: "center"
        }}
      >
        <ChangeLangue LangApp={LangApp} />
      </View>
      <View style={{ position: "absolute", top: 70, alignItems: "center" }}>
        <Title title="Tindees" style={{ color: BUTTON_COLOR_ONE }} />

        <ButtonGroup
          onPress={_updateIndex}
          selectedIndex={selectedIndex}
          buttons={[
            translate("AUTH.CONNECTION", LangApp),
            translate("AUTH.REGISTER", LangApp)
          ]}
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
  headerTintColor: TEXT_HEADER,
  headerStyle: {
    backgroundColor: BACKGROUND_HEADER
  }
});

export default withNavigation(Auth);
