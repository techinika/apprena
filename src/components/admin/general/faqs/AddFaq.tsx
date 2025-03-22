"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db/firebase";
import { APP } from "@/variables/globals";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const profileFormSchema = z.object({
  title: z.string(),
  description: z.string().max(160).min(4),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {
  description: `e.g, What is ${APP?.NAME}?`,
};

function AddFaq() {
  const faqCollection = collection(db, "faqs");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    console.log(data);
    const { title, description } = data;
    try {
      await addDoc(faqCollection, {
        title,
        description,
        status: "published",
        availability: "public",
        createdAt: serverTimestamp(),
      });
      toast("Item added successfully!");
      form.reset();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  }

  return (
    <div className="p-4">
      <Form {...form}>
        <h2 className="font-bold text-xl">Add a New FAQ</h2>
        <Separator />
        <form className="space-y-3 mt-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>FAQ Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder={`e.g, What is ${APP?.NAME}?`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Response to FAQ"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Add FAQ</Button>
        </form>
      </Form>
    </div>
  );
}

export default AddFaq;
