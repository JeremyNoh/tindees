import { AsyncStorage } from "react-native";

export const saveInfo = async infoUser => {
  try {
    const value = await AsyncStorage.setItem(
      "infoUser",
      JSON.stringify(infoUser)
    );
    let data = {
      success: true
    };
    return { data };
  } catch (error) {
    let data = {
      errorMessage: error,
      success: false
    };
    return { data };
  }
};

export const shuffleArray = ([...arr]) => {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
};

export const dateNow = () => {
  var d = new Date();

  let date =
    d.getFullYear() +
    "-" +
    ("00" + (d.getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + d.getDate()).slice(-2) +
    " " +
    ("00" + d.getHours()).slice(-2) +
    ":" +
    ("00" + d.getMinutes()).slice(-2);

  return date;
};
