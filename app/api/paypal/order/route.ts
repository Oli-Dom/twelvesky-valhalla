// console.log("Logging from api/order/route.ts")
// import { NextResponse } from "next/server";
// import { getPayPalClient } from "@/lib/paypal";
// import {
//   CheckoutPaymentIntent,
//   OrdersController,
//   ItemCategory,
//   UpcType,
//   PaypalWalletContextShippingPreference,
//   PaypalExperienceLandingPage,
//   PaypalExperienceUserAction,
//   PayeePaymentMethodPreference

// } from "@paypal/paypal-server-sdk";

// export async function POST(request : Request) {
//   try {
//     const client = getPayPalClient();

//     const body = await request.json();
//     const { cart } = body;

//     // Calculate total from cart
//     const amount =
//       cart?.total?.toString();
//     const items =
//       cart?.items?.map((item : any) => ({
//         name: item.name || "Helix Coins Package",
//         description: item.description || `${item.name} - Game Currency Package`,
//         sku: (item.id as string) || "HELIX-COIN-PKG",
//         unit_amount: {
//           currencyCode: "USD",
//           value: item.value.toString(),
//         },
//         quantity:  "1",
//         category: "DIGITAL_GOODS",
//         price : amount
//       })) || [];

//     // Create a new order request
//     const orderRequest = new OrdersController(client);

//     // Build the order payload for PayPal
//     const payload = {
//         intent: CheckoutPaymentIntent.Capture,
//         paymentSource: {
//           paypal: {
//             experienceContext: {
//               paymentMethodPreference: PayeePaymentMethodPreference.ImmediatePaymentRequired ,
//               landingPage: PaypalExperienceLandingPage.Login,
//               shippingPreference: PaypalWalletContextShippingPreference.NoShipping,
//               userAction: PaypalExperienceUserAction.PayNow,
//               returnUrl: "https://valhallasky.org/store",
//               cancelUrl: "https://valhallasky.org",
//             },
//           },
//         },
//         purchaseUnits: [
//           {
//             amount: {
//               currencyCode: "USD",
//               value: items[0].price.toString(),
//               breakdown: {
//                 itemTotal: {
//                   currencyCode: "USD",
//                   value: items[0].price.toString(),
//                 }, 
//               },
//             },
//             items: [
//               {
//                 name: items[0]?.name,
//                 description:  items[0]?.description,
//                 unitAmount: { currencyCode: "USD", value:  items[0].price.toString() },
//                 quantity: "1",
//                 category: ItemCategory.DigitalGoods,
//               }
//             ],
//           },
//         ],
//       };
//     // Execute the request
//     const order = await orderRequest.createOrder({
//       body: payload,
//       prefer: "return=minimal",
//     });

//     if (order.statusCode === 201 || order.statusCode === 200) {
//       console.log(order)
//       // Return just the order ID and status to the client
//       return NextResponse.json(
//         {
//           id: order.result.id,
//           status: order.result.status,
//         },
//         { status: 200 }
//       );
//     } else {
//       console.error("PayPal createOrder response error:", order);
//       return NextResponse.json(
//         {
//           error: "Failed to create order.",
//         },
//         { status: order.statusCode }
//       );
//     }
//   } catch (error) {
//     console.error("Failed to create order:", error);
//     return NextResponse.json(
//       { error: "Failed to create order." },
//       { status: 500 }
//     );
//   }
// }




// api/paypal/order/route.ts
import { NextResponse } from "next/server";
import { getPayPalClient } from "@/lib/paypal";
import {
  ApiError,
  OrdersController,
  CheckoutPaymentIntent,
  OrderApplicationContextLandingPage,
  OrderApplicationContextShippingPreference,
  OrderApplicationContextUserAction
} from "@paypal/paypal-server-sdk";

export async function POST(request: Request) {
  try {
    const client = getPayPalClient();
    const body = await request.json();
    const { cart } = body;
    
    // Calculate total from cart
    const amount = cart?.total?.toString();
    
    // Extract item details
    const items = cart?.items?.map((item: any) => ({
      name: item.name || "Helix Coins Package",
      description: item.description || `${item.name} - Game Currency Package`,
      sku: item.id?.toString() || "HELIX-COIN-PKG",
      unitAmount: {
        currencyCode: "USD",
        value: item.value.toString()
      },
      quantity: "1"
    })) || [];
    
    // Create order request
    const ordersController = new OrdersController(client);
    
    // Build the payload following PayPal's structure
    const collect = {
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: "USD",
              value: amount,
              breakdown: {
                itemTotal: {
                  currencyCode: "USD",
                  value: amount
                }
              }
            },
            items: items
          }
        ],
        applicationContext: {
          brandName: "Valhalla Sky",
          landingPage: OrderApplicationContextLandingPage.Login,
          shippingPreference: OrderApplicationContextShippingPreference.NoShipping,
          userAction: OrderApplicationContextUserAction.PayNow,
          returnUrl: "https://valhallasky.org/store",
          cancelUrl: "https://valhallasky.org"
        }
      },
      prefer: "return=minimal"
    };
    
    // Execute the request
    try {
      const { body, ...httpResponse } = await ordersController.createOrder(collect);
      
      if (httpResponse.statusCode === 201 || httpResponse.statusCode === 200) {
        const jsonResponse = JSON.parse(body);
        console.log("Order created successfully:", jsonResponse.id);
        
        // Return order ID and status to client
        return NextResponse.json(
          {
            id: jsonResponse.id,
            status: jsonResponse.status
          },
          { status: httpResponse.statusCode }
        );
      } else {
        console.error("PayPal createOrder response error:", httpResponse);
        return NextResponse.json(
          { error: "Failed to create order." },
          { status: httpResponse.statusCode || 500 }
        );
      }
    } catch (error) {
      if (error instanceof ApiError) {
        console.error("PayPal API Error:", error.message);
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode || 500 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order." },
      { status: 500 }
    );
  }
}