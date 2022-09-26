import axios from "axios";


import { base_url as burl } from "../../helper";
const base_url = burl + "/api";

import { Storage } from "expo-storage";

export const login = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .post(base_url + "/login", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(async (res) => {
        console.log(res);
        alert(JSON.stringify(res));
        await Storage.setItem({
          key: `user`,
          value: JSON.stringify(res.data.data),
        });
        dispatch({ type: "SET_LOGIN", payload: true });
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const register = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .post(base_url + "/users", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        alert(JSON.stringify(res));
        resolve(res);
      })
      .catch((err) => {
        alert(JSON.stringify(err.response));
        reject(err);
      });
  });
};

export const me = () => async (dispatch) => {
  const item = JSON.parse(await Storage.getItem({ key: `user` }));
  if (item) {
    axios
      .get(base_url + "/users/" + item.id)
      .then((res) => {
        dispatch({ type: "SET_PROFILE", payload: res.data });
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
    dispatch({ type: "SET_USER", payload: item });
    dispatch({ type: "SET_LOGIN", payload: true });
  }

  return item ? true : false;
};

export const getBarber = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .get(base_url + "/barber")
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const getBarberId = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .get(base_url + "/barber/" + id)
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getServisId = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .get(base_url + "/service/" + id)
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const tambahServis = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .post(base_url + "/service", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((err) => {
        alert(JSON.stringify(err.response));
        reject(err);
      });
  });
};

export const deleteServis = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .get(base_url + "/service/" + id + "/delete")
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const getMetodePembayaranId = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .get(base_url + "/metode-pembayaran/" + id)
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const tambahMetodePembayaran = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .post(base_url + "/metode-pembayaran", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((err) => {
        alert(JSON.stringify(err.response));
        reject(err);
      });
  });
};

export const deleteMetodePembayaran = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .get(base_url + "/metode-pembayaran/" + id + "/delete")
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

