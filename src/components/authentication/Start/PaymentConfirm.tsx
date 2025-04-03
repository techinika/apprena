"use client";

import Nav from "@/components/client/navigation/Nav";
import FooterSection from "@/components/sections/footer/default";
import React from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { CircleCheckBig } from "lucide-react";

function PaymentConfirm() {
  const { invoiceId } = useParams();
  const router = useRouter();

  console.log(invoiceId);
  return (
    <div>
      <Nav />
      <div className="size p-16 text-center flex items-center justify-center gap-8 flex-col">
        <CircleCheckBig className="h-28 w-28" />
        <h2 className="font-bold text-4xl">Payment Successful.</h2>
        <p>
          Your payment has been successful, and your subscription is now active.
          Login to start using your benefits.
        </p>
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
      <FooterSection />
    </div>
  );
}

export default PaymentConfirm;
