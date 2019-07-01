import { BASE_URL, CATEGORY } from "../endpoint";

export const getAllCategory = userToken => {
  return new Promise((resolve, reject) => {
    fetch(BASE_URL + CATEGORY, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`
      }
    })
      .then(response => {
        console.log(userToken);
        console.log(response);

        return response.json();
      })
      .then(data => {
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};
