"use client";

import Loading from "@/app/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { db } from "@/db/firebase";
import { useAuth } from "@/lib/AuthContext";
import { User } from "@/types/Users";
import { collection, doc, DocumentData, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

function Stats() {
  const { user } = useAuth();
  const [userData, setUserData] = React.useState<
    User | DocumentData | undefined | null
  >(null);
  const [loading, setLoading] = useState(true);
  const userCollection = collection(db, "profile");

  useEffect(() => {
    if (!user) return;

    const fetchUserProfile = async () => {
      try {
        const userRef = doc(userCollection, user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserData({ ...user, ...userData });
          setLoading(false);
        } else {
          console.log("No such user!");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, [user, userCollection]);

  if (loading) return <Loading />;

  return (
    <Section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Courses Taken</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {userData?.coursesTaken || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            +{userData?.coursesTakenInLastMonth || 0} in the last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Blogs Read</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userData?.blogsRead || 0}</div>
          <p className="text-xs text-muted-foreground">
            +{userData?.blogsReadInLastMonth} in the last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            institution Membership
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {userData?.institutionMemberships || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            +{userData?.institutionMembershipsInLastMonth || 0} in the last
            month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Community Contributions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {userData?.communityContributions || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            +{userData?.communityContributionsInLastMonth} in the last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userData?.badges || 0}</div>
          <p className="text-xs text-muted-foreground">
            +{userData?.badgesInLastMonth} in the last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Times</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {userData?.mostActiveTimes || "NA"}
          </div>
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
          <div className="text-2xl font-bold">{userData?.referrals || 0}</div>
          <p className="text-xs text-muted-foreground">
            +{userData?.referralsInLastMonth || 0} in the last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Skills Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userData?.score || 0}</div>
          <p className="text-xs text-muted-foreground">
            +{userData?.scoreInLastHour || 0} in the last hour
          </p>
        </CardContent>
      </Card>
    </Section>
  );
}

export default Stats;
