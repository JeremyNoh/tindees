import fr from "./fr.json";
import en from "./en.json";

import { Localization } from "expo";
import { AsyncStorage } from "react-native";

const data = {
  fr,
  en
};

const langByDefault = "fr";

export const setAutoAppLang = () => {
  let trad = Localization.locale.split("-")[0];

  // Set par défaut une Langue si la langue du téléphone n'est pas traduite dans un JSON
  if (!data.hasOwnProperty(trad)) {
    trad = langByDefault;
  }
  return trad;
};

export const setAppLang = async lang => {
  if (data.hasOwnProperty(lang)) {
    await AsyncStorage.setItem("langApp", JSON.stringify(lang));
    return true;
  }
  return false;
};

export const getAppLang = async () => {
  const langJson = await AsyncStorage.getItem("langApp");
  let lang = JSON.parse(langJson) || langByDefault;
  return lang;
};

export const translate = (keyWord = "NOT_DEFINE", lang) => {
  let result = keyWord.split(".").reduce((acc, v) => acc[v], data[lang]);
  return result === undefined ? data[lang]["NOT_DEFINE"] : result;
};
