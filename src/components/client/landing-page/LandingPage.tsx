"use client";

import React from "react";
import Nav from "../navigation/Nav";
import Hero from "@/components/sections/hero/default";
import Faq from "@/components/sections/faq/default";
import Pricing from "@/components/sections/pricing/default";
import FooterSection from "@/components/sections/footer/default";
import Cta from "@/components/sections/cta/default";
import { Testimonials } from "@/components/sections/testimonials/default";
import { Benefits } from "@/components/sections/benefits/learners";

function LandingPage() {
  return (
    <div>
      <Nav />
      <Hero />
      <Benefits />
      <Pricing />
      <Faq />
      <Testimonials />
      <Cta />
      <FooterSection />
    </div>
  );
}

export default LandingPage;
