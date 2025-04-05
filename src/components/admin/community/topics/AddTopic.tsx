"use client";

import Loading from "@/app/loading";
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
import { useAuth } from "@/lib/AuthContext";
import { generateSlug } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string(),
  description: z.string().max(160).min(4),
});

type formValues = z.infer<typeof formSchema>;

function AddTopic({ institutionId }: { institutionId: string }) {
  const { user } = useAuth();
  const topicCollection = collection(db, "topics");
  const institutionRef = doc(db, "institutions", institutionId);
  const userRef = doc(db, "profile", String(user?.uid));
  const [loading, setLoading] = useState(false);

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: formValues) {
    setLoading(true);
    const { name, description } = data;
    if (!name || !description) {
      alert("Name and Description need to be added!");
      setLoading(false);
      return;
    }
    const slug = generateSlug(name);
    try {
      await setDoc(doc(topicCollection, slug), {
        name,
        description,
        institutionOwning: institutionRef,
        createdBy: userRef,
        createdAt: new Date(),
      });
      toast("Item added successfully!");
      form.reset();
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <Form {...form}>
        <h2 className="font-bold text-xl">Add a New Topic</h2>
        <Separator />
        <form className="space-y-3 mt-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role Name</FormLabel>
                <FormControl>
                  <Input placeholder={`e.g, Technology`} {...field} />
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
                    placeholder="e.g. Discuss about technology"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Add Topic</Button>
        </form>
      </Form>
    </div>
  );
}

export default AddTopic;
