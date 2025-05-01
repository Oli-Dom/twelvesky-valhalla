import {
    Client,
    Environment,
    LogLevel
  } from "@paypal/paypal-server-sdk";
  
  export function getPayPalClient() {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
    if (!clientId || !clientSecret) {
      throw new Error("Missing PayPal API credentials");
    }
  
    return new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: clientId,
        oAuthClientSecret: clientSecret,
      },
      timeout: 0,
      environment: process.env.NODE_ENV === "production" 
        ? Environment.Production
        : Environment.Sandbox,
      logging: {
        logLevel: LogLevel.Info,
        logRequest: { logBody: true },
        logResponse: { logHeaders: true },
      },
    });
  }