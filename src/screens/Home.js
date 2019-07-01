import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  AsyncStorage,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  TouchableHighlight
} from "react-native";

// Libs Extenal
import { Header, ButtonGroup } from "react-native-elements";
import { withNavigation } from "react-navigation";

// Internal Component
import { BUTTON_COLOR_ONE, BACKGROUND_BODY } from "../../utils/colors";
import Container from "../components/Container";
import Title from "../components/Title";
import Icon from "react-native-vector-icons/FontAwesome";
import CardEvent from "../components/CardEvent";
import { ModalEvent } from "../components/ModalEvent";
import { getAllCategory } from "../../api/categorie";

const Mock = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function Home({ navigation }) {
  const [firstInApp, setFirstInApp] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isEventModalOpen, setIsModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoUser, setInfoUser] = useState(null);
  const [category, setCategory] = useState(null);
  useEffect(() => {
    //   ComponentDidMount
    if (firstInApp) {
      AsyncStorage.getItem("infoUser").then(value => {
        let info = JSON.parse(value);
        setInfoUser(info);

        console.log(info);
        getAllCategory(info.token)
          .then(res => {
            console.log("res");

            console.log(res);

            // setCategory(res);
          })
          .catch(err => {
            console.log("erre");

            console.log(err);
            setCategory(null);
          });
      });
      setFirstInApp(false);
    }
  });

  // SWITCH INTO FUTURE EVENT | MY EVENT
  _updateIndex = selectedIndex => {
    setSelectedIndex(selectedIndex);
  };

  const modalAddEvent = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <Container>
          <View>
            <Text>Ajoute un Event!</Text>

            <TouchableHighlight
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text>Hide Modal</Text>
            </TouchableHighlight>
          </View>
        </Container>
      </Modal>
    );
  };

  return (
    <>
      <Header
        backgroundColor={BUTTON_COLOR_ONE}
        centerComponent={{
          text: `Home`,
          style: { color: "#fff", fontWeight: "bold", fontSize: 20 }
        }}
        leftComponent={
          <TouchableOpacity
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <Image
              source={require("../../assets/addEventWhite.png")}
              style={{
                width: 35,
                height: 35
              }}
            />
          </TouchableOpacity>
        }
        rightComponent={{
          icon: "people",
          color: "#fff",
          onPress: () => {
            navigation.navigate("SignedOut"), AsyncStorage.clear();
          }
        }}
      />

      <View
        style={{ alignItems: "center", flexDirection: "row", paddingLeft: 20 }}
      >
        {modalAddEvent()}
        {isEventModalOpen && <ModalEvent isClose={setIsModalOpen} />}
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
        <TouchableOpacity
          onPress={() => {
            console.log("filter");
          }}
        >
          <Image
            source={require("../../assets/menu.png")}
            style={{ width: 35, height: 35 }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ height: "100%" }}>
        {Mock.map((element, index) => {
          return (
            <CardEvent
              key={index}
              props={element}
              onPress={() => {
                setIsModalOpen(true);
              }}
            />
          );
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({});

export default withNavigation(Home);
