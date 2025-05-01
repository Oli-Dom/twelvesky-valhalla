import { NextResponse } from 'next/server';
import { getPayPalClient } from '@/lib/paypal';
import { PaymentsController } from "@paypal/paypal-server-sdk";

export async function POST(request : Request, { params }) {
  try {
    const { authorizationId } = params;
    const client = getPayPalClient();
    const paymentsController = new PaymentsController(client);
    
    const collect = {
      authorizationId: authorizationId,
      prefer: "return=minimal",
      body: {
        finalCapture: false,
      },
    };

    const { body, statusCode } = await paymentsController.captureAuthorizedPayment(collect);
    
    return NextResponse.json(JSON.parse(body), { status: statusCode });
  } catch (error) {
    console.error("Failed to capture authorize:", error);
    return NextResponse.json({ error: "Failed to capture authorize." }, { status: 500 });
  }
}