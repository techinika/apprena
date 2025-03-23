"use client";

import Link from "next/link";
import React from "react";
import { APP } from "@/variables/globals";
import { RegisterSteps } from "./RegisterSteps";
import Image from "next/image";

function RegisterPage() {
  return (
    <div>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <Link
            href="/"
            className="relative z-20 flex items-center text-lg font-medium"
          >
            <Image
              src="/black-logo.png"
              width={150}
              height={300}
              alt={APP?.DESCRIPTION}
              className="object-cover"
            />
          </Link>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;
                {`Your institution deserves a solution that allows you to focus on delivering results. ${APP?.NAME} take care of your operations, and you focus on your people's success.`}
                &rdquo;
              </p>
              <footer className="text-sm">{APP?.NAME} Team</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <RegisterSteps />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
