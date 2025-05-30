import { app, auth } from "./index";
import { getMessaging, getToken } from "firebase/messaging";
// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      getMessaging();
    }
  });
}
export const getUserToken = () => {
  getToken(messaging, {
    vapidKey:
      "BB-vR7HhcMy7LLQD1FRuXA0rwohxmSdzMgVhbQxt0eJoM-9NQ8T7JyXDwP4L9YW3-gjiic9z9Mfu4qdRlNcukIY",
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log("this is the token of the current user", currentToken);
        // ...
      } else {
        // Show permission request UI
        console.log(
          "No registration token available. Request permission to generate one."
        );
        requestPermission();
        // ...
      }
    })
    .catch((error) => {
      console.log("error occurred when generated token", error);
    });
};
