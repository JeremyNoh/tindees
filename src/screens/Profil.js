import React, { useState, useEffect } from "react";

import {
  View,
  StyleSheet,
  AsyncStorage,
  TextInput,
  ScrollView,
  Alert
} from "react-native";

// Libs Extenal
import { Button, Header, Avatar } from "react-native-elements";
import { withNavigation } from "react-navigation";
import Select from "react-native-select-plus";

// Internal Component
import { BUTTON_COLOR_ONE, COLOR_TEXT } from "../../utils/colors";
import Container from "../components/Container";
import Title from "../components/Title";

import { Loading } from "../components/Loading";
import useInput from "../hooks/useInput";
import { PutInfoUser } from "../../api/user";
import { ImagePicker, Permissions, Constants } from "expo";
import { API_KEY_IMG_BB } from "../../api/const";
import { API_IMG_BB } from "../../endpoint";
import { country } from "../../assets/country/country";

_noData = () => {
  return <Title title="No data sorry " />;
};

function Profil({ navigation }) {
  const [infoUser, setInfoUser] = useState(undefined);
  const [firstInApp, setFirstInApp] = useState(true);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [Country, setCountry] = useState();
  const [InitCountry, setInitCountry] = useState(null);

  // input Value

  const address = useInput();
  const zip_code = useInput();
  const email = useInput();
  const firstname = useInput();
  const lastname = useInput();
  // const birthday = useInput();

  useEffect(() => {
    //   ComponentDidMount
    if (firstInApp) {
      getInfo();
      getPermissionAsync();
      setFirstInApp(false);
    }
  });

  const getInfo = async () => {
    const infoUserJson = await AsyncStorage.getItem("infoUser");
    let infoUser = JSON.parse(infoUserJson);

    setImage(infoUser.photo_url);
    if (infoUser.country) {
      setInitCountry(country.find(x => x.label === infoUser.country).key);
    }
    setInfoUser(infoUser);
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true
    });

    if (!result.cancelled) {
      _handleImagePicked(result);
      // setImage(result.uri);
    }
  };

  _handleImagePicked = async pickerResult => {
    let uploadResponse, uploadResult;

    try {
      setUploading(true);

      if (!pickerResult.cancelled) {
        uploadResponse = await uploadImageAsync(
          pickerResult.uri,
          pickerResult.base64
        );
        uploadResult = await uploadResponse.json();
        setImage(uploadResult.data.medium.url);
      }
    } catch (e) {
      console.log({ uploadResponse });
      console.log({ uploadResult });
      console.log({ e });
      alert("Upload failed, sorry :(");
    } finally {
      setUploading(false);
    }
  };

  const _update = () => {
    let data = {
      ...infoUser,
      address: address.value || infoUser.address,
      zip_code: zip_code.value || infoUser.zip_code,
      email: email.value || infoUser.email,
      firstname: firstname.value || infoUser.firstname,
      lastname: lastname.value || infoUser.lastname,
      photo_url: image,
      country: Country || infoUser.country
    };
    PutInfoUser(infoUser.token, infoUser.uuid, data)
      .then(res => {
        Alert.alert(
          "Success 🤗",
          "Tes infos ont été mis à jour ",
          [
            {
              text: "OK",
              onPress: () => {}
            }
          ],
          { cancelable: false }
        );
        alert("les données sont mis à jour");
        _updateStorage(data);
      })
      .catch(() => {
        console.log("erro");
      });
  };

  _updateStorage = async data => {
    await AsyncStorage.setItem("infoUser", JSON.stringify(data));
  };

  if (infoUser === undefined) {
    return <Loading />;
  } else if (infoUser === null) {
    return (
      <View style={[styles.container, styles.containerView]}>
        {this._noData()}
      </View>
    );
  }

  return (
    <>
      <Header
        backgroundColor={BUTTON_COLOR_ONE}
        centerComponent={{
          text: `Profil`,
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
      <Container>
        <View style={{ paddingTop: 20 }}>
          <ScrollView>
            <View style={{ alignItems: "center" }}>
              <Avatar
                size="xlarge"
                source={
                  image === undefined || image === null
                    ? require("../../assets/user.png")
                    : { uri: image }
                }
                showEditButton
                rounded
                onEditPress={_pickImage}
              />
            </View>
            <TextInput
              style={styles.TextInput}
              placeholderTextColor={BUTTON_COLOR_ONE}
              placeholder={infoUser.email || "Email"}
              editable={false}
              autoCapitalize="none"
              textContentType="emailAddress"
              {...email}
            />
            <TextInput
              style={styles.TextInput}
              placeholderTextColor={BUTTON_COLOR_ONE}
              placeholder={infoUser.lastname || "Nom"}
              autoCapitalize="none"
              autoCorrect={false}
              {...lastname}
            />
            <TextInput
              style={styles.TextInput}
              placeholderTextColor={BUTTON_COLOR_ONE}
              placeholder={infoUser.firstname || "Prenom"}
              autoCapitalize="none"
              autoCorrect={false}
              {...firstname}
            />
            <TextInput
              style={styles.TextInput}
              placeholderTextColor={BUTTON_COLOR_ONE}
              placeholder={infoUser.address || "Adresse"}
              dataDetectorTypes="address"
              {...address}
            />
            <TextInput
              style={styles.TextInput}
              placeholderTextColor={BUTTON_COLOR_ONE}
              placeholder={infoUser.zip_code || "Code Postal"}
              keyboardType="numeric"
              autoCorrect={false}
              maxLength={5}
              {...zip_code}
            />
            <Select
              data={country}
              width={300}
              placeholder="Pays d'Origine"
              onSelect={(key, value) => {
                setCountry(value);
              }}
              initKey={InitCountry}
              search={true}
              style={[styles.TextInput, {}]}
            />
            <Button
              onPress={_update}
              buttonStyle={styles.Button}
              disabledStyle={styles.desabled}
              disabledTitleStyle={{ color: BUTTON_COLOR_ONE }}
              title="Mettre à Jour"
            />
          </ScrollView>
        </View>
      </Container>
    </>
  );
}

export async function uploadImageAsync(uri, base) {
  let uploadUrl = `${API_IMG_BB}upload?key=${API_KEY_IMG_BB}`;
  let data = new FormData();
  data.append("image", base);
  let options = {
    method: "POST",
    body: data
  };
  return fetch(uploadUrl, options);
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
  }
});
export default withNavigation(Profil);
