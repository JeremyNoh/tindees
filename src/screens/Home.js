import React, { useEffect, useState } from "react";

import { StyleSheet, AsyncStorage } from "react-native";

// Libs Extenal
import { Header } from "react-native-elements";
import { withNavigation } from "react-navigation";

// Internal Component
import { BUTTON_COLOR_ONE } from "../../utils/colors";
import Container from "../components/Container";
import Title from "../components/Title";
import Icon from "react-native-vector-icons/FontAwesome";

function Home({ navigation }) {
  const [firstInApp, setFirstInApp] = useState(true);

  useEffect(() => {
    //   ComponentDidMount
    if (firstInApp) {
      setFirstInApp(false);
    }
  });

  return (
    <>
      <Header
        backgroundColor={BUTTON_COLOR_ONE}
        centerComponent={{
          text: `Home`,
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
        <Title title="Home" />
      </Container>
    </>
  );
}

const styles = StyleSheet.create({});

export default withNavigation(Home);
