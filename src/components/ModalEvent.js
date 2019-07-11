import React, { useState } from "react";
import { Overlay } from "react-native-elements";

import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert
} from "react-native";
import Title from "./Title";
import { Button, Card, Text } from "react-native-elements";
import { joinEvent, deleteEvent } from "../../api/event";
import { BUTTON_COLOR_ONE, BACKGROUND_BODY } from "../../utils/colors";
import DatePicker from "react-native-datepicker";
import Container from "./Container";
import { translate } from "../../locale/local";

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

  return (
    <Overlay
      isVisible={true}
      windowBackgroundColor="white"
      overlayBackgroundColor="white"
      onBackdropPress={() => isClose(false)}
      height={height - 50}
      width={width - 50}
      animationType="slide"
    >
      <Container>
        <View>
          <TouchableOpacity
            onPress={() => {
              isClose(false);
            }}
          >
            <Image
              source={require("../../assets/cross.png")}
              style={{ width: 35, height: 35 }}
            />
          </TouchableOpacity>
          <Card title={event.name} titleStyle={styles.title}>
            <View style={{ alignItems: "center" }}>
              <View style={styles.alignElement}>
                <Text style={styles.title}>
                  {translate("EVENT.CATEGORY", LangApp)} :{" "}
                </Text>
                <Text>{event.category}</Text>
              </View>
              <View style={styles.alignElement}>
                <Text style={styles.title}>
                  {translate("FIELDS.EVENT_DESC", LangApp)} :{" "}
                </Text>
                <Text>{event.description}</Text>
              </View>
              <View style={{ alignItems: "center", marginTop: 20 }}>
                <Text style={styles.title}>
                  {translate("EVENT.DATE_EVENT", LangApp)}{" "}
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
                      date={event.startDate}
                      mode="datetime"
                      minDate={new Date()}
                      is24Hour={true}
                      disabled
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
                    />
                  </View>

                  <View>
                    <DatePicker
                      date={event.endDate}
                      mode="datetime"
                      is24Hour={true}
                      disabled
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
                    />
                  </View>
                </View>
              </View>
              <View style={[styles.alignElement]}>
                <Text style={styles.title}>
                  {translate("FIELDS.ADDRESS", LangApp)} :{" "}
                </Text>
                <Text>
                  {event.address} {event.zip_code}
                </Text>
              </View>
            </View>
          </Card>

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
      </Container>
    </Overlay>
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
  alignElement: {
    alignItems: "center",
    marginTop: 20
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  }
});
