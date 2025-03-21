"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageHeader from "../main/PageHeader";
import Image from "next/image";
import { Github, Globe, Linkedin, Twitter } from "lucide-react";
import { collection, doc, DocumentData, getDoc } from "firebase/firestore";
import { db } from "@/db/firebase";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

function OneUserPage() {
  const { username }: { username: string } = useParams();
  const [user, setUserData] = useState<DocumentData>();
  const userCollection = collection(db, "profile");

  useEffect(() => {
    if (!username) return;

    const fetchUserProfile = async () => {
      try {
        const userRef = doc(userCollection, username);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserData(userData);
        } else {
          console.log("No such user!");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
    console.log(user);
  }, [username, userCollection, user]);

  return (
    <div className="w-full space-y-6 p-8 pt-6 bg-gray-50">
      <PageHeader
        title={user?.displayName || "No Display Name"}
        newItem={false}
        onExport={() => null}
        onPublish={() => null}
        saveDraft={() => null}
      />
      <div className="shadow-md rounded-lg p-6 flex gap-3">
        <div className="w-[30%] flex flex-col items-center justify-center text-center p-5">
          <div>
            {user?.photoURL && (
              <Image
                src={user.photoURL || "/placeholder.jpg"}
                alt={user.displayName}
                width={150}
                height={150}
                className="rounded-full border m-3 object-cover"
              />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{user?.displayName} </h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Social Profiles</h3>
            <div className="flex space-x-4 mt-2">
              <Link
                href={user?.socialLinks?.linkedin || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="text-blue-600 text-2xl" />
              </Link>
              <Link
                href={user?.socialLinks?.github || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="text-gray-800 text-2xl" />
              </Link>
              <Link
                href={user?.socialLinks?.twitter || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="text-blue-400 text-2xl" />
              </Link>
              <Link
                href={user?.socialLinks?.website || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="text-green-600 text-2xl" />
              </Link>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold">
              Subscription & Entitlement
            </h3>
            <div className="flex gap-5 py-2  justify-center items-center">
              <p className="text-gray-600">
                <b>Plan</b>: {user?.subscriptionPlan}
              </p>
              <p className="text-gray-600">
                <b>Role</b>: {user?.role}
              </p>
            </div>
          </div>
        </div>
        <Separator orientation="vertical" />
        <div className="mt-6 w-[70%]">
          <h3 className="text-xl font-semibold">Contact & Address</h3>
          <Separator />
          <div className="py-4">
            <p className="text-gray-600">Phone: {user?.phoneNumber || "N/A"}</p>
            <p className="text-gray-600">
              Country: {user?.address?.country || "N/A"}
            </p>
            <p className="text-gray-600">
              City: {user?.address?.city || "N/A"}
            </p>
          </div>
          <h3 className="text-xl font-semibold">Other Information</h3>
          <Separator />
          <div className="py-4">
            <p className="text-gray-600">Biography: {user?.bio || "N/A"}</p>
            <p className="text-gray-600">
              Nationality: {user?.nationality || "N/A"}
            </p>
            <p className="text-gray-600">
              Date of Birth: {user?.dateOfBirth || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OneUserPage;
