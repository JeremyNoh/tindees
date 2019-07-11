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
import { getAppLang, translate } from "../../locale/local";

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

  // Langue Of the App
  const [LangApp, setLangApp] = useState(undefined);

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
      setLang();
      getInfo();
      getInfoEvents();
      setFirstInApp(false);
    }
  });

  setLang = async () => {
    let getApLang = await getAppLang();
    setLangApp(getApLang);
  };

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
      .catch(err => {});
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
        translate("ERROR.INCOMPLETE_FIELDS_TITLE", LangApp),
        translate("ERROR.INCOMPLETE_FIELDS_DESC", LangApp),
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
          translate("EVENT.EVENT_ADDED_TITLE", LangApp),
          translate("EVENT.EVENT_ADDED_DESC", LangApp),
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
        <View style={{ paddingLeft: 50 }}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}
          >
            <Image
              source={require("../../assets/cross.png")}
              style={[
                { marginBottom: 10, marginTop: 90 },
                { width: 35, height: 35 }
              ]}
            />
          </TouchableOpacity>
        </View>

        <Container>
          <ScrollView>
            <View>
              <Title title={translate("EVENT.CREATE", LangApp)} />
              <Select
                data={category}
                width={300}
                placeholder={translate("FIELDS.CATEGORY", LangApp)}
                onSelect={(key, value) =>
                  setAddInfoEvent({ ...AddInfoEvent, id_category: key })
                }
                search={true}
                style={[styles.TextInput, { marginTop: 50 }]}
              />
              <TextInput
                style={styles.TextInput}
                placeholderTextColor={BUTTON_COLOR_ONE}
                placeholder={translate("FIELDS.EVENT_NAME", LangApp)}
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
                placeholder={translate("FIELDS.EVENT_DESC", LangApp)}
                autoCapitalize="none"
                multiline={true}
                numberOfLines={4}
                {...descEvent}
              />
              <View style={{ marginTop: 10 }}>
                <Text style={styles.textPlaceholder}>
                  {translate("EVENT.CHOICE_DATE", LangApp)}
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
                      placeholder={translate(
                        "FIELDS.EVENT_DATE_START",
                        LangApp
                      )}
                      minDate={new Date()}
                      confirmBtnText={translate("ALERT.CONFIRM", LangApp)}
                      cancelBtnText={translate("ALERT.CANCEL", LangApp)}
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
                      placeholder={translate("FIELDS.EVENT_DATE_END", LangApp)}
                      minDate={AddInfoEvent.startDate}
                      confirmBtnText={translate("ALERT.CONFIRM", LangApp)}
                      cancelBtnText={translate("ALERT.CANCEL", LangApp)}
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
                placeholder={translate("FIELDS.ADDRESS", LangApp)}
                dataDetectorTypes="address"
                {...address}
              />
              <TextInput
                style={styles.TextInput}
                placeholderTextColor={BUTTON_COLOR_ONE}
                placeholder={translate("FIELDS.ZIP_CODE", LangApp)}
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
                title={translate("ALERT.ADD", LangApp)}
              />
            </View>
          </ScrollView>
        </Container>
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
            <Text>{translate("EVENT.NO_EVENT", LangApp)}</Text>
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

  if (infoUser === null || !LangApp) {
    return loadingView();
  }
  return (
    <>
      <Header
        backgroundColor={BUTTON_COLOR_ONE}
        centerComponent={{
          text: `${translate("HOME.TITLE", LangApp)}`,
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
            LangApp={LangApp}
          />
        )}
        <ButtonGroup
          onPress={_updateIndex}
          selectedIndex={selectedIndex}
          buttons={[
            translate("HOME.ALL_EVENT", LangApp),
            translate("HOME.MY_EVENT", LangApp)
          ]}
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
              translate("HOME.NO_FILTER_TITLE", LangApp),
              translate("HOME.NO_FILTER_DESC", LangApp),
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
