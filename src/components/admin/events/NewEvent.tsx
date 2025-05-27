"use client";

import React, { useState } from "react";
import PageHeader from "../main/PageHeader";
import { z } from "zod";
import { useAuth } from "@/lib/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-uploader";
import { FileSvgDraw } from "../blog/AddNewPost";
import { Paperclip } from "lucide-react";
import { collection, doc, setDoc } from "firebase/firestore";
import { generateSlug } from "@/lib/utils";
import { db } from "@/db/firebase";
import Loading from "@/app/loading";
import Editor from "../blog/Editor";
import { showToast } from "@/lib/MessageToast";

const formSchema = z.object({
  title: z.string(),
  cover: z.string().optional(),
  occuringDate: z.string().optional(),
  description: z.string().min(10).max(400),
  likes: z.array(z.string()).optional(),
  shares: z.number().optional(),
  seo: z.string().optional(),
  createdAt: z.string().optional(),
  updatedBy: z.string().optional(),
  updatedAt: z.string().optional(),
});

type formValues = z.infer<typeof formSchema>;

function NewEvent({ institutionId }: { institutionId: string }) {
  const { user } = useAuth();
  const [cover, setCover] = React.useState<string | null>(null);
  const [files, setFiles] = useState<File[] | null>(null);
  const eventsRef = collection(db, "historyEvents");
  const [loading, setLoading] = useState(false);
  const institutionRef = doc(db, "institutions", institutionId);
  const userRef = doc(db, "profile", String(user?.uid));

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
  };

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      seo: "today in history, history events",
      cover: cover ?? "/placeholder.jpg",
      occuringDate: "",
      likes: [],
      shares: 0,
      createdAt: new Date().toISOString(),
    },
    mode: "onChange",
  });
  const handlePublish = async (data: formValues) => {
    setLoading(true);
    if (
      !data?.cover ||
      !data?.title ||
      !data?.description ||
      !data?.occuringDate
    ) {
      alert(
        "Title, Description, Cover Image and Date of occurence need to be filled."
      );
      return;
    }

    const slug = generateSlug(data?.title);
    try {
      await setDoc(doc(eventsRef, slug), {
        ...data,
        slug: slug,
        institutionOwning: institutionRef,
        seo: data?.seo ?? "today in history, history events",
        createdBy: userRef,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      showToast("New event added successfully!", "success");
      form.reset();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async () => {
    if (!files || files.length === 0) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (response.ok) {
        setCover(result.url);
        setFiles(null);
        showToast("Image uploaded successfully!", "success");
        form.setValue("cover", result.url);
      } else {
        showToast("Image upload failed: ", "error");
        console.error("Image upload failed", result.message);
      }
    } catch (error) {
      showToast("Error uploading image: ", "error");
      console.error("Error uploading image:", error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles([e.target.files[0]]);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-4 p-8 pt-6">
      <PageHeader
        title="Add New Event"
        newItem={true}
        onPublish={() => {
          handlePublish(form.getValues());
        }}
        onExport={() => console.log("clicked")}
        saveDraft={() => void 0}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            console.log(data);
          })}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Describe the article in a few words`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="occuringDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Occurrence Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder={`Describe the article in a few words`}
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
                  <FormLabel className="font-bold">Description</FormLabel>
                  <FormControl>
                    <Editor field={field} />
                  </FormControl>
                  <FormDescription>
                    Not more than 400 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col space-y-1.5 gap-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="visibility" className="font-bold">
                  Cover Image
                </Label>
                <Button size="xs" onClick={handleUploadImage}>
                  Upload
                </Button>
              </div>
              <FileUploader
                value={files}
                onValueChange={setFiles}
                dropzoneOptions={dropZoneConfig}
                className="relative bg-background rounded-lg p-2"
              >
                <FileInput
                  onChange={handleFileChange}
                  className="outline-dashed outline-1 outline-white"
                >
                  <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                    <FileSvgDraw />
                  </div>
                </FileInput>
                <FileUploaderContent>
                  {files &&
                    files.length > 0 &&
                    files.map((file, i) => (
                      <FileUploaderItem key={i} index={i}>
                        <Paperclip className="h-4 w-4 stroke-current" />
                        <span>{file.name}</span>
                      </FileUploaderItem>
                    ))}
                </FileUploaderContent>
              </FileUploader>
            </div>
            <FormField
              control={form.control}
              name="seo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    SEO Keywords (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`technology, science, health, etc`}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    These keywords will help in search engine optimization.
                    Separate them with commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}

export default NewEvent;
