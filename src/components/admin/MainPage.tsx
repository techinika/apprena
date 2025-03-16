"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardTitle } from "../ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NewInstitution from "./NewInstitution";

function MainPage() {
  const router = useRouter();
  const [openNew, setOpenNew] = useState(false);
  const institutions = [
    {
      id: "uiii",
      name: "Techinika",
    },
  ];

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
          <Button onClick={() => router.back()}>
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
