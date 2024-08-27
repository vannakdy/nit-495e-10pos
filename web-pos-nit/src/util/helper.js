import axios from "axios";
import { Config } from "./config";

export const request = (url = "", method = "get", data = {}) => {
  return axios({
    url: Config.base_url + url,
    method: method,
    data: data,
    headers: {},
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};
