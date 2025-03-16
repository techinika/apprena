"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardTitle } from "../ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NewInstitution from "./NewInstitution";
import { Institution } from "@/types/Institution";
import { db } from "@/db/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

function MainPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [openNew, setOpenNew] = useState(false);
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const q = query(
        collection(db, "institutions"),
        where("organizationCreator", "==", user?.uid),
        where("organizationAdmins", "array-contains", user?.uid)
      );
      onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            createdAt: docData.createdAt
              ? formatDistanceToNow(docData.createdAt.toDate(), {
                  addSuffix: true,
                  locale: enUS,
                })
              : "Unknown",
            ...docData,
          } as Institution;
        });
        setInstitutions(data);
      });
    };
    getData();
  }, []);

  const handleOpenNew = () => {
    setOpenNew(!openNew);
  };

  return (
    <div className="size my-16">
      <div>
        <NewInstitution
          setOpen={setOpenNew}
          open={openNew}
          cancel={() => setOpenNew(false)}
        ></NewInstitution>
        <div className="flex justify-between items-center">
          <Button onClick={() => router.push("/home")}>
            <ArrowLeft /> Go back
          </Button>
          <Button onClick={handleOpenNew}>
            Add New Institution <Plus />
          </Button>
        </div>
        <Separator className="my-2" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {institutions.length > 0 ? (
          institutions.map((item) => {
            return (
              <Card
                key={item?.id}
                className="p-5 cursor-pointer"
                onClick={() => router.push(`/admin/${item?.id}`)}
              >
                <CardTitle className="text-center">{item?.name}</CardTitle>
                <CardContent className="flex items-center justify-center p-4">
                  <Image
                    src="/placeholder.jpg"
                    width={100}
                    height={100}
                    alt={`${item?.name} logo`}
                    className="rounded-full"
                  />
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card
            className="p-5 flex items-center justify-center text-center flex-col gap-5"
            onClick={handleOpenNew}
          >
            <CardTitle>Add New Institution</CardTitle>
            <CardContent>
              <Plus className="h-20 w-20" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default MainPage;
