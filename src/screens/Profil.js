import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput
} from "react-native";

// Libs Extenal
import { Button, Overlay, Header } from "react-native-elements";
import { withNavigation } from "react-navigation";

// Internal Component
import { BUTTON_COLOR_ONE, COLOR_TEXT } from "../../utils/colors";
import Container from "../components/Container";
import Title from "../components/Title";

import { Loading } from "../components/Loading";
import useInput from "../hooks/useInput";
import { PutInfoUser } from "../../api/user";

_noData = () => {
  return <Title title="No data sorry " />;
};

function Profil({ navigation }) {
  const [infoUser, setInfoUser] = useState(undefined);
  const [firstInApp, setFirstInApp] = useState(true);

  // input Value

  const email = useInput();
  const password = useInput();

  const firstname = useInput();
  const lastname = useInput();
  // const birthday = useInput();

  useEffect(() => {
    //   ComponentDidMount
    if (firstInApp) {
      getInfo();
      setFirstInApp(false);
    }
  });

  const getInfo = async () => {
    const infoUserJson = await AsyncStorage.getItem("infoUser");
    let infoUser = JSON.parse(infoUserJson);
    console.log(infoUser);
    console.log();
    email.value = infoUser.email;

    setInfoUser(infoUser);
  };

  const _update = () => {
    PutInfoUser(infoUser.token, infoUser.uuid, {
      firstname: "deded",
      lastname: "dede"
    })
      .then(res => {
        alert("les données sont mis à jour");
        _updateStorage();
      })
      .catch(() => {
        console.log("erro");
      });
  };

  _updateStorage = async () => {
    let data = infoUser;
    data.firstname = firstname.value;
    data.lastname = lastname.value;
    await AsyncStorage.setItem("infoUser", JSON.stringify(data));
  };

  if (infoUser === undefined) {
    return <Loading />;
  } else if (infoUser === null) {
    return (
      <View style={[styles.container, styles.containerView]}>
        {this._noData()}
      </View>
    );
  }

  return (
    <>
      <Header
        backgroundColor={BUTTON_COLOR_ONE}
        centerComponent={{
          text: `Profil`,
          style: { color: "#fff", fontWeight: "bold", fontSize: 20 }
        }}
        rightComponent={{
          icon: "people",
          color: "#fff",
          onPress: () => {
            navigation.navigate("SignedOut"), AsyncStorage.clear();
          }
        }}
      />
      <Container>
        <Title title="Profil" />
        <View style={{}}>
          <TextInput
            style={styles.TextInput}
            placeholderTextColor={BUTTON_COLOR_ONE}
            {...email}
            editable={false}
            placeholder={infoUser.email}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.TextInput}
            placeholderTextColor={BUTTON_COLOR_ONE}
            {...firstname}
            placeholder="Firstname"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.TextInput}
            placeholderTextColor={BUTTON_COLOR_ONE}
            {...lastname}
            placeholder="Lastname"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Button
            onPress={_update}
            buttonStyle={styles.Button}
            disabledStyle={styles.desabled}
            disabledTitleStyle={{ color: BUTTON_COLOR_ONE }}
            title="Mettre à Jour"
          />
          {/* 
        <Text style={{ textDecorationLine: "underline" }}>
          Mot de Passe oublié
        </Text> */}
        </View>
      </Container>
    </>
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
  }
});
export default withNavigation(Profil);
