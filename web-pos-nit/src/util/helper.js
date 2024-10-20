import axios from "axios";
import { Config } from "./config";
import { setServerSatus } from "../store/server.store";
import { getAcccessToken } from "../store/profile.store";

export const request = (url = "", method = "get", data = {}) => {
  var access_token = getAcccessToken();
  // in react
  var headers = { "Content-Type": "application/json" };
  if (data instanceof FormData) {
    // check if param data is FormData
    headers = { "Content-Type": "multipart/form-data" };
  }
  return axios({
    url: Config.base_url + url,
    method: method,
    data: data,
    headers: {
      ...headers,
      Authorization: "Bearer " + access_token,
    },
  })
    .then((res) => {
      setServerSatus(200);
      return res.data;
    })
    .catch((err) => {
      var response = err.response;
      if (response) {
        var status = response.status;
        if (status == "401") {
          status = 403;
        }
        setServerSatus(status);
      } else if (err.code == "ERR_NETWORK") {
        setServerSatus("error");
      }
      console.log(">>>", err);
      return false;
    });
};
