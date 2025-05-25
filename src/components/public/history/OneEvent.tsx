"use client";

import AuthNav from "@/components/client/navigation/AuthNav";
import Nav from "@/components/client/navigation/Nav";
import { useAuth } from "@/lib/AuthContext";
import FooterSection from "@/components/sections/footer/default";
import React, { useEffect } from "react";
import Loading from "@/app/loading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/db/firebase";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface Event {
  id: string;
  title: string;
  cover: string;
  description: string;
  occuringDate?: string;
}

export default function OneEvent({ eventId }: { eventId: string }) {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [event, setEvent] = React.useState<Event | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchEvents = async () => {
      try {
        const eventRef = doc(db, "historyEvents", eventId);
        const eventSnap = await getDoc(eventRef);

        if (!eventSnap.exists()) {
          redirect("/history");
        }

        const eventData = eventSnap.data() as Event;

        setEvent({
          id: eventSnap.id,
          title: eventData.title,
          cover: eventData.cover || "/placeholder.jpg",
          description: eventData.description ?? "",
          occuringDate: eventData.occuringDate,
        });
        console.log("Event fetched:", eventData);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [eventId]);

  if (loading) return <Loading />;

  return (
    <div className="md:block">
      {user ? <AuthNav /> : <Nav />}
      <div className="size">
        <div className="bg-background">
          <div className="">
            <div className="h-full py-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-3xl font-semibold tracking-tight">
                    {event?.title ?? "Event Details"}
                  </h2>
                </div>
              </div>
              <Separator className="my-4" />
              <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-2 mt-4")}>
                <div className="rounded-md">
                  <Image
                    src={event?.cover ?? "/placeholder.jpg"}
                    alt={event?.title ?? ""}
                    width={500}
                    height={500}
                    className={cn("h-72 w-auto object-cover transition-all")}
                  />
                </div>

                <div className="md:space-y-1 text-sm col-span-2">
                  <h3 className="font-bold text-2xl leading-none my-2">
                    {`Happened on ${event?.occuringDate}`}
                  </h3>
                  <p
                    className="py-2 text-lg"
                    dangerouslySetInnerHTML={{
                      __html: event?.description ?? "",
                    }}
                  ></p>
                  <Link href="/history">
                    <Button>View All Events</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
