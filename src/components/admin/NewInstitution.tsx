"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { db } from "@/db/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addDoc,
  collection,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";

const formSchema = z.object({
  name: z.string(),
  type: z.string(),
});

type formValues = z.infer<typeof formSchema>;

const NewInstitution = ({
  open,
  setOpen,
  cancel,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  cancel: () => void;
}) => {
  const { user } = useAuth();
  const institutionCollection = collection(db, "institutions");

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const handleAddInstitution = async () => {
    try {
      const name = form.getValues("name");
      const type = form.getValues("type");
      const userRef = doc(db, "profile", String(user?.uid));

      await addDoc(institutionCollection, {
        name,
        institutionType: type,
        organizationCreator: user?.uid,
        organizationAdmins: [user?.uid],
        accessLevel: "normal",
        createdAt: new Date(),
      });
      await updateDoc(userRef, {
        institutionMemberships: increment(1),
      });
      toast("Item added successfully!");
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <Drawer open={open}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Add a New Institution</DrawerTitle>
            <DrawerDescription>
              You add Minimal Data, you will add the rest later.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <Form {...form}>
              <form className="space-y-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Google" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select institution's type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="startup">Startup</SelectItem>
                          <SelectItem value="corporate">Corporate</SelectItem>
                          <SelectItem value="education_institution">
                            Education Institution
                          </SelectItem>
                          <SelectItem value="non_profit">Non-Profit</SelectItem>
                          <SelectItem value="government">
                            Government Institution
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <DrawerFooter>
            <Button onClick={() => handleAddInstitution()}>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline" onClick={cancel}>
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NewInstitution;
