import React, { useState } from "react";
import { Overlay } from "react-native-elements";

import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  ImageBackground
} from "react-native";
import Title from "./Title";
import { Button, Card, Text } from "react-native-elements";
import { joinEvent, deleteEvent } from "../../api/event";
import {
  BUTTON_COLOR_ONE,
  BACKGROUND_BODY,
  COLOR_TEXT,
  PURPLE
} from "../../utils/colors";

import Container from "./Container";
import { translate } from "../../locale/local";
import { Loading } from "../components/Loading";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export const ModalEvent = ({
  event,
  isClose,
  token,
  uuid,
  isRegistered,
  refreshing,
  LangApp
}) => {
  const [ImgLoading, setImgLoading] = useState(false);
  const _joinEvent = () => {
    joinEvent({
      event_id: event.id,
      uuid,
      token
    })
      .then(res => {
        isClose(false);
        refreshing();
      })
      .catch(err => {
        Alert.alert(
          translate("ERROR.RETRY", LangApp),
          translate("ERROR.FAIL", LangApp),
          [
            {
              text: "OK",
              onPress: () => {}
            }
          ],
          { cancelable: false }
        );
      });
  };

  const _deleteEvent = () => {
    deleteEvent({
      event_id: event.id,
      uuid,
      token
    })
      .then(res => {
        isClose(false);
        refreshing();
      })
      .catch(err => {
        Alert.alert(
          translate("ERROR.RETRY", LangApp),
          translate("ERROR.FAIL", LangApp),
          [
            {
              text: "OK",
              onPress: () => {}
            }
          ],
          { cancelable: false }
        );
        isClose(false);
      });
  };

  const content = () => {
    return (
      <>
        <View style={{ paddingLeft: 50 }}>
          <TouchableOpacity
            onPress={() => {
              isClose(false);
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

        <Container style={{ backgroundColor: "none", marginTop: 80 }}>
          <ScrollView>
            <View style={{ alignItems: "center" }}>
              <View style={{ alignItems: "center" }}>
                <Title title={event.name} style={{ color: "white" }} />
                <Text style={[styles.fontSize, {}]}>{event.category}</Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                  height: 3,
                  borderRadius: 20,
                  width: "100%",
                  marginVertical: 10,
                  backgroundColor: "black"
                }}
              />

              <View style={{ marginTop: 15 }}>
                <Text style={[styles.fontSize, { fontWeight: "bold" }]}>
                  Du {event.startDate} au {event.endDate}
                </Text>
              </View>

              <Text
                style={[
                  styles.fontSize,
                  { marginTop: 10, fontStyle: "italic" }
                ]}
              >
                {event.description}
              </Text>

              <Text
                style={[
                  styles.fontSize,
                  {
                    marginTop: 10,
                    borderWidth: 1,
                    borderColor: BUTTON_COLOR_ONE,
                    borderRadius: 5
                  }
                ]}
              >
                {event.address} {event.zip_code}
              </Text>

              {/* <TouchableOpacity
              style={{
                marginTop: 30
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("../../assets/user.png")}
                  style={{ width: 25, height: 25 }}
                />
              </View>
              <Text style={{}}>Liste des Participants</Text>
            </TouchableOpacity> */}

              {isRegistered ? (
                <Button
                  onPress={() => {
                    _deleteEvent();
                  }}
                  buttonStyle={[
                    styles.Button,
                    {
                      height: 50,
                      backgroundColor: BACKGROUND_BODY,
                      borderWidth: 1,
                      borderColor: BUTTON_COLOR_ONE,
                      borderRadius: 5
                    }
                  ]}
                  title={translate("EVENT.UNSUBSCRIBE_EVENT", LangApp)}
                  titleStyle={{ color: "black" }}
                />
              ) : (
                <Button
                  onPress={() => {
                    _joinEvent();
                  }}
                  buttonStyle={[
                    styles.Button,
                    {
                      height: 50,
                      backgroundColor: BACKGROUND_BODY,
                      borderWidth: 1,
                      borderColor: BUTTON_COLOR_ONE,
                      borderRadius: 5
                    }
                  ]}
                  title={translate("EVENT.SUBSCRIBE_EVENT", LangApp)}
                  titleStyle={{ color: "black" }}
                />
              )}
            </View>
          </ScrollView>
        </Container>
      </>
    );
  };
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={true}
      onRequestClose={() => {}}
    >
      <ImageBackground
        source={require("../../assets/wallpa.png")}
        style={{ width: "100%", height: "100%" }}
        onLoad={() => {
          setImgLoading(true);
        }}
      >
        {ImgLoading ? content() : <Loading />}
      </ImageBackground>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  },
  fontSize: {
    fontSize: 17,
    color: "white"
  }
});
