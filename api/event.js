import { BASE_URL, EVENT } from "../endpoint";

// For Add Event
export const addEvent = ({ infoEvent }) => {
  return new Promise((resolve, reject) => {
    fetch(BASE_URL + EVENT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify({
        name: name,
        description: description,
        uuid: uuid
      })
    })
      .then(response => {
        // if (!response.ok) {
        //   reject("erreur");
        // }
        return response.json();
      })
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};
