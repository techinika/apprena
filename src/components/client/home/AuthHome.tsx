"use client";

import React from "react";
import AuthNav from "../navigation/AuthNav";
import FooterSection from "@/components/sections/footer/default";
import Stats from "./stats";
import SectionHeader from "./SectionHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Leaderboard } from "./Leaderboard";
import ProtectedRoute from "@/lib/ProtectedRoute";

function AuthHome() {
  return (
    <ProtectedRoute>
      <AuthNav />
      <Stats />
      <div className="size grid gap-4 grid-cols-1 md:grid-cols-7 mb-4 items-start">
        <div className="md:col-span-5">
          <SectionHeader
            title="Courses Enrolled In"
            buttonText="Explore More"
            link="/courses"
          />
          {/* <CourseList /> */}
          <div className="p-3"></div>
          <SectionHeader
            title="Articles Read"
            buttonText="Explore More"
            link="/articles"
          />
          {/* <BlogList /> */}
          <div className="p-3"></div>
          <SectionHeader
            title="Training Enrolled In"
            buttonText="Explore More"
            link="/training"
          />
          {/* <BlogList /> */}
          <div className="p-3"></div>
          {/* <SectionHeader
            title="Challenges Participating In"
            buttonText="Explore More"
            link="/challenges"
          /> */}
          {/* <BlogList /> */}
          <div className="p-3"></div>
        </div>
        <Card className="md:col-span-2">
          <CardHeader>
            <SectionHeader title="Leaderboard" buttonText={null} link={null} />
          </CardHeader>
          <CardContent>
            <Leaderboard />
          </CardContent>
        </Card>
      </div>
      <FooterSection />
    </ProtectedRoute>
  );
}

export default AuthHome;
