import TrainingLayout from "@/components/admin/training/OneTrainingLayout/TrainingLayout";
import { Metadata } from "next";
import { use } from "react";

export const metadata: Metadata = {
  title: "Training Details",
  description: "View and Edit Training.",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ trainingId: string }>;
}

export default function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const { trainingId } = use(params);
  return <TrainingLayout trainingId={trainingId}>{children}</TrainingLayout>;
}
