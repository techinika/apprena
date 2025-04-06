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
import { TransferList } from "@/components/ui/transfer-list";
import { db } from "@/db/firebase";
import { Feature } from "@/types/General";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string(),
  permissions: z.array(z.object({ id: z.string(), name: z.string() })),
});

type formValues = z.infer<typeof formSchema>;

const EditFeature = ({
  open,
  setOpen,
  cancel,
  id,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  cancel: () => void;
  id: string;
}) => {
  const [availableItems, setAvailableItems] = useState<
    { id: string; label: string }[]
  >([]);
  const [selectedItems, setSelectedItems] = useState<
    { id: string; label: string }[]
  >([]);

  const featureCollection = collection(db, "features");
  const permissionCollection = collection(db, "permissions");

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (!id) return;

    const fetchPlanDetails = async () => {
      try {
        const featureRef = doc(featureCollection, id);
        const featureSnapshot = await getDoc(featureRef);

        if (featureSnapshot.exists()) {
          const featureData = featureSnapshot.data();

          const permissionSnapshots = await getDocs(permissionCollection);
          const allFeatures = permissionSnapshots.docs.map((doc) => ({
            id: doc.id,
            label: doc.data().name,
          }));

          const assignedPermissions = featureData.permissions || [];
          const selected = assignedPermissions.map((feat: Feature) => ({
            id: feat.id,
            label: feat.name,
          }));

          const available = allFeatures.filter(
            (feat) => !selected.some((sel: Feature) => sel.id === feat.id)
          );

          form.reset({
            name: featureData.name || "",
            permissions: selected,
          });

          setAvailableItems(available);
          setSelectedItems(selected);
        }
      } catch (error) {
        console.error("Error fetching plan details:", error);
      }
    };

    fetchPlanDetails();
  }, [id, open, form]);

  const handleEdit = async () => {
    try {
      const featureRef = doc(featureCollection, id);
      const updatedData = {
        name: form.getValues("name"),
        permissions: selectedItems.map((item) => ({
          id: item.id,
          name: item.label,
        })),
      };

      await updateDoc(featureRef, updatedData);
      setOpen(false);
    } catch (error) {
      console.error("Error updating plan:", error);
    }
  };

  return (
    <Drawer open={open}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Edit The Feature</DrawerTitle>
            <DrawerDescription>
              Edit information and add permissions.
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
                      <FormLabel>Feature Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Access to all content"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions"
                  render={() => (
                    <FormItem>
                      <FormLabel>Assign Permissions to this feature</FormLabel>
                      <FormControl>
                        <TransferList
                          availableItems={availableItems}
                          selectedItems={selectedItems}
                          setAvailableItems={setAvailableItems}
                          setSelectedItems={setSelectedItems}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <DrawerFooter>
            <Button onClick={handleEdit}>Submit</Button>
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

export default EditFeature;
