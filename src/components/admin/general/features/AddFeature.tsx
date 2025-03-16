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
import { db } from "@/db/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const profileFormSchema = z.object({
  name: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function AddFeature() {
  const featureCollection = collection(db, "features");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    console.log(data);
    const { name } = data;
    try {
      await addDoc(featureCollection, {
        name,
        permissions: [],
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
        <h2 className="font-bold text-xl">Add a New Feature</h2>
        <Separator />
        <form className="space-y-3 mt-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feature Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder={`e.g. Access to all contents`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Add Feature</Button>
        </form>
      </Form>
    </div>
  );
}

export default AddFeature;
