// console.log("logging from api/caputure/orderID")
// import { NextResponse } from 'next/server';
// import { getPayPalClient } from '@/lib/paypal';
// import { OrdersController } from '@paypal/paypal-server-sdk';

// export async function POST(request : Request, { params }) {
//   try {
//     const { orderId } = await params;
    
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

// api/paypal/capture/[orderId]/route.ts
import { NextResponse } from "next/server";
import { getPayPalClient } from "@/lib/paypal";
import {
  ApiError,
  OrdersController
} from "@paypal/paypal-server-sdk";

export async function POST(
  request: Request, 
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;
    
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const client = getPayPalClient();
    const ordersController = new OrdersController(client);
    
    // Create capture request
    const collect = {
      id: orderId,
      prefer: "return=minimal"
    };
    
    try {
      const { body, ...httpResponse } = await ordersController.captureOrder(collect);
      
      if (httpResponse.statusCode === 201 || httpResponse.statusCode === 200) {
        const jsonResponse = JSON.parse(body);
        console.log("Payment captured successfully:", jsonResponse.id);
        
        // Here you would typically update your database
        // to record the successful payment and add coins to the user account
        
        return NextResponse.json(jsonResponse, { status: httpResponse.statusCode });
      } else {
        console.error("PayPal capture error:", httpResponse);
        return NextResponse.json(
          { error: "Payment capture failed" },
          { status: httpResponse.statusCode || 500 }
        );
      }
    } catch (error) {
      if (error instanceof ApiError) {
        // Check for specific PayPal error types to handle accordingly
        // For example, INSTRUMENT_DECLINED should be communicated back to client
        // so it can call actions.restart()
        console.error("PayPal API Error:", error.message);
        return NextResponse.json(
          { 
            error: "Payment capture failed",
            details: [{ issue: error.name, description: error.message }],
            debug_id: error.debugId || "unknown"
          },
          { status: error.statusCode || 500 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Failed to capture payment:", error);
    return NextResponse.json(
      { error: "Failed to capture payment" },
      { status: 500 }
    );
  }
}