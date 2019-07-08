import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Button
} from "react-native";
import { GoogleAutoComplete } from "react-native-google-autocomplete";
import { API_KEY_GOOGLE_PLACE } from "../../api/const";
import LocationItem from "./LocationItem";

export const AdressInput = () => {
  return (
    <View>
      <GoogleAutoComplete
        apiKey={API_KEY_GOOGLE_PLACE}
        debounce={1500}
        minLength={3}
      >
        {({
          handleTextChange,
          locationResults,
          fetchDetails,
          isSearching,
          inputValue,
          clearSearchs
        }) => (
          <React.Fragment>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Search a places"
                onChangeText={handleTextChange}
                value={inputValue}
              />
              {/* <Button title="Clear" onPress={clearSearchs} /> */}
            </View>
            {isSearching && <ActivityIndicator size="large" color="red" />}
            <ScrollView>
              {locationResults.map(el => (
                <LocationItem {...el} key={el.id} fetchDetails={fetchDetails} />
              ))}
            </ScrollView>
          </React.Fragment>
        )}
      </GoogleAutoComplete>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    width: 300,
    borderWidth: 1,
    paddingHorizontal: 16
  },
  inputWrapper: {
    marginTop: 80,
    flexDirection: "row"
  }
});
