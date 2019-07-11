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

import { Loading } from "../components/Loading";
import useInput from "../hooks/useInput";
import { PutInfoUser } from "../../api/user";
import { ImagePicker, Permissions, Constants } from "expo";
import { API_KEY_IMG_BB } from "../../api/const";
import { API_IMG_BB } from "../../endpoint";
import { country } from "../../assets/country/country";
import { getAppLang, translate } from "../../locale/local";

function Profil({ navigation }) {
  const [infoUser, setInfoUser] = useState(undefined);
  const [firstInApp, setFirstInApp] = useState(true);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [Country, setCountry] = useState();
  const [InitCountry, setInitCountry] = useState(null);
  const [LangApp, setLangApp] = useState(undefined);

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
      setLang();
      getPermissionAsync();
      setFirstInApp(false);
    }
  });

  setLang = async () => {
    let getApLang = await getAppLang();
    setLangApp(getApLang);
  };

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
        Alert.alert(
          translate("ERROR.RETRY", LangApp),
          translate("PROFIL.ACCEPT_PERMISSION", LangApp),
          [
            {
              text: "OK",
              onPress: () => {}
            }
          ],
          { cancelable: false }
        );
      }
    }
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      base64: true
    });

    if (!result.cancelled) {
      _handleImagePicked(result);
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
          translate("ALERT.SUCCESS", LangApp),
          translate("PROFIL.MAJ_INFO", LangApp),
          [
            {
              text: "OK",
              onPress: () => {}
            }
          ],
          { cancelable: false }
        );
        _updateStorage(data);
      })
      .catch(() => {});
  };

  _updateStorage = async data => {
    await AsyncStorage.setItem("infoUser", JSON.stringify(data));
  };

  if (infoUser === undefined || !LangApp) {
    return <Loading />;
  }

  return (
    <>
      <Header
        backgroundColor={BUTTON_COLOR_ONE}
        centerComponent={{
          text: `${translate("PROFIL.NAME", LangApp)}`,
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
              placeholder={infoUser.email || translate("FIELDS.EMAIL", LangApp)}
              editable={false}
              autoCapitalize="none"
              textContentType="emailAddress"
              {...email}
            />
            <TextInput
              style={styles.TextInput}
              placeholderTextColor={BUTTON_COLOR_ONE}
              placeholder={
                infoUser.lastname || translate("FIELDS.LASTNAME", LangApp)
              }
              autoCapitalize="none"
              autoCorrect={false}
              {...lastname}
            />
            <TextInput
              style={styles.TextInput}
              placeholderTextColor={BUTTON_COLOR_ONE}
              placeholder={
                infoUser.firstname || translate("FIELDS.FIRSTNAME", LangApp)
              }
              autoCapitalize="none"
              autoCorrect={false}
              {...firstname}
            />
            <TextInput
              style={styles.TextInput}
              placeholderTextColor={BUTTON_COLOR_ONE}
              placeholder={
                infoUser.address || translate("FIELDS.ADDRESS", LangApp)
              }
              dataDetectorTypes="address"
              {...address}
            />
            <TextInput
              style={styles.TextInput}
              placeholderTextColor={BUTTON_COLOR_ONE}
              placeholder={
                infoUser.zip_code || translate("FIELDS.ZIP_CODE", LangApp)
              }
              keyboardType="numeric"
              autoCorrect={false}
              maxLength={5}
              {...zip_code}
            />
            <Select
              data={country}
              width={300}
              placeholder={translate("FIELDS.ORIGIN", LangApp)}
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
              title={translate("MAJ", LangApp)}
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
