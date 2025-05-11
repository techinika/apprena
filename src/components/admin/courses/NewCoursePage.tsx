"use client";

import Loading from "@/app/loading";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db/firebase";
import { Topic } from "@/types/Discussion";
import { User } from "@/types/Users";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import PageHeader from "../main/PageHeader";
import { Input } from "@/components/ui/input";
import Editor from "../blog/Editor";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-uploader";
import { FileSvgDraw } from "../blog/AddNewPost";
import { CalendarIcon, Paperclip, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, generateSlug } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { TagInput } from "@/components/ui/TagInput";
import TagSelect from "@/components/ui/TagSelect";
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";

const formSchema = z.object({
  title: z.string(),
  description: z.string().min(10).max(150),
  detailedSummary: z.string(),
  coverImage: z.string(),
  isFeatured: z.string(),
  publishedAt: z.string(),
  availability: z.string(),
  topic: z.string(),
  realPrice: z.string(),
  discountedPrice: z.string(),
  discount: z.boolean(),
  discountPercentage: z.string(),
  level: z.string(),
  courseLanguage: z.string(),
  status: z.string(),
  tags: z.string(),
  institutionOwning: z.string(),
  courseRequirements: z
    .array(z.string())
    .nonempty("Please add at least one requirement."),
  keyLessons: z
    .array(z.string())
    .nonempty("Please add at least one key lesson."),
  targetAudience: z
    .array(z.string())
    .nonempty("Please specify at least one target audience."),
  instructors: z
    .array(z.string())
    .nonempty("The course needs at least one instructor"),
});

type formValues = z.infer<typeof formSchema>;

function NewCoursePage({ institutionId }: { institutionId: string }) {
  const { user } = useAuth();
  const [date, setDate] = React.useState<Date>();
  const [files, setFiles] = useState<File[] | null>(null);
  const courseCollection = collection(db, "courses");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [cover, setCover] = React.useState<string | null>(null);
  const [contributors, setContributors] = React.useState<User[]>();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const institutionDocRef = doc(db, "institutions", institutionId);
        const institutionSnap = await getDoc(institutionDocRef);

        if (!institutionSnap.exists()) {
          console.warn("Institution not found");
          return;
        }

        const institutionData = institutionSnap.data();
        const adminRefs: DocumentReference[] =
          institutionData.organizationAdmins ?? [];

        const topicsQuery = query(
          collection(db, "topics"),
          where("institutionOwning", "==", institutionDocRef)
        );
        const topicsSnapshot = await getDocs(topicsQuery);
        const topicsData = topicsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Topic[];
        setTopics(topicsData);

        const usersQuery = query(
          collection(db, "profile"),
          where("role", "in", ["admin", "super_admin", "contributor"])
        );
        const usersSnapshot = await getDocs(usersQuery);
        const allUsers = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];

        const contributorData = allUsers.filter((u) =>
          adminRefs.some((adminRef) => adminRef.id === u.uid)
        );
        setContributors(contributorData);
      } catch (error) {
        console.error("Error fetching institution data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [institutionId]);

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
      coverImage: cover ?? "",
      isFeatured: "false",
      publishedAt: "",
      availability: "private",
      status: "draft",
      tags: "",
      topic: "",
      institutionOwning: institutionId,
      keyLessons: [],
      courseRequirements: [],
      targetAudience: [],
      detailedSummary: "",
      instructors: [],
    },
    mode: "onChange",
  });

  const processArticleCreation = async (data: formValues) => {
    try {
      const userRef = doc(db, "profile", String(user?.uid));
      const institutionRef = doc(db, "institutions", institutionId);
      let topicRef = null;
      if (data?.topic) {
        topicRef = doc(db, "topics", String(data.topic));
      }

      const slug = generateSlug(data?.title);

      await setDoc(doc(courseCollection, slug), {
        title: data?.title,
        description: data?.description ?? "",
        coverImage: data?.coverImage ?? "/placeholder.jpg",
        isFeatured: data?.isFeatured ?? false,
        publishedAt: data?.publishedAt ?? "",
        visibility: data?.availability ?? "private",
        writtenBy: userRef,
        tags: data?.tags ?? "",
        topic: topicRef,
        institutionOwning: institutionRef,
        createdBy: userRef,
        realPrice: data?.realPrice,
        status: data?.status === "draft" ? "draft" : "published",
        createdAt: new Date(),
        courseRequirements: data?.courseRequirements ?? [],
        keyLessons: data?.keyLessons ?? [],
        targetAudience: data?.targetAudience ?? [],
        curriculum: null,
        instructors: data?.instructors ?? [],
        learners: 0,
        upvotes: [],
        rating: null,
      });
      toast("Course created successfully");
      form.reset();
    } catch (error) {
      console.error("Error processing course creation:", error);
    }
  };

  const visibility = [
    {
      value: "Public",
      label: "public",
    },
    {
      value: "Private",
      label: "private",
    },
  ];

  const handleSaveDraft = (data: formValues) => {
    const newData = {
      ...data,
      status: "draft",
      publishedAt: "",
    };

    processArticleCreation(newData);
  };

  const handlePublish = (data: formValues) => {
    const newData = {
      ...data,
      status: "published",
      publishedAt: String(new Date()),
    };

    processArticleCreation(newData);
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
        toast.success("Image uploaded successfully!");
        form.setValue("coverImage", result.url);
      } else {
        console.error("Image upload failed", result.message);
      }
    } catch (error) {
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
        title="Add New Course"
        newItem={true}
        onPublish={() => {
          handlePublish(form.getValues());
        }}
        onExport={() => console.log("clicked")}
        saveDraft={() => handleSaveDraft(form.getValues())}
      />
      <Form {...form}>
        <div className="grid grid-cols-4 items-start justify-between gap-3">
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="This is the title of the course"
                      className="text-4xl font-bold py-5 mb-3 w-full"
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
                    <Textarea
                      placeholder="Provide a brief description of the course"
                      className="font-bold w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Not more than 150 characters.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="detailedSummary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    Detailed Description
                  </FormLabel>
                  <FormControl>
                    <Editor field={field} />
                  </FormControl>
                  <FormDescription>
                    Share a detailed explanation to help learners understand the
                    course better and what to expect from it.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="realPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Course Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0"
                      className="font-bold w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    If your course if free, add 0 on the price.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Target Audience</FormLabel>
                  <FormControl>
                    <TagInput
                      placeholder="Who is this course for?"
                      className="font-bold w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Add ideal learners for this course. After one sentence,
                    click enter to add another one.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courseRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    Course Requirements
                  </FormLabel>
                  <FormControl>
                    <TagInput
                      placeholder="What are the requirements to take this course?"
                      className="font-bold w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Add requirements to take this course. After one sentence,
                    click enter to add another one.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keyLessons"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Key Lessons</FormLabel>
                  <FormControl>
                    <TagInput
                      placeholder="What will learners learn from this course?"
                      className="font-bold w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Add key outcomes from this course. After one sentence, click
                    enter to add another one.
                  </FormDescription>
                </FormItem>
              )}
            />

            <Label className="font-bold">Instructors</Label>
            <Controller
              name="instructors"
              control={form?.control}
              render={({ field }) => (
                <TagSelect
                  options={
                    contributors
                      ? contributors.map((c) => ({
                          value: c.id,
                          label: c.displayName,
                        }))
                      : [{ value: "undefined", label: "No Instructor" }]
                  }
                  value={
                    contributors
                      ? contributors
                          .filter((c) => field.value.includes(c.id))
                          .map((c) => ({
                            value: c.id,
                            label: c.displayName,
                          }))
                      : [{ value: "undefined", label: "No Instructor" }]
                  }
                  onChange={(selectedOptions) =>
                    field.onChange(
                      selectedOptions.map((option) => option.value)
                    )
                  }
                  placeholder="Select instructors"
                />
              )}
            />
          </div>
          <div className="p-5 rounded border">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col space-y-1.5 gap-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="visibility" className="font-bold">
                    Cover Image
                  </Label>
                  {cover ? (
                    <Button
                      size="xs"
                      variant="destructive"
                      onClick={() => {
                        setCover(null);
                        form.setValue("coverImage", "");
                      }}
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button size="xs" onClick={handleUploadImage}>
                      Upload
                    </Button>
                  )}
                </div>
                {!cover ? (
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
                ) : (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <Image
                      width={500}
                      height={300}
                      src={cover}
                      alt="Cover Preview"
                      className="object-cover w-full h-full rounded p-3"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
                      onClick={() => {
                        setCover(null);
                        form.setValue("coverImage", "");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch id="feature-course" {...field} />
                        <Label htmlFor="feature-course">
                          Feature the course
                        </Label>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Featured Courses will appear on the top
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="publishedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Publish Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon />
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent {...field} className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Visibility</FormLabel>
                    <FormControl>
                      <Select>
                        <SelectTrigger id="visibility">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {visibility?.map((item) => (
                            <SelectItem
                              key={item?.value}
                              {...field}
                              value={item?.value}
                            >
                              {item?.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Tags</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`knowledge, life, skills, etc`}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Separate tags with comma</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Topic</FormLabel>
                    <FormControl>
                      <Select>
                        <SelectTrigger id="topic">
                          <SelectValue placeholder="Select topic" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {topics?.map((item) => (
                            <SelectItem
                              key={item?.id}
                              {...field}
                              value={item?.id}
                            >
                              {item?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default NewCoursePage;
