/**  @description: this javascript file contain generic functions.
 *  @Init_date:  01/03/2023
 *  @last_modify_date: 26/10/2023
 *  @last_Modify_By:  styves daudet
 */

import { useAuthStore } from '@/composables/user'
import { CURRENCY_CODE } from './commonCurrency';
import axios from 'axios';

const authStore = useAuthStore();
const storeUser = authStore.getUser;
/*
import axios from "axios";

export function convertSecondsToTime(seconds) {

  // Calculate minutes
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Check if conversion to hours is necessary
  if (minutes < 60) {
    return `${minutes} min`;
  }

  // Calculate hours and remaining minutes
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes} min`;
}
*/
export const getCurrencyDefault = () => {
  return (storeUser.user && storeUser.user.currencyCode) ? storeUser.user.currencyCode : 'eur';
}
export const getCurrencySymbolDefault = () => {
  return CURRENCY_CODE["eur".toUpperCase() as keyof typeof CURRENCY_CODE].symbol;
}
export async function handleResponse(response:any) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = err;
    throw new Error(errorMessage as string);
  }
}

export function isTemporaryEmail(email:string) {
  const temporaryDomains = [
    "mailinator.com",
    "tempmail.com",
    "10minutemail.com",
    "guerrillamail.com",
    "yopmail.com",
    "discard.email",
    "trashmail.com",
    "fakeinbox.com",
    "emailondeck.com",
    "getnada.com"
  ];

  const domain = email.split('@')[1]?.toLowerCase();

  return temporaryDomains.some(tempDomain => domain.endsWith(tempDomain));
}
/** this is function that generated the ReferralCode*/
export function generateReferralCode() {
  const length = 20;
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let coupon = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    coupon += charset.charAt(Math.floor(Math.random() * n));
  }
  return coupon;
}

/** this function is used to send Email , param are sender, receiver, subject, message */
export function sendGriotEmail(receiverEmail:string, subject:string, message:string) {
  const emailData = {
    to: receiverEmail,
    subject: subject,
    text: message,
  };
  const url = import.meta.env.VITE_APP_MESSAGE_DOMAIN + "/send-email";

  axios
    .post(url, emailData)
    .then((response) => {
      console.log("Email sent successfully:", response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}

/** this function is used to send Email async , param are sender, receiver, subject, message */
export async function asyncSendGriotEmail(receiverEmail:string, subject:string, message:string) {
  const emailData = {
    to: receiverEmail,
    subject: subject,
    text: message,
  };
  const url = import.meta.env.VITE_APP_MESSAGE_DOMAIN + "/send-email";

  axios
    .post(url, emailData)
    .then((response) => {
      console.log("Email sent successfully:", response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}