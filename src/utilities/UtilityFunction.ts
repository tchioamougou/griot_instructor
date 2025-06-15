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

/** 
 * This function extracts plain text from an HTML string.
 * Optionally adds spaces between elements to preserve word boundaries.
 */
export function extractContent(s: string, space: boolean): string {
  const span = document.createElement('span');
  span.innerHTML = s;

  if (space) {
    const children = span.querySelectorAll<HTMLElement>('*');
    for (let i = 0; i < children.length; i++) {
      if (children[i].textContent !== null) {
        children[i].textContent += ' ';
      } else if (children[i].innerText !== undefined) {
        children[i].innerText += ' ';
      }
    }
  }

  const text = span.textContent || span.innerText || '';
  return text.replace(/ +/g, ' ');
}

/** 
 * Converts a number of seconds into a string in the format HH:MM:SS.
 */
export function timerFormat(timeSecond: number): string {
  const hours = Math.trunc(timeSecond / 3600);
  const fHours = hours < 10 ? `0${hours}` : `${hours}`;

  const minutes = Math.trunc((timeSecond % 3600) / 60);
  const fMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

  const seconds = timeSecond % 60;
  const fSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${fHours}:${fMinutes}:${fSeconds}`;
}

/**
 * Estimate the time (in seconds) to read a given article.
 * @param text - The text content of the article.
 * @returns Estimated reading time in seconds (as a number with one decimal place).
 */
export function estimateReadingTime(text: string): number {
  const wordCount = text.trim().split(/\s+/g).length;
  const readingTime = wordCount / 4; // 4 words per second
  return parseFloat(readingTime.toFixed(1)) || 1;
}

/**
 * Formats a UNIX timestamp (in seconds) to a string like: "July 3, 2023 at 12:30 PM"
 * @param timestamp - UNIX timestamp in seconds
 * @returns Formatted date string
 */
export function formatTimestamp(timestamp: number): string {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', options);
}

/**
 * Formats a JavaScript Date object to MM/YYYY format
 * @param date - JavaScript Date object
 * @returns Formatted string as MM/YYYY
 */
export function formatDate(date: Date): string {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const finalMonth = month < 10 ? `0${month}` : `${month}`;
  return `${finalMonth}/${year}`;
}

/**
 * Rounds a number to a given precision
 * @param value - Number to round
 * @param precision - Number of decimal places (default: 0)
 * @returns Rounded number
 */
export function round(value: number, precision = 0): number {
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Converts size in bytes to a human-readable format
 * @param sizeInBytes - File size in bytes
 * @returns Formatted file size string (e.g. "2.5 MB")
 */
export function getFileSize(sizeInBytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (sizeInBytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
  const size = sizeInBytes / Math.pow(1024, i);
  return `${round(size, 2)} ${sizes[i]}`;
}

/**
 * Converts a duration in seconds to a string in "M:SS" format.
 * @param seconds - Number of seconds
 * @returns A string like "2:05"
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  return `${minutes}:${formattedSeconds}`;
}

/**
 * Converts a date string or Date object to a relative time string.
 * @param date - A date string or Date instance
 * @returns Relative time string like "3 days ago"
 */
export function getTimeAgoFromDateTime(date: string | Date): string {
  const vDate = typeof date === 'string' ? new Date(date) : date;
  return getTimeAgo(Math.floor(vDate.getTime() / 1000));
}

/**
 * Converts a UNIX timestamp (in seconds) to a human-readable relative time string.
 * @param timestamp - UNIX timestamp in seconds
 * @returns A relative time string like "2 hours ago"
 */
export function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp * 1000;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (diff < minute) {
    return "a few seconds ago";
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (diff < week) {
    const days = Math.floor(diff / day);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (diff < month) {
    const weeks = Math.floor(diff / week);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else if (diff < year) {
    const months = Math.floor(diff / month);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.floor(diff / year);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
}

// UtilityFunction.ts

/** Converts a UNIX timestamp (in seconds) to an ISO 8601 date string. */
export function convertTimestampToDate(timestamp: number): string {
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
  return date.toISOString();
}

/** Parses a date string into a UNIX timestamp (in milliseconds). */
export function convertToTimestamp(dateformat: string): number {
  return Date.parse(dateformat);
}

/** Returns the current date and time formatted for input[type="datetime-local"]. */
export function currentTime(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = ("0" + (now.getMonth() + 1)).slice(-2);
  const day = ("0" + now.getDate()).slice(-2);
  const hour = ("0" + now.getHours()).slice(-2);
  const minute = ("0" + now.getMinutes()).slice(-2);

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

/** Generates a 20-character uppercase alphanumeric coupon code starting with "GSC". */
export function generateCoupon(): string {
  const length = 20;
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let coupon = "GSC";
  for (let i = 0; i < length - 3; ++i) {
    coupon += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return coupon;
}

/** Returns the current month as a string, e.g., "June". */
export function getCurrentMonth(): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[new Date().getMonth()];
}


/** 
 * This function takes a Date or date string as input and returns a formatted date string in the format `yyyyMMddTHHmmss`.
 */
export function formatDateToTimeZone(dateInputValue: string | number | Date): string {
  const date = new Date(dateInputValue);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/**
 * Sorts an array of objects by a given key in ascending order.
 * @param array - The array to sort.
 * @param key - The object key to sort by.
 */
export function sortByKeyASC<T extends Record<string, any>>(array: T[], key: keyof T): T[] {
  return [...array].sort((a, b) => {
    const x = a[key];
    const y = b[key];
    return x < y ? -1 : x > y ? 1 : 0;
  });
}

/**
 * Sorts an array of objects by a given key in descending order.
 * @param array - The array to sort.
 * @param key - The object key to sort by.
 */
export function sortByKeyDESC<T extends Record<string, any>>(array: T[], key: keyof T): T[] {
  return [...array].sort((a, b) => {
    const x = a[key];
    const y = b[key];
    return x < y ? 1 : x > y ? -1 : 0;
  });
}

export function formatDateT(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  return formattedDate;
}
/** function that takes a parameter as text and return the first character of the first word and the first character of the last word*/
export function getFirstAndLastChars(text:string): string {
  const words = text.split(" ");
  const first = words[0][0] || "";
  const last = words[words.length - 1][0] || "";
  return first + last;
}


export function formatMinutes(seconds: number, short: boolean = false): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return short ? `${minutes}m` : `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return short ? `${hours}h` : `${hours} h`;
    } else {
      return short
        ? `${hours}h${remainingMinutes}m`
        : `${hours} h ${remainingMinutes} min`;
    }
  }
}


export function formatDateTime(dateTimeString: string):string {
  const dateTime = new Date(dateTimeString);
  const today = new Date();
  const isToday = today.toLocaleDateString() === dateTime.toLocaleDateString();

  let formattedDateTime = `${dateTime.getDate()}-${dateTime.getMonth() + 1}-${dateTime.getFullYear()}`;
  if (isToday) {
    formattedDateTime = `${dateTime.getHours() < 10 ? '0' : ''}${dateTime.getHours()}:${dateTime.getMinutes()} ${dateTime.getHours() < 12 ? 'AM' : 'PM'}`;
  }

  return formattedDateTime;
}


export function formatTimeFromDateTime(dateTimeString:string):string {
  const dateTime = new Date(dateTimeString);
  return `${dateTime.getHours() < 10 ? '0' : ''}${dateTime.getHours()}:${dateTime.getMinutes()} ${dateTime.getHours() < 12 ? 'AM' : 'PM'}`;
}

export function formatMonthYear(input: string) {
  const parts = input.split('-');
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  if (parts.length === 3) {
    // Format: yyyy-mm-dd → return "dd Mon"
    const [year, month, day] = parts;
    const monthIndex = parseInt(month, 10) - 1;
    return `${parseInt(day, 10)}' ${months[monthIndex]}`;
  } else if (parts.length === 2) {
    // Format: yyyy-mm → return "Mon'yyyy"
    const [year, month] = parts;
    const monthIndex = parseInt(month, 10) - 1;
    return `${months[monthIndex]}'${year}`;
  } else {
    return input;
  }
}