"use client";

import React from "react";
import Nav from "../navigation/Nav";
import Hero from "@/components/sections/hero/default";
import FAQ from "@/components/sections/faq/default";
import Pricing from "@/components/sections/pricing/default";
import FooterSection from "@/components/sections/footer/default";
import CTA from "@/components/sections/cta/default";
import { Testimonials } from "@/components/sections/testimonials/default";
import { Benefits } from "@/components/sections/benefits/learners";
import Loading from "@/app/loading";

function LandingPage() {
  const [loading, setLoading] = React.useState(false);

  if (loading) return <Loading />;
  return (
    <div>
      <Nav />
      <Hero />
      <Benefits />
      <Pricing setLoading={setLoading} />
      <FAQ setLoading={setLoading} />
      <Testimonials />
      <CTA />
      <FooterSection />
    </div>
  );
}

export default LandingPage;
