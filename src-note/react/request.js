import axios from "axios";
import { getAccessToken, getRefreshToken, logout, setAccessToken, setRefreshToken } from "./service";
import { message } from "antd";

const base_url = "http://localhost:8085/api/";
export const request = (url = "", method = "get", data = {}, new_access_token = null) => {
  var queryParam = "";
  if (method === "get" && Object.keys(data).length > 0) {
    Object.keys(data).map((key, index) => {
      queryParam += (index === 0 ? "?" : "&") + key + "=" + data[key];
    });
  }
  var access_token = getAccessToken();
  if (new_access_token) {
    access_token = new_access_token;
  }
  var headers = { "Content-Type": "application/json" };
  if (data instanceof FormData) {
    // check if param data is FormData
    headers = { "Content-Type": "multipart/form-data" };
  }

  return axios({
    url: base_url + url + queryParam,
    method: method,
    data: data,
    headers: {
      ...headers,
      Authorization: "Bearer " + access_token,
    },
  })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      var response = error.response;
      if (error.code === "ERR_NETWORK") {
        message.error("App under maintenance.");
      } else if (response?.status === 401) {
        // "Unauthorized"
        // access_token == null || access_token == "expired"  access_token == "incorrect"
        if (response?.data?.error?.name === "TokenExpiredError") {
          // logout(); // case we want logout when access_token expired
          // refrehs token
          console.log("Has call refresh token");
          const refesh_token = getRefreshToken();
          return axios({
            url: base_url + "users/refresh_token",
            method: "post",
            data: {
              refres_token: refesh_token,
            },
          })
            .then((res) => {
              setAccessToken(res?.data?.access_token);
              setRefreshToken(res?.data?.refresh_token);
              var new_access_token_ofter_resfresh = res?.data?.access_token;
              return request(url, method, data, new_access_token_ofter_resfresh);
            })
            .catch((error1) => {
              logout(); //when try refresh not success then logout
            });
        } else if (response?.data?.error) {
          logout();
        }
      } else if (response?.status === 404) {
        message.error("Error 404. Rout not found!");
      } else if (response?.status === 500) {
        message.error("Error 500. Internal error server!");
      }
      return false;
    });
};
