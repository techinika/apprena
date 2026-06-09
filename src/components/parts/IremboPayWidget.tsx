"use client";

import { useEffect, useState } from "react";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface IremboPayWidgetProps {
  invoiceNumber: string;
  onSuccess: () => void;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    IremboPay: {
      initiate: (options: {
        publicKey: string;
        invoiceNumber: string;
        locale: string;
        callback: (err: unknown, resp: unknown) => void;
      }) => void;
      closeModal: () => void;
      locale: {
        EN: string;
        FR: string;
        RW: string;
      };
    };
  }
}

export default function IremboPayWidget({ invoiceNumber, onSuccess, onError }: IremboPayWidgetProps) {
  const [loading, setLoading] = useState(true);
  const [publicKey, setPublicKey] = useState("");

  useEffect(() => {
    const loadPublicKey = async () => {
      try {
        const res = await fetch("/api/payment-public-key");
        const data = await res.json();
        setPublicKey(data.publicKey || "");
      } catch (error) {
        console.error("Failed to load public key:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPublicKey();
  }, []);

  const initiatePayment = () => {
    if (!publicKey || !invoiceNumber) {
      toast.error("Payment not configured");
      onError?.("Payment not configured");
      return;
    }

    try {
      if (window.IremboPay) {
        window.IremboPay.initiate({
          publicKey,
          invoiceNumber,
          locale: window.IremboPay?.locale?.EN || "EN",
          callback: (err, resp: any) => {
            if (err) {
              console.error("Payment error:", err);
              toast.error("Payment failed. Please try again.");
              onError?.(String(err));
            } else if (resp?.data?.paymentStatus === "PAID") {
              toast.success("Payment successful!");
              onSuccess();
            } else {
              toast.error("Payment was not completed");
              onError?.("Payment not completed");
            }
          },
        });
      } else {
        toast.error("Payment widget not loaded");
        onError?.("Payment widget not loaded");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error("Failed to initiate payment");
      onError?.(String(error));
    }
  };

  return (
    <button
      onClick={initiatePayment}
      disabled={loading || !publicKey}
      className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          Loading...
        </>
      ) : (
        <>
          <CreditCard size={20} />
          Pay with IremboPay
        </>
      )}
    </button>
  );
}