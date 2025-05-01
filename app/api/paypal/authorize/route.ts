import { NextResponse } from 'next/server';
import { getPayPalClient } from '@/lib/paypal';
import { OrdersController } from "@paypal/paypal-server-sdk";

export async function POST(request : Request, { params }) {
  try {
    const { orderId } = await params;
    const client = getPayPalClient();
    const ordersController = new OrdersController(client);
    
    const collect = {
      id: orderId,
      prefer: "return=minimal",
    };

    const { body, statusCode } = await ordersController.authorizeOrder(collect);
    
    return NextResponse.json(JSON.parse(body), { status: statusCode });
  } catch (error) {
    console.error("Failed to authorize order:", error);
    return NextResponse.json({ error: "Failed to authorize order." }, { status: 500 });
  }
}
