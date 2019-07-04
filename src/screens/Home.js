import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  AsyncStorage,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput
} from "react-native";

// Libs Extenal
import { Header, ButtonGroup, Button } from "react-native-elements";
import { withNavigation } from "react-navigation";

// Internal Component
import {
  BUTTON_COLOR_ONE,
  BACKGROUND_BODY,
  COLOR_TEXT
} from "../../utils/colors";
import Container from "../components/Container";
import Title from "../components/Title";

import CardEvent from "../components/CardEvent";
import { ModalEvent } from "../components/ModalEvent";
import { getAllCategory } from "../../api/categorie";

// Hok
import useInput from "../hooks/useInput";

// for Add Event
import { addEvent } from "../../api/event";
import DatePicker from "react-native-datepicker";

const Mock = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const addEventFunc = (setModalVisible, infoEvent) => {
  addEvent(infoEvent)
    .then(res => {
      console.log("good post event");
    })
    .catch(err => {
      console.log("err post event");
    });
  setModalVisible(false);
};

function Home({ navigation }) {
  const [firstInApp, setFirstInApp] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isEventModalOpen, setIsModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoUser, setInfoUser] = useState(null);
  const [category, setCategory] = useState(null);

  // form for add Event
  const nameEvent = useInput();
  const descEvent = useInput();
  const [date, setDate] = useState("2016-05-15");
  const [isDateVisible, setIsDateVisible] = useState(false);

  const getInfo = async () => {
    const infoUserJson = await AsyncStorage.getItem("infoUser");
    let infoUser = JSON.parse(infoUserJson);
    setInfoUser(infoUser);

    getAllCategory(infoUser.token)
      .then(res => {
        console.log("ok");
        setCategory(res);
      })
      .catch(err => {
        console.log("err fetch data ");

        // console.log(err);
        setCategory(null);
      });
  };

  useEffect(() => {
    //   ComponentDidMount
    if (firstInApp) {
      getInfo();
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
            <Title title="Créer un Event" />
            <TextInput
              style={styles.TextInput}
              placeholderTextColor={BUTTON_COLOR_ONE}
              placeholder="nom de l'evenement"
              autoCapitalize="none"
              {...nameEvent}
            />
            <TextInput
              style={[
                styles.TextInput,
                {
                  height: styles.TextInput.height * 2,
                  borderWidth: styles.TextInput.borderBottomWidth,
                  borderColor: styles.TextInput.borderBottomColor
                }
              ]}
              placeholderTextColor={BUTTON_COLOR_ONE}
              placeholder="Description"
              autoCapitalize="none"
              multiline={true}
              numberOfLines={4}
              {...descEvent}
            />
            <DatePicker
              date={date}
              mode="datetime"
              placeholder="select date"
              format="YYYY-MM-DD"
              minDate="2016-05-01"
              style={{
                width: 200,
                borderWidth: 1,
                borderColor: "#EDF0F2",
                borderRadius: 6
              }}
              maxDate="2016-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: "absolute",
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={date => {
                setDate({ date });
              }}
            />

            <Button
              onPress={() => {
                addEventFunc(setModalVisible, {
                  description: descEvent.value,
                  name: nameEvent,
                  uuid: infoUser.uuid,
                  userToken: infoUser.userToken
                });
              }}
              buttonStyle={styles.Button}
              title="Ajouter"
            />
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
  }
});

export default withNavigation(Home);
