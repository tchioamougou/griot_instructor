/**
 *  @author Styves daudet(Styves@griot.cm)
 *  @description: this javascript file is used to manage checkout.
 *  @Init_date:  03/02/2023
 *  @last_modify_date: 03/02/03
 *  @last_Modify_By:  styves daudet
 */

import axios from "axios";
import { getToken } from "./authentication";
import store from "../store";

/**
 *  @param  params  information about the case to create
 *  @param  options is the options of creation for the products: for the nature of data, go to stripe site.
 *  @returns return the promise with the details about the response of stripe. this function will return the error or the success data return by stripe.
 *  @description  https://stripe.com/docs/api/products/object
 * */
const create = async (params, options = {}) => {
  console.log("parameter==>", params);
  const url =
    import.meta.env.VITE_APP_DOMAIN + "/checkout/create-checkout-session";
  await getToken();
  const config = {
    headers: {
      "content-type": "application/json",
      gr_source: "GRIOT",
      gr_application: "WEB",
      authorization: "Bearer " + store.state.token,
    },
  };
  //await checkToken();
  return await axios.post(url, params, config);
};
/**
 *  @param  line_items  List of products (line, price and quantity).
 *  @param  mode session mode : payment, subscription
 *  @param  success_url: the url where the customer will be redirected when the payment is closed successfully.
 *  @param  cancel_url: the url where the customer will be redirected to when the payment is canceled.
 *  @returns JSON object that contains the details about the checkout session that will be created.
 *  @description  https://stripe.com/docs/api/products/object
 * */
const createParam = (line_items, mode, success_url, cancel_url) => {
  return {
    line_items: line_items,
    mode: mode,
    success_url: success_url,
    cancel_url: cancel_url,
  };
};


export default { create, createParam };
