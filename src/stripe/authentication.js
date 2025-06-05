/**
 *  @author Styves daudet(Styves@griot.cm)
 *  @description: this javascript file is used to manage authentication get token.
 *  @Init_date:  03/02/2023
 *  @last_modify_date: 03/02/03
 *  @last_Modify_By:  styves daudet
 */
import axios from "axios";
//import { useStore } from "vuex";
//import *as jwt from "jsonwebtoken";
import store from "../store";
const getTokenUrl = import.meta.env.VITE_APP_DOMAIN + "/oauth/v2/token";
/**
 *  @description  call the middleware to get token that will be used to make a callout in the future.
 * */
export const getToken = async () => {
  await axios
    .post(getTokenUrl)
    .then((result) => {
      console.log("data=>", result.data);
      store.dispatch("setToken", result.data.token);
    })
    .catch((error) => {
      console.log("error=>" + error);
    });
};

/**
 *
 */
export const checkToken = () => {
  ///const decode = jwt.decode(store.state.token);
  //console.log("decode=>", decode);
};
