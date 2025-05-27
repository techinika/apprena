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
import { showToast } from "@/lib/MessageToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileFormSchema = z.object({
  name: z.string(),
  description: z.string().max(160).min(4),
  price: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function AddPlan() {
  const planCollection = collection(db, "sub-plans");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    const { name, description, price } = data;
    try {
      await addDoc(planCollection, {
        name,
        description,
        price,
        status: "published",
        availability: "public",
        features: [],
        perks: "Access to Education",
        createdAt: serverTimestamp(),
      });
      showToast("Item added successfully!", "success");
      form.reset();
    } catch (error) {
      showToast("Error adding item. Please try again.", "error");
      console.error("Error adding item:", error);
    }
  }

  return (
    <div className="p-4">
      <Form {...form}>
        <h2 className="font-bold text-xl">Add a New Plan</h2>
        <Separator />
        <form className="space-y-3 mt-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan Name</FormLabel>
                <FormControl>
                  <Input placeholder={`e.g. Premium`} {...field} />
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
                    placeholder="e.g. Provides free access to all paid materials"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan Price in USD per Month</FormLabel>
                <FormControl>
                  <Input placeholder={`e.g. 10`} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Add Plan</Button>
        </form>
      </Form>
    </div>
  );
}

export default AddPlan;
