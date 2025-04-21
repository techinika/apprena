"use client";

import Loading from "@/app/loading";
import AuthNav from "@/components/client/navigation/AuthNav";
import Nav from "@/components/client/navigation/Nav";
import FooterSection from "@/components/sections/footer/default";
import Socials from "@/components/Socials";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db/firebase";
import { useAuth } from "@/lib/AuthContext";
import { User } from "@/types/Users";
import { format } from "date-fns";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { FilePenLine, Forward } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

function UserProfile({ id }: { id: string }) {
  const { user } = useAuth();
  const [profileData, setProfileData] = React.useState<User>();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const userRef = doc(db, "profile", id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setProfileData(userSnap.data() as User);
        } else {
          redirect("/");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(globalThis.location.href);
      toast("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      {user ? <AuthNav /> : <Nav />}
      {profileData ? (
        <div className="size">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-bold">{profileData?.displayName}</h1>
            <div className="flex items-center gap-4">
              {user?.uid === id && (
                <Link href="/profile">
                  <Button variant="outline">
                    <FilePenLine className="w-4 h-4" />
                    &nbsp; Edit Profile
                  </Button>
                </Link>
              )}
              <Button variant="outline" onClick={handleCopy}>
                <Forward className="w-4 h-4" />
                &nbsp; Share
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-5 my-5">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-4 gap-4">
                <Image
                  src={profileData?.photoURL ?? "/placeholder.jpg"}
                  alt={profileData?.displayName ?? "User Profile Picture"}
                  width={200}
                  height={200}
                  className="rounded-full border border-gray-300"
                />
                <CardTitle>{profileData?.displayName}</CardTitle>
                <CardDescription className="text-center">
                  {profileData?.bio}
                </CardDescription>
                <p>
                  Joined:{" "}
                  <span className="text-muted-foreground text-sm font-semibold">
                    {profileData?.createdAt
                      ? format(
                          (
                            profileData?.createdAt as unknown as Timestamp
                          ).toDate(),
                          "MMM yyyy"
                        )
                      : "N/A"}
                  </span>
                </p>
              </CardContent>
              <Separator />
              <CardFooter className="flex items-center justify-center p-3">
                <Socials
                  socialLinks={{
                    linkedin: profileData?.socialLinks?.linkedin,
                    twitter: profileData?.socialLinks?.twitter,
                    github: profileData?.socialLinks?.github,
                    website: profileData?.socialLinks?.website,
                  }}
                />
              </CardFooter>
            </Card>
            <div className="col-span-3 flex flex-col gap-4">
              <div className="grid grid-cols-4 gap-4 items-center">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="font-bold text-4xl">
                      {profileData?.score ?? 0}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Courses Taken</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="font-bold text-4xl">
                      {profileData?.coursesTaken ?? 0}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Posts Read</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="font-bold text-4xl">
                      {profileData?.blogsRead ?? 0}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Institution Memberships</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="font-bold text-4xl">
                      {profileData?.institutionMemberships ?? 0}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p>User not found.</p>
        </div>
      )}
      <FooterSection />
    </div>
  );
}

export default UserProfile;
