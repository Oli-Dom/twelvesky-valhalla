// "use client";

// import { useState } from "react";
// import { PayPalButtons } from "@paypal/react-paypal-js";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";

// export default function PayPalCheckout({
//   isOpen,
//   onClose,
//   packageDetails,
//   onSuccess,
// }) {
//   const [error, setError] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Extract package details
//   const { id, name, price, coins } = packageDetails || {};

//   const createOrder = async () => {
//     try {
//       setIsProcessing(true);
//       setError(null);

//       // Calculate cart details using package information
//       const cart = {
//         items: [
//           {
//             id: id!.toString(),
//             name,
//             value: price!.toString(),
//             quantity: "1",
//           },
//         ],
//         total: price!.toString(),
//       };

//       const response = await fetch("/api/paypal/order", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ cart }),
//       });

//       const orderData = await response.json();
//       console.log("Order data:", orderData);

//       if (response.ok) {
//         return orderData.id;
//       } else {
//         throw new Error(orderData.error || "Something went wrong");
//       }
//     } catch (err: any) {
//       setError(err.message);
//       console.error(err);
//       return null; // Return null to prevent PayPal from proceeding
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const onApprove = async (data : any) => {
//     try {
//       setIsProcessing(true);
//       console.log("Order approved:", data);
//       const { orderID } = data;

//       // Call capture endpoint
//       const response = await fetch(`/api/paypal/capture/${orderID}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

      
//       const orderData = await response.json();
//       console.log("Capture response:", orderData);
//       if (response.ok) {
//         // Call onSuccess with both PayPal order data and original package details
//         if (onSuccess) {
//           onSuccess({
//             packageId: id,
//             packageName: name,
//             coins: coins,
//             price: price,
//             orderId: id,
//             paypalDetails: orderData,
//           });
//         }

//         console.log("Payment successful", orderData);

//         // Close modal after successful payment
//         setTimeout(() => {
//           onClose();
//         }, 1000);

//         return orderData;
//       } else {
//         throw new Error(orderData.error || "Payment could not be captured");
//       }
//     } catch (err: any) {
//       setError(err.message);
//       console.error(err);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const onError = (err) => {
//     console.error("PayPal error:", err);
//     setIsProcessing(false);
//   };

//   if (!isOpen || !packageDetails) return null;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <div className="flex items-center justify-between">
//             <DialogTitle>Purchase {name}</DialogTitle>
//           </div>
//           <DialogDescription>
//             {coins!.toLocaleString()} Helix Coins for ${price!.toFixed(2)}
//           </DialogDescription>
//         </DialogHeader>

//         <div className="mt-4 space-y-6">
//           {error && (
//             <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
//               Error: {error}
//             </div>
//           )}

//           {isProcessing && (
//             <div className="text-center py-2">
//               <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
//               <p className="mt-2 text-sm text-muted-foreground">
//                 Processing payment...
//               </p>
//             </div>
//           )}

//           <div className="paypal-button-container">
//             <PayPalButtons
//               style={{
//                 layout: "vertical",
//                 color: "gold",
//                 shape: "pill",
//                 label: "pay",
//               }}
//               createOrder={createOrder}
//               onApprove={onApprove}
//               onError={onError}
//               disabled={isProcessing}
//               forceReRender={[price, id]} // Re-render when these values change
//             />
//           </div>

//           <div className="text-xs text-center text-muted-foreground">
//             By completing this purchase, you agree to our Terms of Service.
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }


"use client";

import { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function PayPalCheckout({
  isOpen,
  onClose,
  packageDetails,
  onSuccess,
}) {
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Extract package details
  const { id, name, price, coins } = packageDetails || {};

  const createOrder = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Calculate cart details using package information
      const cart = {
        items: [
          {
            id: id?.toString(), 
            name,
            value: price?.toString(),
            quantity: "1",
          },
        ],
        total: price?.toString(),
      };

      const response = await fetch("/api/paypal/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),
      });

      const orderData = await response.json();
      console.log("Order data:", orderData);

      if (orderData.id) {
        return orderData.id;
      } else {
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);

        throw new Error(errorMessage);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error creating order:", err);
      return null; // Return null to prevent PayPal from proceeding
    } finally {
      setIsProcessing(false);
    }
  };

  const onApprove = async (data) => {
    try {
      setIsProcessing(true);
      console.log("Order approved:", data);
      const { orderID } = data;

      // Call capture endpoint
      const response = await fetch(`/api/paypal/capture/${orderID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const orderData = await response.json();
      console.log("Capture response:", orderData);
      
      // Handle different response scenarios
      const errorDetail = orderData?.details?.[0];

      if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
        // Recoverable error - let PayPal handle retry
        setError("Payment method declined. Please try again or use a different payment method.");
        return { action: "RESTART" };
      } else if (errorDetail) {
        // Non-recoverable error
        throw new Error(`${errorDetail.description} (${orderData.debug_id || 'unknown'})`);
      } else {
        // Successful capture
        if (orderData.status === "COMPLETED" || 
            orderData.status === "APPROVED") {
          
          // Call onSuccess with both PayPal order data and original package details
          if (onSuccess) {
            onSuccess({
              packageId: id,
              packageName: name,
              coins: coins,
              price: price,
              orderId: orderID,
              paypalDetails: orderData,
            });
          }

          console.log("Payment successful", orderData);

          // Close modal after successful payment
          setTimeout(() => {
            onClose();
          }, 1000);

          return { status: "COMPLETED" };
        } else {
          throw new Error(`Payment status: ${orderData.status}`);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error("Error capturing payment:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const onError = (err) => {
    console.error("PayPal error:", err);
    setError(`PayPal checkout error: ${err.message}`);
    setIsProcessing(false);
  };

  if (!isOpen || !packageDetails) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Purchase {name}</DialogTitle>
          </div>
          <DialogDescription>
            {coins?.toLocaleString()} Helix Coins for ${price?.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              Error: {error}
            </div>
          )}

          {isProcessing && (
            <div className="text-center py-2">
              <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">
                Processing payment...
              </p>
            </div>
          )}

          <div className="paypal-button-container">
            <PayPalButtons
              style={{
                layout: "vertical",
                color: "gold",
                shape: "pill",
                label: "pay",
              }}
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
              disabled={isProcessing}
              forceReRender={[price, id]} // Re-render when these values change
            />
          </div>

          <div className="text-xs text-center text-muted-foreground">
            By completing this purchase, you agree to our Terms of Service.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}