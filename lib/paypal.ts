// import {
//     Client,
//     Environment,
//     LogLevel
//   } from "@paypal/paypal-server-sdk";
  
//   export function getPayPalClient() {
//     const clientId = process.env.PAYPAL_CLIENT_ID;
//     const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
//     if (!clientId || !clientSecret) {
//       throw new Error("Missing PayPal API credentials");
//     }
  
//     return new Client({
//       clientCredentialsAuthCredentials: {
//         oAuthClientId: clientId,
//         oAuthClientSecret: clientSecret,
//       },
//       timeout: 0,
//       environment: process.env.NODE_ENV === "production" 
//         ? Environment.Production
//         : Environment.Sandbox,
//       logging: {
//         logLevel: LogLevel.Info,
//         logRequest: { logBody: true },
//         logResponse: { logHeaders: true },
//       },
//     });
//   }

// lib/paypal.ts
import {
  Client,
  Environment,
  LogLevel
} from "@paypal/paypal-server-sdk";

// Set up the PayPal client
export function getPayPalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured");
  }
  
  return new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: clientId,
      oAuthClientSecret: clientSecret
    },
    timeout: 30000, // 30 seconds timeout
    environment: process.env.NODE_ENV === "production" 
      ? Environment.Production 
      : Environment.Sandbox,
    logging: {
      logLevel: process.env.NODE_ENV === "production" 
        ? LogLevel.Warn 
        : LogLevel.Info,
      logRequest: { logBody: process.env.NODE_ENV !== "production" },
      logResponse: { logHeaders: process.env.NODE_ENV !== "production" }
    }
  });
}