import axios from "axios";
import { Config } from "./config";
import { setServerSatus } from "../store/server.store";

export const request = (url = "", method = "get", data = {}) => {
  return axios({
    url: Config.base_url + url,
    method: method,
    data: data,
    headers: {},
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
