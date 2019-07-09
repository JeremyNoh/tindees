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
  Text,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Alert
} from "react-native";

// Libs Extenal
import { Header, ButtonGroup, Button } from "react-native-elements";
import { withNavigation } from "react-navigation";
import DatePicker from "react-native-datepicker";
import Select from "react-native-select-plus";

// Internal Component
import {
  BUTTON_COLOR_ONE,
  BACKGROUND_BODY,
  COLOR_TEXT,
  PURPLE
} from "../../utils/colors";
import Container from "../components/Container";
import Title from "../components/Title";
import Loading from "../components/Loading";

import CardEvent from "../components/CardEvent";
import { ModalEvent } from "../components/ModalEvent";
import { getAllCategory } from "../../api/categorie";

// Hok
import useInput from "../hooks/useInput";

// for Add Event
import { addEvent, getMyEvents, getEvents } from "../../api/event";
import { dateNow } from "../../utils/functionNative";
import { typeUserLocaux } from "../../utils/const";
const height = Dimensions.get("window").height;

function Home({ navigation }) {
  // for settup ComponentDidMount()
  const [firstInApp, setFirstInApp] = useState(true);

  // SWITCH INTO ALL and MY EVENT
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [isEventModalOpen, setIsModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // infoUser AsyncStorag Store
  const [infoUser, setInfoUser] = useState(null);

  // Category of the Events
  const [category, setCategory] = useState(null);

  // Info when CLick on Event
  const [InfoEventSelect, setInfoEventSelect] = useState(null);

  // for Refresh List
  const [Refreshing, setRefreshing] = useState(false);
  // For ALL EVENT
  const [AllEvent, setAllEvent] = useState(undefined);

  // For My EVENT
  const [MyEvent, setMyEvent] = useState(undefined);

  // form for add Event
  const nameEvent = useInput();
  const descEvent = useInput();

  const address = useInput();
  const zip_code = useInput();
  const [AddInfoEvent, setAddInfoEvent] = useState({
    startDate: dateNow(),
    endDate: dateNow()
  });

  useEffect(() => {
    //   ComponentDidMount
    if (firstInApp) {
      getInfo();
      getInfoEvents();
      setFirstInApp(false);
    }
  });

  // FUNC for load UserData and Category
  const getInfo = async () => {
    const infoUserJson = await AsyncStorage.getItem("infoUser");
    let infoUser = JSON.parse(infoUserJson);
    console.log(infoUser);
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

  // CALL API FOR ALL EVENTS + MY EVENT
  const getInfoEvents = async () => {
    const infoUserJson = await AsyncStorage.getItem("infoUser");
    let infoUser = JSON.parse(infoUserJson);

    getMyEvents(infoUser.token, infoUser.uuid)
      .then(res => {
        res.data.length === 0 ? setMyEvent(null) : setMyEvent(res.data);
      })
      .catch(err => {
        setMyEvent(null);
        console.log(err);
      });

    getEvents(infoUser.token, infoUser.uuid)
      .then(res => {
        res.data.length === 0 ? setAllEvent(null) : setAllEvent(res.data);
        setRefreshing(false);
      })
      .catch(err => {
        setAllEvent(null);
        setRefreshing(false);
      });
  };

  // CALL API FOR ADD EVENT
  const addEventFunc = infoEvent => {
    if (
      !infoEvent.id_category ||
      infoEvent.name.length < 1 ||
      infoEvent.address.length < 1 ||
      infoEvent.zip_code.length !== 5
    ) {
      Alert.alert(
        "Champs Incomplet",
        "veuillez remplir tout les champs ",
        [
          {
            text: "OK",
            onPress: () => {}
          }
        ],
        { cancelable: false }
      );
      return false;
    }
    addEvent(infoEvent)
      .then(res => {
        Alert.alert(
          "Event Ajouté",
          "des participants s'inscriront très bientôt",
          [
            {
              text: "OK",
              onPress: () => {
                getInfoEvents();
                setModalVisible(false);
              }
            }
          ],
          { cancelable: false }
        );
      })
      .catch(err => {
        setModalVisible(false);
        console.log(err);
      });
  };

  // SWITCH INTO FUTURE EVENT | MY EVENT
  _updateIndex = selectedIndex => {
    setSelectedIndex(selectedIndex);
  };

  // RELOAD THE LIST
  _onRefresh = () => {
    setRefreshing(true);
    getInfoEvents();
  };

  // VIEW -  FOR ADD EVENT
  const modalAddEvent = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {}}
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
                <TextInput
                  style={styles.TextInput}
                  placeholderTextColor={BUTTON_COLOR_ONE}
                  placeholder="Adresse"
                  dataDetectorTypes="address"
                  {...address}
                />
                <TextInput
                  style={styles.TextInput}
                  placeholderTextColor={BUTTON_COLOR_ONE}
                  placeholder="Code Postal"
                  keyboardType="numeric"
                  autoCorrect={false}
                  maxLength={5}
                  {...zip_code}
                />
                <Button
                  onPress={() => {
                    addEventFunc({
                      ...AddInfoEvent,
                      description: descEvent.value,
                      name: nameEvent.value,
                      uuid: infoUser.uuid,
                      token: infoUser.token,
                      address: address.value,
                      zip_code: zip_code.value
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

  const noDataView = () => {
    return (
      <View style={styles.alignElement}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          refreshControl={
            <RefreshControl refreshing={Refreshing} onRefresh={_onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View>
            <Text>Pas d'event Refresh ou reviens plus tard</Text>
          </View>
        </ScrollView>
      </View>
    );
  };

  const loadingView = () => {
    return (
      <View style={styles.alignElement}>
        <ActivityIndicator size="large" color={PURPLE} />
      </View>
    );
  };

  // IMPORTANT !!!!  its the rules for the system of the Home
  const rulesForShowContent = () => {
    if (selectedIndex === 0) {
      if (AllEvent === undefined) {
        return loadingView();
      } else if (AllEvent === null) {
        return noDataView();
      } else {
        return (
          <ScrollView
            style={{ height: "100%" }}
            refreshControl={
              <RefreshControl refreshing={Refreshing} onRefresh={_onRefresh} />
            }
          >
            {AllEvent.map((element, index) => {
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
            })}
          </ScrollView>
        );
      }
    } else {
      if (MyEvent === undefined) {
        return loadingView();
      } else if (MyEvent === null) {
        return noDataView();
      } else {
        return (
          <ScrollView
            style={{ height: "100%" }}
            refreshControl={
              <RefreshControl refreshing={Refreshing} onRefresh={_onRefresh} />
            }
          >
            {MyEvent.map((element, index) => {
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
            })}
          </ScrollView>
        );
      }
    }
  };

  if (infoUser === null) {
    return loadingView();
  }
  return (
    <>
      <Header
        backgroundColor={BUTTON_COLOR_ONE}
        centerComponent={{
          text: `Home`,
          style: { color: "#fff", fontWeight: "bold", fontSize: 20 }
        }}
        leftComponent={
          infoUser.type === typeUserLocaux ? (
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
          ) : null
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
            isRegistered={selectedIndex === 0 ? false : true}
            refreshing={_onRefresh}
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
            Alert.alert(
              "Filtre non Disponible 😞",
              "Cette Fonctionnalité n'est pas encore développer,  Stay Tuned pour la nouvelle mise à jour",
              [
                {
                  text: "OK",
                  onPress: () => {
                    getInfoEvents();
                    setModalVisible(false);
                  }
                }
              ],
              { cancelable: false }
            );
          }}
        >
          <Image
            source={require("../../assets/menu.png")}
            style={{ width: 35, height: 35 }}
          />
        </TouchableOpacity>
      </View>

      {rulesForShowContent()}
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
  },
  alignElement: {
    alignItems: "center",
    alignContent: "center",
    flex: 1,
    justifyContent: "center"
  }
});

export default withNavigation(Home);
