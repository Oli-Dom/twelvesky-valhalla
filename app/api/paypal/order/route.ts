console.log("Logging from api/order/route.ts")
import { NextResponse } from "next/server";
import { getPayPalClient } from "@/lib/paypal";
import {
  CheckoutPaymentIntent,
  OrdersController,
  ItemCategory,
  UpcType,
  PaypalWalletContextShippingPreference,
  PaypalExperienceLandingPage,
  PaypalExperienceUserAction,
  PayeePaymentMethodPreference

} from "@paypal/paypal-server-sdk";

export async function POST(request : Request) {
  try {
    const client = getPayPalClient();

    const body = await request.json();
    const { cart } = body;

    // Calculate total from cart
    const amount =
      cart?.total?.toString();
    const items =
      cart?.items?.map((item : any) => ({
        name: item.name || "Helix Coins Package",
        description: item.description || `${item.name} - Game Currency Package`,
        sku: (item.id as string) || "HELIX-COIN-PKG",
        unit_amount: {
          currencyCode: "USD",
          value: item.value.toString(),
        },
        quantity:  "1",
        category: "DIGITAL_GOODS",
        price : amount
      })) || [];

    // Create a new order request
    const orderRequest = new OrdersController(client);

    // Build the order payload for PayPal
    const payload = {
        intent: CheckoutPaymentIntent.Capture,
        paymentSource: {
          paypal: {
            experienceContext: {
              paymentMethodPreference: PayeePaymentMethodPreference.ImmediatePaymentRequired ,
              landingPage: PaypalExperienceLandingPage.Login,
              shippingPreference: PaypalWalletContextShippingPreference.NoShipping,
              userAction: PaypalExperienceUserAction.PayNow,
              returnUrl: "https://valhallasky.org/store",
              cancelUrl: "https://valhallasky.org",
            },
          },
        },
        purchaseUnits: [
          {
            amount: {
              currencyCode: "USD",
              value: items[0].price.toString(),
              breakdown: {
                itemTotal: {
                  currencyCode: "USD",
                  value: items[0].price.toString(),
                }, 
              },
            },
            items: [
              {
                name: items[0]?.name,
                description:  items[0]?.description,
                unitAmount: { currencyCode: "USD", value:  items[0].price.toString() },
                quantity: "1",
                category: ItemCategory.DigitalGoods,
              }
            ],
          },
        ],
      };
    // Execute the request
    const order = await orderRequest.createOrder({
      body: payload,
      prefer: "return=representation",
    });

    if (order.statusCode === 201 || order.statusCode === 200) {
      console.log(order)
      // Return just the order ID and status to the client
      return NextResponse.json(
        {
          id: order.result.id,
          status: order.result.status,
        },
        { status: 200 }
      );
    } else {
      console.error("PayPal createOrder response error:", order);
      return NextResponse.json(
        {
          error: "Failed to create order.",
        },
        { status: order.statusCode }
      );
    }
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order." },
      { status: 500 }
    );
  }
}




