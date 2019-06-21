import React from "react";
import { StyleSheet, AsyncStorage } from "react-native";

// Internal Component
import { BACKGROUND_HEADER, TEXT_HEADER } from "../../utils/colors";
import Container from "../components/Container";
import { Loading } from "../components/Loading";

class SplashScreen extends React.Component {
  state = {};

  async componentWillMount() {
    const infoUser = await AsyncStorage.getItem("infoUser");
    if (infoUser) {
      this.props.navigation.navigate("SignedIn");
      return true;
    } else {
      this.props.navigation.navigate("SignedOut");
      return false;
    }
  }
  componentDidMount() {}

  render() {
    return (
      <Container>
        <Loading />
      </Container>
    );
  }
}

const styles = StyleSheet.create({});

export default SplashScreen;
