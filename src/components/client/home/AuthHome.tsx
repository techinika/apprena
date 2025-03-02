"use client";

import React from "react";
import AuthNav from "../navigation/AuthNav";
import FooterSection from "@/components/sections/footer/default";
import Stats from "./stats";
import SectionHeader from "./SectionHeader";
import CourseList from "./CourseList";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Leaderboard } from "./Leaderboard";
import BlogList from "./BlogList";

function AuthHome() {
  return (
    <div>
      <AuthNav />
      <Stats />
      <div className="size grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-4 items-start">
        <div className="col-span-5">
          <SectionHeader
            title="Recommended Courses"
            buttonText="Explore More"
          />
          <CourseList />
          <div className="p-3"></div>
          <SectionHeader
            title="Recommended Articles"
            buttonText="Explore More"
          />
          <BlogList />
        </div>
        <Card className="col-span-2">
          <CardHeader>
            <SectionHeader title="Leaderboard" buttonText={null} />
          </CardHeader>
          <CardContent>
            <Leaderboard />
          </CardContent>
        </Card>
      </div>
      <FooterSection />
    </div>
  );
}

export default AuthHome;
