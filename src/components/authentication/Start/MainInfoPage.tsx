/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Nav from "@/components/client/navigation/Nav";
import FooterSection from "@/components/sections/footer/default";
import React, { useState } from "react";
import PricingToStart from "./PricingToStart";
import { Button } from "@/components/ui/button";
import { Plans } from "@/types/General";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Switch } from "@/components/ui/switch";
import Loading from "@/app/loading";
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/db/firebase";
import ConfirmPayment from "./ConfirmPayment";
import { useRouter } from "next/navigation";
import { InvoiceData } from "@/types/Payment";
import useIremboPay from "@/hooks/use-irembo-pay";
import { toast } from "sonner";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string(),
  country: z.string(),
  city: z.string(),
});

type formValues = z.infer<typeof formSchema>;

function MainInfoPage() {
  const router = useRouter();
  const scriptLoaded = useIremboPay();
  const [selectedPlan, setSelectedPlan] = useState<Plans>();
  const [amount, setAmount] = useState(selectedPlan?.price);
  const [period, setPeriod] = useState("month");
  const [loading, setLoading] = useState(false);
  const [pendingPayment, setPendingPayment] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>();
  const [newUser, setNewUser] = useState<string>("");
  const profileCollection = collection(db, "profile");
  const invoiceCollection = collection(db, "invoices");
  const subscriptionCollection = collection(db, "subscriptions");

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const changeBillingPeriod = (e: any) => {
    const val = e.target.value;
    console.log(val);

    if (val === "month") {
      setAmount(selectedPlan?.price);
      setPeriod("year");
      setAmount(Number(selectedPlan?.price) * 12);
    } else {
      setPeriod("month");
      setAmount(Number(selectedPlan?.price));
    }
  };

  async function handleSubscription() {
    setLoading(true);
    try {
      const invoiceId = `TS-${Date.now()}`;
      const dataValues = form.getValues();
      const currentDate = new Date();
      const expirationDate = new Date(currentDate);
      expirationDate.setDate(currentDate.getDate() + 2);

      const timezoneOffset = currentDate.getTimezoneOffset() / 60;
      const timezoneOffsetFormatted =
        timezoneOffset > 0
          ? `-${String(timezoneOffset).padStart(2, "0")}:00`
          : `+${String(Math.abs(timezoneOffset)).padStart(2, "0")}:00`;

      const formattedExpirationDate = expirationDate.toISOString().slice(0, 19);
      const finalDate = `${formattedExpirationDate}${timezoneOffsetFormatted}`;

      if (
        dataValues?.city === "" ||
        dataValues?.country === "" ||
        dataValues?.email === "" ||
        dataValues?.name === "" ||
        dataValues?.phone === ""
      ) {
        alert(
          "Your contact and addresses are required! Kindly fill it and try again!"
        );
        return;
      }

      const response = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: invoiceId,
          paymentAccountIdentifier: "SUBSCRIPTIONS_USD",
          customer: {
            email: dataValues?.email,
            phoneNumber: dataValues?.phone,
            name: dataValues?.name,
          },
          paymentItems: [
            {
              unitAmount: amount,
              quantity: period === "month" ? 1 : 12,
              code: "PC-49eda209b0",
            },
          ],
          description: `Subscription payment for ${selectedPlan?.name} plan, paid by ${dataValues?.email}`,
          expiryAt: `${finalDate}`,
          language: "EN",
        }),
      });

      const invoiceResponse = await response.json();
      if (!response?.ok) {
        console.log(response);
        alert("Invoice generation failed");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        dataValues?.email,
        `${process.env.NEXT_PUBLIC_TEMPORARY_PASS}`
      );

      const userId = userCredential.user.uid;

      setNewUser(userId);

      await setDoc(doc(profileCollection, userId), {
        uid: userId,
        displayName: dataValues?.name || "Anonymous User",
        email: dataValues?.email,
        photoURL: "",
        phoneNumber: dataValues?.phone || "",
        dateOfBirth: null,
        gender: null,
        bio: "",
        nationality: "",
        score: 0,
        scoreInLastHour: 0,
        referrals: 0,
        referralsInLastMonth: 0,
        badges: 0,
        badgesInLastMonth: 0,
        communityContributions: 0,
        communityContributionsInLastMonth: 0,
        institutionMemberships: 0,
        institutionMembershipsInLastMonth: 0,
        coursesTaken: 0,
        coursesTakenInLastMonth: 0,
        blogsRead: 0,
        blogsReadInLastMonth: 0,
        mostActiveTimes: "NA",
        preferredLanguage: "English",

        role: "user",
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        status: "active",

        address: {
          country: dataValues?.country,
          city: dataValues?.city,
          state: "",
          zipCode: "",
          physicalAddress: "",
        },

        // Social & Online Presence
        socialLinks: {
          linkedin: "",
          github: "",
          twitter: "",
          website: "",
        },

        // Preferences & Interests
        interests: [],
        preferredNotificationMethod: "email",

        // Security & Authentication
        twoFactorAuthEnabled: false,

        subscriptionPlan: selectedPlan ? selectedPlan?.id : "free",
        billingInfo: {
          address: "",
          paymentMethod: "",
          transactionHistory: [],
        },
      });

      await setDoc(doc(invoiceCollection, invoiceId), {
        invoiceId: invoiceResponse?.data?.invoiceNumber,
        transactionId: invoiceId,
        paymentStatus: invoiceResponse?.data?.paymentStatus,
        createdAt: invoiceResponse?.data?.createdAt,
        expiresAt: invoiceResponse?.data?.expiryAt,
        description: invoiceResponse?.data?.description,
        paymentLinkUrl: invoiceResponse?.data?.paymentLinkUrl,
        currency: invoiceResponse?.data?.currency,
        customer: userId,
        createdBy: invoiceResponse?.data?.createdBy,
        paymentAccountIdentifier:
          invoiceResponse?.data?.paymentAccountIdentifier,
        productPlan: selectedPlan?.id,
      });

      await setDoc(doc(subscriptionCollection, userId), {
        invoiceId,
        userId,
        status: "payment_pending",
        plan: selectedPlan?.id,
      });

      setInvoiceData(invoiceResponse?.data);

      setPendingPayment(true);
    } catch (error: any) {
      console.error("Error handling subscription:", error);
      return { success: false, error: error?.message };
    } finally {
      setLoading(false);
    }
  }

  const makePayment = () => {
    setLoading(true);
    if (!scriptLoaded) {
      alert("Payment script is still loading. Please wait...");
      return;
    }

    if ((globalThis as any)?.IremboPay) {
      (globalThis as any).IremboPay.initiate({
        publicKey: process.env.NEXT_PUBLIC_PAYMENT_PUBLIC_KEY,
        invoiceNumber: invoiceData?.invoiceNumber,
        locale: (globalThis as any).IremboPay.locale.EN,
        callback: async (err: any) => {
          if (!err) {
            await updateDoc(
              doc(invoiceCollection, invoiceData?.transactionId),
              {
                paymentStatus: "PAID",
                paidAt: new Date(),
              }
            );

            await updateDoc(doc(subscriptionCollection, newUser), {
              status: "active",
              paidAt: new Date(),
            });

            toast("Payment successful!");
            setLoading(false);

            globalThis.location.href = `/start/payment/${invoiceData?.invoiceNumber}`;
          } else {
            console.error("Payment error:", err);
            alert("Payment failed. Please try again.");
            setLoading(false);
          }
        },
      });
    } else {
      alert("Payment service not loaded. Please try again.");
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      {pendingPayment && (
        <ConfirmPayment
          open={pendingPayment}
          cancel={() => {
            setPendingPayment(false);
            router.push("/login");
          }}
          action={() => {
            makePayment();
          }}
        />
      )}
      <Nav />
      <PricingToStart setSelectedPlan={setSelectedPlan} setAmount={setAmount} />
      {selectedPlan && (
        <div className="size flex gap-8 items-start mb-7">
          <Card className="w-[70%]">
            <CardHeader>
              <CardTitle>Provide User Information</CardTitle>
              <CardDescription>
                Provide information that will be used to create a user profile
                on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <div className="flex flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. example@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <PhoneInput
                            placeholder="e.g. +250789..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Rwanda" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Kigali" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
            </CardContent>
          </Card>
          <Card className="w-[30%]">
            <CardHeader>
              <CardTitle>Proceed with Payment</CardTitle>
              <CardDescription>
                All payment options are available.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 my-5">
                <Switch
                  id="billing-period"
                  value={period}
                  onClick={changeBillingPeriod}
                />
                <Label htmlFor="billing-period">Turn annual billing ON</Label>
              </div>
              <Label>Outstanding Amount:</Label>
              <p className="text-2xl font-bold">{amount}</p>
              <Label>Subscription Period:</Label>
              <p className="text-2xl font-bold">
                {period == "month" ? "Monthly" : "Annually"}
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubscription}>Confirm Subscription</Button>
            </CardFooter>
          </Card>
        </div>
      )}
      <FooterSection />
    </div>
  );
}

export default MainInfoPage;
