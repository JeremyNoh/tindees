import React, { useEffect, useState } from "react";

import { StyleSheet, AsyncStorage, ScrollView, View } from "react-native";

// Libs Extenal
import { Header, ButtonGroup } from "react-native-elements";
import { withNavigation } from "react-navigation";

// Internal Component
import { BUTTON_COLOR_ONE, BACKGROUND_BODY } from "../../utils/colors";
import Container from "../components/Container";
import Title from "../components/Title";
import Icon from "react-native-vector-icons/FontAwesome";
import CardEvent from "../components/CardEvent";

const Mock = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function Home({ navigation }) {
  const [firstInApp, setFirstInApp] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    //   ComponentDidMount
    if (firstInApp) {
      setFirstInApp(false);
    }
  });

  // SWITCH INTO FUTURE EVENT | MY EVENT
  _updateIndex = selectedIndex => {
    setSelectedIndex(selectedIndex);
  };

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
      <View style={{ alignItems: "center" }}>
        <ButtonGroup
          onPress={_updateIndex}
          selectedIndex={selectedIndex}
          buttons={["ALL", "Mes Events"]}
          containerStyle={{
            height: 30,
            width: 300,
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

      <ScrollView style={{ height: "100%" }}>
        {Mock.map((element, index) => {
          return <CardEvent key={index} props={element} onPress={() => {}} />;
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({});

export default withNavigation(Home);
