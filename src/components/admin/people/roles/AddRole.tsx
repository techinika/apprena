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
import { zodResolver } from "@hookform/resolvers/zod";
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().max(160).min(4),
});

type formValues = z.infer<typeof formSchema>;

function AddRole() {
  const roleCollection = collection(db, "roles");

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: formValues) {
    const { id, name, description } = data;
    try {
      await setDoc(doc(roleCollection, id), {
        name,
        description,
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
        <h2 className="font-bold text-xl">Add a New Role</h2>
        <Separator />
        <form className="space-y-3 mt-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role ID</FormLabel>
                <FormControl>
                  <Input placeholder={`e.g, user`} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role Name</FormLabel>
                <FormControl>
                  <Input placeholder={`e.g, Normal User`} {...field} />
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
                    placeholder="e.g. Role of every user"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Add Role</Button>
        </form>
      </Form>
    </div>
  );
}

export default AddRole;
