import React, { Component } from "react";

import {
  StyleSheet,
  Image,
  TouchableOpacity,
  AsyncStorage
} from "react-native";

// Libs Extenal
import { Header } from "react-native-elements";

// Internal Component
import { BUTTON_COLOR_ONE } from "../../utils/colors";
import Container from "../components/Container";
import Title from "../components/Title";
import Icon from "react-native-vector-icons/FontAwesome";

class Home extends Component {
  componentDidMount() {}

  render() {
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
              this.props.navigation.navigate("SignedOut"), AsyncStorage.clear();
            }
          }}
        />
        <Container>
          <Title title="Home" />
        </Container>
      </>
    );
  }
}

const styles = StyleSheet.create({});

export default Home;
