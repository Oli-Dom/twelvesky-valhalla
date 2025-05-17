// console.log("logging from api/caputure/orderID")
// import { NextResponse } from 'next/server';
// import { getPayPalClient } from '@/lib/paypal';
// import { OrdersController } from '@paypal/paypal-server-sdk';

// export async function POST(request : Request, { params }) {
//   try {
//     console.log("The params are: ", params)
//     const { orderId } = await params.orderId;

//     if (!orderId) {
//       return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
//     }

//     const client = getPayPalClient();

//     // Create capture request
//     const captureRequest =  new OrdersController(client);

//     // Execute the capture request
//     const captureResponse = await captureRequest.captureOrder({
//       id: orderId});

//     if (captureResponse.statusCode === 201 || captureResponse.statusCode === 200) {
//       // Return relevant capture details
//       return NextResponse.json({
//         id: captureResponse.result.id,
//         status: captureResponse.result.status,
//         payer: captureResponse.result.payer,
//         purchaseUnits: captureResponse.result.purchaseUnits
//       }, { status: 200 });
//     } else {
//       console.error('PayPal capture error:', captureResponse);
//       return NextResponse.json({
//         error: 'Failed to capture payment.'
//       }, { status: captureResponse.statusCode });
//     }
//   } catch (error) {
//     console.error("Failed to capture payment:", error);
//     return NextResponse.json({ error: "Failed to capture payment." }, { status: 500 });
//   }
// }

// import { NextResponse } from "next/server";
// import { getPayPalClient } from "@/lib/paypal";
// import { OrdersController } from "@paypal/paypal-server-sdk";

// export async function POST(
//   request: Request,
//   { params }: { params: { orderId: string } }
// ) {
//   console.log("Capture request received with params:", params);

//   try {
//     // Correct way to access the orderId in Next.js App Router
//     const { orderId } = params;
//     console.log("OrderID extracted:", orderId);

//     if (!orderId) {
//       return NextResponse.json(
//         { error: "Order ID is required" },
//         { status: 400 }
//       );
//     }

//     const client = getPayPalClient();
//     const ordersController = new OrdersController(client);

//     // First, check the order status
//     console.log(`Checking status for order ${orderId} before capture`);
//     let orderDetails;

//     try {
//       // Pass orderId directly as a string parameter
//       orderDetails = await ordersController.getOrder({ id: orderId });
//       console.log(`Current order status: ${orderDetails.result.status}`);
//     } catch (orderError) {
//       console.error("Failed to get order details:", orderError);
//       return NextResponse.json(
//         {
//           error: "Failed to verify order status",
//           details: orderError.message,
//         },
//         { status: 500 }
//       );
//     }

//     // Handle different order states
//     if (orderDetails.result.status === "PAYER_ACTION_REQUIRED") {
//       console.log("Order requires additional payer action");

//       return NextResponse.json(
//         {
//           error: "Payment approval incomplete",
//           status: "PAYER_ACTION_REQUIRED",
//           message: "The payment requires additional approval from the customer",
//         },
//         { status: 400 }
//       );
//     }

//     if (orderDetails.result.status !== "APPROVED") {
//       console.log(
//         `Cannot capture order with status: ${orderDetails.result.status}`
//       );
//       return NextResponse.json(
//         {
//           error: "Order not in capturable state",
//           status: orderDetails.result.status,
//           message: `The order is in ${orderDetails.result.status} state and cannot be captured`,
//         },
//         { status: 400 }
//       );
//     }

//     // If we get here, the order is in APPROVED state and can be captured
//     console.log("Order is APPROVED. Proceeding with capture...");

//     try {
//       // Pass orderId as a string, not an object
//       const captureResponse = await ordersController.captureOrder({
//         id: orderId,
//       });
//       console.log("Capture successful:", captureResponse.statusCode);

//       return NextResponse.json(
//         {
//           id: captureResponse.result.id,
//           status: captureResponse.result.status,
//           payer: captureResponse.result.payer,
//           purchaseUnits: captureResponse.result.purchaseUnits,
//           approvalUrl: captureResponse.result.links,
//         },
//         { status: 200 }
//       );
//     } catch (captureError) {
//       console.error("Capture error:", captureError.body);

//       const errorDetails = {
//         error: "Failed to capture payment",
//         message: captureError.message,
//       };

//       if (captureError.body) {
//         try {
//           const parsedBody =
//             typeof captureError.body === "string"
//               ? JSON.parse(captureError.body)
//               : captureError.body;
//           errorDetails.details = parsedBody;
//         } catch (parseError) {
//           errorDetails.rawError = captureError.body;
//         }
//       }

//       return NextResponse.json(errorDetails, {
//         status: captureError.statusCode || 500,
//       });
//     }
//   } catch (error) {
//     console.error("General capture error:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to process payment capture",
//         message: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }


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

    const orderDetails = await  orders.getOrder({id:orderID})
        if (orderDetails.result.status === "COMPLETED") {
      return NextResponse.json({
        message: "Order already captured",
        paypalDetails: orderDetails.result,
      }, { status: 200 });
    }

    const captureRequest = await orders.captureOrder({id:orderID});
    const response = await captureRequest;

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
    return NextResponse.json({ error: "Failed to capture order.", details: error.message }, { status: 500 });
  }
}