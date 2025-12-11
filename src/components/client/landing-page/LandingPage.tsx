"use client";

import React from "react";
import Navbar from "../navigation/Nav";
import ProblemSolution from "@/components/sections/ProblemSolution";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";

function LandingPage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <Features />
      <CTASection />
      <Footer />
    </div>
  );
}

export default LandingPage;
