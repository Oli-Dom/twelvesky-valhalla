console.log("logging from api/caputure/orderID")
import { NextResponse } from 'next/server';
import { getPayPalClient } from '@/lib/paypal';
import { OrdersController } from '@paypal/paypal-server-sdk';

export async function POST(request : Request, { params }) {
  try {
    const { orderId } = await params;
    
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }
    
    const client = getPayPalClient();
    
    // Create capture request
    const captureRequest =  new OrdersController(client);
    
    
    // Execute the capture request
    const captureResponse = await captureRequest.captureOrder({
      id: orderId});
    
    if (captureResponse.statusCode === 201 || captureResponse.statusCode === 200) {
      // Return relevant capture details
      return NextResponse.json({
        id: captureResponse.result.id,
        status: captureResponse.result.status,
        payer: captureResponse.result.payer,
        purchaseUnits: captureResponse.result.purchaseUnits
      }, { status: 200 });
    } else {
      console.error('PayPal capture error:', captureResponse);
      return NextResponse.json({ 
        error: 'Failed to capture payment.' 
      }, { status: captureResponse.statusCode });
    }
  } catch (error) {
    console.error("Failed to capture payment:", error);
    return NextResponse.json({ error: "Failed to capture payment." }, { status: 500 });
  }
}