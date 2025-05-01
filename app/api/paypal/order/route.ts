

import { NextResponse } from "next/server";
import { getPayPalClient } from "@/lib/paypal";
import {
  CheckoutPaymentIntent,
  OrdersController,
  ItemCategory,
  UpcType,
 
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
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
              landing_page: "LOGIN",
              shipping_preference: "GET_FROM_FILE",
              user_action: "PAY_NOW",
              return_url: "https://valhallasky.org/store",
              cancel_url: "https://valhallasky.org",
            },
          },
        },
        purchaseUnits: [
          {
            invoice_id: `invoice-${Math.floor(Math.random() * 1000000)}`,
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
                sku: items[0]?.sku,
                image_url:
                  "https://ibb.co/JRGLtS6F",
                url: "https://example.com/url-to-the-item-being-purchased-1",
                upc: { type: UpcType.UpcA, code: "123456789012" },
              }
            ],
          },
        ],
      };
    // Execute the request
    const order = await orderRequest.createOrder({
      body: payload,
      prefer: "return=minimal",
    });

    if (order.statusCode === 201 || order.statusCode === 200) {
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
