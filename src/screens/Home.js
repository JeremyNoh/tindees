import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  AsyncStorage,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Text
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
import { addEvent, getMyEvents, getEvents } from "../../api/event";
import DatePicker from "react-native-datepicker";
import Select from "react-native-select-plus";

const items = [
  { key: 22, label: "Red Apples" },
  { key: 33, label: "Cherries" },
  { key: 44, label: "Cranberries" },
  { key: 54, label: "Pink Grapefruit" },
  { key: 60, label: "Raspberries" },
  { key: 87, label: "Beets" },
  { key: 9, label: "Red Peppers" },
  { key: 10, label: "Radishes" },
  { key: 11, label: "Radicchio" },
  { key: 12, label: "Red Onions" },
  { key: 13, label: "Red Potatoes" },
  { key: 14, label: "Rhubarb" },
  { key: 15, label: "Tomatoes" }
];
const Mock = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const addEventFunc = (setModalVisible, infoEvent) => {
  addEvent(infoEvent)
    .then(res => {
      console.log("good post event");
    })
    .catch(err => {
      console.log(err);

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
  const [InfoEventSelect, setInfoEventSelect] = useState(null);
  // For ALL EVENT
  const [AllEvent, setAllEvent] = useState(undefined);

  // For My EVENT
  const [MyEvent, setMyEvent] = useState(undefined);

  // form for add Event
  const nameEvent = useInput();
  const descEvent = useInput();
  const [AddInfoEvent, setAddInfoEvent] = useState({
    startDate: new Date(),
    endDate: new Date()
  });

  const getInfo = async () => {
    const infoUserJson = await AsyncStorage.getItem("infoUser");
    let infoUser = JSON.parse(infoUserJson);

    setInfoUser(infoUser);

    getAllCategory(infoUser.token)
      .then(res => {
        let categoryResult = [];
        res.data.forEach(oneCategory => {
          categoryResult.push({
            key: oneCategory.id,
            label: oneCategory.libelle
          });
        });

        setCategory(categoryResult);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getInfoEvents = async () => {
    const infoUserJson = await AsyncStorage.getItem("infoUser");
    let infoUser = JSON.parse(infoUserJson);

    getMyEvents(infoUser.token, infoUser.uuid)
      .then(res => {
        setMyEvent(res.data);
      })
      .catch(err => {
        console.log(err);
      });

    getEvents(infoUser.token, infoUser.uuid)
      .then(res => {
        setAllEvent(res.data);
      })
      .catch(err => {});
  };

  useEffect(() => {
    //   ComponentDidMount
    if (firstInApp) {
      getInfo();
      getInfoEvents();
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
        <>
          <Button
            onPress={() => {
              setModalVisible(false);
            }}
            buttonStyle={[
              styles.Button,
              {
                marginHorizontal: 20,
                height: 50,
                backgroundColor: BACKGROUND_BODY,
                borderWidth: 1,
                borderColor: BUTTON_COLOR_ONE,
                borderRadius: 5
              }
            ]}
            title="Fermer"
            titleStyle={{ color: "black" }}
          />

          <Container>
            <ScrollView>
              <View>
                <Title title="Créer un Event" />
                <Select
                  data={category}
                  width={300}
                  placeholder="Choisi ma Categorie"
                  onSelect={(key, value) =>
                    setAddInfoEvent({ ...AddInfoEvent, id_category: key })
                  }
                  search={true}
                  style={[styles.TextInput, {}]}
                />
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
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.textPlaceholder}>
                    Choisi le debut et la fin de l'event :
                  </Text>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: 5
                    }}
                  >
                    <View style={{ marginRight: 20 }}>
                      <DatePicker
                        date={AddInfoEvent.startDate}
                        mode="datetime"
                        placeholder="Debut de l'event"
                        minDate={new Date()}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        is24Hour={true}
                        style={{
                          width: 140,
                          borderWidth: 1,
                          borderColor: "#EDF0F2",
                          borderRadius: 6
                        }}
                        customStyles={{
                          dateIcon: {
                            position: "absolute",
                            left: 0,
                            top: 4,
                            marginLeft: 0,
                            height: 0,
                            width: 0
                          },
                          dateInput: {
                            marginLeft: 36
                          },
                          dateInput: {
                            borderWidth: 0,
                            borderBottomWidth: 0.5,
                            borderColor: BUTTON_COLOR_ONE
                          }
                        }}
                        onDateChange={date => {
                          setAddInfoEvent({ ...AddInfoEvent, startDate: date });
                        }}
                      />
                    </View>

                    <View>
                      <DatePicker
                        date={AddInfoEvent.endDate}
                        mode="datetime"
                        placeholder="Fin de l'event"
                        minDate={AddInfoEvent.startDate}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        is24Hour={true}
                        style={{
                          width: 140,
                          borderWidth: 1,
                          borderColor: "#EDF0F2",
                          borderRadius: 6
                        }}
                        customStyles={{
                          dateIcon: {
                            position: "absolute",
                            left: 0,
                            top: 4,
                            marginLeft: 0,
                            height: 0,
                            width: 0
                          },
                          dateInput: {
                            marginLeft: 36
                          },
                          dateInput: {
                            borderWidth: 0,
                            borderBottomWidth: 0.5,
                            borderColor: BUTTON_COLOR_ONE
                          }
                        }}
                        onDateChange={date => {
                          setAddInfoEvent({ ...AddInfoEvent, endDate: date });
                        }}
                      />
                    </View>
                  </View>
                </View>
                <Button
                  onPress={() => {
                    addEventFunc(setModalVisible, {
                      ...AddInfoEvent,
                      description: descEvent.value,
                      name: nameEvent.value,
                      uuid: infoUser.uuid,
                      token: infoUser.token
                    });
                  }}
                  buttonStyle={styles.Button}
                  title="Ajouter"
                />
              </View>
            </ScrollView>
          </Container>
        </>
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
        {isEventModalOpen && (
          <ModalEvent
            isClose={setIsModalOpen}
            event={InfoEventSelect}
            uuid={infoUser.uuid}
            token={infoUser.token}
          />
        )}
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
        {selectedIndex === 0
          ? AllEvent &&
            AllEvent.map((element, index) => {
              return (
                <CardEvent
                  key={index}
                  props={element}
                  onPress={() => {
                    setInfoEventSelect(element);
                    setIsModalOpen(true);
                  }}
                />
              );
            })
          : MyEvent &&
            MyEvent.map((element, index) => {
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
  },
  textPlaceholder: {
    color: BUTTON_COLOR_ONE
  }
});

export default withNavigation(Home);
