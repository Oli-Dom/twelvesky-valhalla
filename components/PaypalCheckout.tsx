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
}: {
  isOpen: any;
  onClose: any;
  packageDetails: any;
  onSuccess: any;
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
            id: id!.toString(),
            name,
            value: price!.toString(),
            quantity: "1",
          },
        ],
        total: price!.toString(),
      };

      const response = await fetch("/api/paypal/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),
      });

      const orderData = await response.json();

      if (response.ok) {
        return orderData.id;
      } else {
        throw new Error(orderData.error || "Something went wrong");
      }
    } catch (err: any) {
      setError(err.message);
      return null; // Return null to prevent PayPal from proceeding
    } finally {
      setIsProcessing(false);
    }
  };

  const onApprove = async (data: any) => {
    console.log("Data received in onApprove:", data);
    try {
      setIsProcessing(true);
      const { orderID: orderId } = data;
      console.log(orderId);
      // Call capture endpoint
      const response = await fetch(`/api/paypal/${orderId}/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const orderData = await response.json();

      if (response.ok) {
        // Handle successful capture as before
        if (onSuccess) {
          onSuccess({
            packageId: id,
            packageName: name,
            coins: coins,
            price: price,
            orderId: orderId,
            paypalDetails: orderData,
            approvalUrl: orderData.approvalUrl,
          });
        }

        // Close modal after successful payment
        setTimeout(() => {
          onClose();
        }, 1000);

        return orderData;
      } else {
        // Handle specific error cases
        if (
          orderData.status === "PAYER_ACTION_REQUIRED" &&
          orderData.approvalUrl
        ) {
          // If order needs additional approval, offer to redirect

          // Optional: You could redirect to the approval URL here
          window.location.href = orderData.approvalUrl;
        } else {
          throw new Error(
            orderData.message ||
              orderData.error ||
              "Payment could not be captured"
          );
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const onError = (err: any) => {
    console.log(err);
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
            {coins!.toLocaleString()} Helix Coins for ${price!.toFixed(2)}
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
              onApprove={async (data, actions) => {
                await actions.order!.capture();

                const orderId = data.orderID;

                const response = await fetch(`/api/paypal/${orderId}/capture`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                });

                const orderData = await response.json();

                if (response.ok) {
                  if (onSuccess) {
                    onSuccess({
                      packageId: id,
                      packageName: name,
                      coins: coins,
                      price: price,
                      orderId: orderId,
                      paypalDetails: orderData,
                      approvalUrl: orderData.approvalUrl,
                    });
                  }

                  setTimeout(() => {
                    onClose();
                  }, 1000);

                  return orderData;
                } else {
                  if (
                    orderData.status === "PAYER_ACTION_REQUIRED" &&
                    orderData.approvalUrl
                  ) {
                    window.location.href = orderData.approvalUrl;
                  } else {
                    throw new Error(
                      orderData.message ||
                        orderData.error ||
                        "Payment could not be captured"
                    );
                  }
                }
              }}
              onError={onError}
              disabled={isProcessing}
              forceReRender={[price, id]}
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
