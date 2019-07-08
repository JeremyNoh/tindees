import { LOGIN, BASE_URL, REGISTER } from "../endpoint";

// POST REGISTER USER
export const registerUser = user => {
  return new Promise((resolve, reject) => {
    fetch(BASE_URL + REGISTER, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
      .then(response => {
        if (!response.ok) {
          reject("nulll");
        }
        return response.json();
      })
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject("nulll");
      });
  });
};

// POST FOR CONNECT USER
export const connecteUser = user => {
  return new Promise((resolve, reject) => {
    fetch(BASE_URL + LOGIN, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: user.email,
        password: user.password
      })
    })
      .then(response => {
        if (!response.ok) {
          reject("l'email ou le Mot de Passe est Incorrect");
        }
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
