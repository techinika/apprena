"use client";

import { cn } from "@/lib/utils";
import { Section } from "../../ui/section";
import { Button } from "../../ui/button";
import { CircleCheckBig, User } from "lucide-react";
import Link from "next/link";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/db/firebase";
import React from "react";
import { Plans } from "@/types/General";

export default function Pricing() {
  const planCollection = collection(db, "sub-plans");

  const [plansData, setPlansData] = React.useState<Plans[]>([]);

  React.useEffect(() => {
    const getData = async () => {
      const q = query(planCollection);
      onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            ...docData,
          } as Plans;
        });
        setPlansData(data);
      });
    };
    getData();
  }, [planCollection]);

  return (
    <Section>
      <div className="mx-auto flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-4 text-center sm:gap-8">
          <h2 className="text-3xl font-semibold leading-tight sm:text-5xl sm:leading-tight">
            Access your Deserved Learning Experience
          </h2>
          <p className="text-md max-w-[600px] font-medium text-muted-foreground sm:text-xl">
            Invest in your future by securing a subscription that will unlock
            your next step in lifetime evolution.
          </p>
        </div>
        <div className="mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plansData.length > 0 ? (
            plansData
              .sort((a, b) => a?.price - b?.price)
              .map((plan) => (
                <div
                  key={plan.name}
                  className={cn(
                    "relative flex flex-col gap-6 overflow-hidden rounded-2xl bg-primary/5 p-8"
                  )}
                >
                  <hr
                    className={cn(
                      "absolute top-0 h-[1px] border-0 bg-linear-to-r from-transparent via-foreground/60 to-transparent"
                    )}
                  />
                  <div className="flex flex-col gap-7">
                    <div className="flex flex-col gap-2">
                      <h2 className="flex items-center gap-2 font-bold">
                        <User className="h-4 w-4" />
                        {plan?.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {plan?.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 lg:flex-col lg:items-start xl:flex-row xl:items-center">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-muted-foreground">
                          $
                        </span>
                        <span className="text-6xl font-bold">{plan.price}</span>
                      </div>
                      <div className="flex min-h-[40px] flex-col">
                        {plan.price > 0 ? (
                          <>
                            <span className="text-sm">Monthly payment</span>
                            <span className="text-sm text-muted-foreground">
                              including local taxes
                            </span>
                          </>
                        ) : (
                          <div className="flex min-h-[40px] flex-col">
                            <span className="text-sm">Free Forever</span>
                            <span className="text-sm text-muted-foreground">
                              No payment method required
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant={plan?.price == 0 ? "outline" : "default"}
                      size="lg"
                      asChild
                    >
                      <Link href={plan?.price == 0 ? "/register" : "/start"}>
                        {" "}
                        {plan?.price == 0
                          ? "Get Started For Free"
                          : "Get Started"}
                      </Link>
                    </Button>
                    <p className="text-md text-muted-foreground">
                      Access the following perks and more:
                    </p>
                    <hr className="border-input" />
                  </div>
                  <div>
                    <ul className="flex flex-col gap-2">
                      {plan.features.map((feature) => (
                        <li
                          key={feature?.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CircleCheckBig className="h-4 w-4 shrink-0 text-muted-foreground" />
                          {feature?.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
          ) : (
            <p>No plans data for now!</p>
          )}
        </div>
      </div>
    </Section>
  );
}
