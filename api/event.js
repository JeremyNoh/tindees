import { BASE_URL, EVENT, MY_EVENT } from "../endpoint";

// For Add Event
export const addEvent = ({
  name,
  description,
  startDate,
  endDate,
  id_category,
  zipCode,
  city,
  adress,
  uuid,
  token
}) => {
  return new Promise((resolve, reject) => {
    fetch(BASE_URL + EVENT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        description,
        startDate,
        endDate,
        id_category,
        zipCode: 77090,
        city: "CITY",
        adress: "rue",
        uuid
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
        console.log(err);
        reject(err);
      });
  });
};

export const deleteEvent = ({ event_id, uuid, token }) => {
  return new Promise((resolve, reject) => {
    fetch(BASE_URL + EVENT + MY_EVENT, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        event_id,
        uuid
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
        console.log(err);
        reject(err);
      });
  });
};

export const joinEvent = ({ event_id, uuid, token }) => {
  return new Promise((resolve, reject) => {
    fetch(BASE_URL + EVENT + MY_EVENT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        event_id,
        uuid
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
        console.log(err);
        reject(err);
      });
  });
};
export const getEvents = (userToken, idUser) => {
  return new Promise((resolve, reject) => {
    fetch(BASE_URL + EVENT + idUser, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`
      }
    })
      .then(response => {
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

export const getMyEvents = (userToken, idUser) => {
  return new Promise((resolve, reject) => {
    fetch(BASE_URL + EVENT + MY_EVENT + idUser, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`
      }
    })
      .then(response => {
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
