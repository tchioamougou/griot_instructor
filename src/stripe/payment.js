/**
 * Author: Styves
 * .
 * date: 04/01/2024
 */
const uriPayments = import.meta.env.VITE_APP_DOMAIN_GRIOT_DATA_BASE + "payments";
/** this function is used to create user */
export const charges = (request) => {
    return fetch(`${uriPayments}/charge`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
};