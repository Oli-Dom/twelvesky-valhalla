
import { NextResponse } from "next/server";
import { getPayPalClient } from "@/lib/paypal";
import { OrdersController } from "@paypal/paypal-server-sdk";

export async function POST(
  request: Request,
  { params }: { params: { orderID: string } }
) {
  const { orderID } = await params;
  console.log("Received orderId in capture endpoint:", orderID);

  try {
    const client = getPayPalClient();
    const orders = new OrdersController(client);

    const orderDetails = await orders.getOrder({ id: orderID });
    if (orderDetails.result.status === "COMPLETED") {
      return NextResponse.json(
        {
          message: "Order already captured",
          paypalDetails: orderDetails.result,
        },
        { status: 200 }
      );
    }

    const captureResponse = await orders.captureOrder({
      id: orderID,
      body:{}
    });
    const response = await captureResponse;

    console.log("PayPal Capture API Response:", response);

    if (response.statusCode === 201) {
      return NextResponse.json(response.result, { status: 201 });
    } else {
      console.error("PayPal Capture Error:", response);
      return NextResponse.json(
        { error: "Failed to capture order.", details: response.result },
        { status: response.statusCode }
      );
    }
  } catch (error: any) {
    console.error("Error capturing order:", error);
    return NextResponse.json(
      { error: "Failed to capture order.", details: error.message },
      { status: 500 }
    );
  }
}
