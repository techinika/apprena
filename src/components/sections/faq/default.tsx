"use client";

import { Section } from "../../ui/section";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../ui/accordion";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/db/firebase";
import React from "react";
import { Faqs } from "@/types/General";

export default function Faq() {
  const [faqsData, setFaqsData] = React.useState<Faqs[]>([]);

  React.useEffect(() => {
    const getData = async () => {
      // setLoading(true);
      const faqCollection = collection(db, "faqs");

      const q = query(faqCollection);
      onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            ...docData,
          } as Faqs;
        });
        setFaqsData(data);
        // setLoading(false);
      });
    };
    getData();
  }, [faqsData]);

  return (
    <Section>
      <div className="grid md:grid-cols-3 grid-cols-1 items-start gap-8">
        <h2 className="text-start text-3xl font-semibold flex-1 sm:text-5xl">
          Frequently Asked Questions
        </h2>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-[800px] flex-2 md:col-span-2"
        >
          {faqsData.length > 0 ? (
            faqsData.map((item) => (
              <AccordionItem key={item?.id} value={item?.id}>
                <AccordionTrigger>{item?.title}</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4 max-w-[640px] text-balance text-muted-foreground">
                    {item?.description}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))
          ) : (
            <p>No FAQs for now!</p>
          )}
        </Accordion>
      </div>
    </Section>
  );
}
