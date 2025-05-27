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
import { showToast } from "@/lib/MessageToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string(),
});

type ProfileFormValues = z.infer<typeof formSchema>;

function AddPermission() {
  const permissionCollection = collection(db, "permissions");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    const { name } = data;
    try {
      await addDoc(permissionCollection, {
        name,
        permissions: [],
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
        <h2 className="font-bold text-xl">Add a New Permission</h2>
        <Separator />
        <form className="space-y-3 mt-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Permission Name</FormLabel>
                <FormControl>
                  <Input placeholder={`e.g. Create new article`} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Add Permission</Button>
        </form>
      </Form>
    </div>
  );
}

export default AddPermission;
