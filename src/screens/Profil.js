import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  Image,
  ScrollView,
  TouchableOpacity
} from "react-native";

// Libs Extenal
import { Button, Overlay, Header } from "react-native-elements";
import { withNavigation } from "react-navigation";

// Internal Component
import { BUTTON_COLOR_ONE } from "../../utils/colors";
import Container from "../components/Container";
import Title from "../components/Title";

import { Loading } from "../components/Loading";

_noData = () => {
  return <Title title="No data sorry " />;
};

function Profil({ navigation }) {
  const [infoUser, setInfoUser] = useState("null");

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
      </Container>
    </>
  );
}

const styles = StyleSheet.create({});
export default withNavigation(Profil);
