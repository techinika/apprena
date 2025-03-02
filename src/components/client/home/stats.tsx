import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import React from "react";

function Stats() {
  return (
    <Section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Courses Taken</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">33</div>
          <p className="text-xs text-muted-foreground">+3 in the last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Blogs Read</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">33</div>
          <p className="text-xs text-muted-foreground">+3 in the last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            institution Membership
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">33</div>
          <p className="text-xs text-muted-foreground">+3 in the last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Community Contributions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">33</div>
          <p className="text-xs text-muted-foreground">+3 in the last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">33</div>
          <p className="text-xs text-muted-foreground">+3 in the last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Times</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Daily</div>
          <p className="text-xs text-muted-foreground">
            Has not missed in this week
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">38</div>
          <p className="text-xs text-muted-foreground">+19 in the last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Skills Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">206</div>
          <p className="text-xs text-muted-foreground">+100 in the last hour</p>
        </CardContent>
      </Card>
    </Section>
  );
}

export default Stats;
