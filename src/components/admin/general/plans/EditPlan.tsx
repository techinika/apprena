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
import { Textarea } from "@/components/ui/textarea";
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
  description: z.string().max(160).min(4),
  price: z.string(),
  features: z.array(z.object({ id: z.string(), name: z.string() })),
});

type formValues = z.infer<typeof formSchema>;

const EditPlan = ({
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

  const planCollection = collection(db, "sub-plans");
  const featuresCollection = collection(db, "features");

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (!id) return;

    const fetchPlanDetails = async () => {
      try {
        const planRef = doc(planCollection, id);
        const planSnapshot = await getDoc(planRef);

        if (planSnapshot.exists()) {
          const planData = planSnapshot.data();

          // Fetch all available features
          const featureSnapshots = await getDocs(featuresCollection);
          const allFeatures = featureSnapshots.docs.map((doc) => ({
            id: doc.id,
            label: doc.data().name,
          }));

          // Extract selected features from the plan
          const assignedFeatures = planData.features || [];
          const selected = assignedFeatures.map((feat: Feature) => ({
            id: feat.id,
            label: feat.name,
          }));

          // Filter out assigned features from available features
          const available = allFeatures.filter(
            (feat) => !selected.some((sel: Feature) => sel.id === feat.id)
          );

          // Set form values and transfer list data
          form.reset({
            name: planData.name || "",
            description: planData.description || "",
            price: planData.price || "",
            features: selected,
          });

          setAvailableItems(available);
          setSelectedItems(selected);
        }
      } catch (error) {
        console.error("Error fetching plan details:", error);
      }
    };

    fetchPlanDetails();
  }, [id, open, planCollection, featuresCollection, form]);

  const handleEdit = async () => {
    try {
      const planRef = doc(planCollection, id);
      const updatedData = {
        name: form.getValues("name"),
        description: form.getValues("description"),
        price: form.getValues("price"),
        features: selectedItems.map((item) => ({
          id: item.id,
          name: item.label,
        })),
      };

      await updateDoc(planRef, updatedData);
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
            <DrawerTitle>Edit The Plan</DrawerTitle>
            <DrawerDescription>
              Edit information and add features.
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
                      <FormLabel>Plan Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Premium" {...field} />
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
                        <Input placeholder="e.g. 10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="features"
                  render={() => (
                    <FormItem>
                      <FormLabel>Assign Features to this plan</FormLabel>
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

export default EditPlan;
