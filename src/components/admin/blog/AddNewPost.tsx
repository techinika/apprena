"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import Editor from "./Editor";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { CalendarIcon, Paperclip } from "lucide-react";
import { Calendar } from "../../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import PageHeader from "../main/PageHeader";
import { Textarea } from "@/components/ui/textarea";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-uploader";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/AuthContext";
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
import { toast } from "sonner";
import { db } from "@/db/firebase";
import { Topic } from "@/types/Discussion";
import { User } from "@/types/Users";
import Loading from "@/app/loading";

export const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        SVG, PNG, JPG or GIF
      </p>
    </>
  );
};

const formSchema = z.object({
  title: z.string(),
  content: z.string(),
  photoURL: z.string(),
  isFeatured: z.string(),
  publishedAt: z.string(),
  visibility: z.string(),
  status: z.string(),
  writtenBy: z.string(),
  summary: z.string().max(200).min(4),
  tags: z.string(),
  category: z.string(),
  institutionOwning: z.string(),
});

type formValues = z.infer<typeof formSchema>;

const AddNewPost = ({ institutionId }: { institutionId: string }) => {
  const { user } = useAuth();
  const [date, setDate] = React.useState<Date>();
  const [files, setFiles] = useState<File[] | null>(null);
  const articleCollection = collection(db, "articles");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [contributors, setContributors] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

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

        // Fetch topics owned by the institution
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

        // Fetch users with valid roles
        const usersQuery = query(
          collection(db, "profile"),
          where("role", "in", ["admin", "super_admin", "contributor"])
        );
        const usersSnapshot = await getDocs(usersQuery);
        const allUsers = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];

        // Filter users who are in the adminRefs array
        const contributorData = allUsers.filter((user) =>
          adminRefs.some((adminRef) => adminRef.id === user.id)
        );
        setContributors(contributorData);
      } catch (error) {
        console.error("Error fetching institution data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
  };

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      photoURL: "",
      isFeatured: "false",
      publishedAt: "",
      visibility: "private",
      status: "draft",
      summary: "",
      tags: "",
      category: "",
      institutionOwning: institutionId,
      writtenBy: user?.uid,
    },
    mode: "onChange",
  });

  const processArticleCreation = async (data: formValues) => {
    try {
      const photoURL =
        "https://media.licdn.com/dms/image/v2/D5612AQFGrpxALY6I6g/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1677692208884?e=2147483647&v=beta&t=R8FVCwF2m3MIPmp1J0tLOxhAyPdsw-_Bhs7dIhwahYE";

      const slug = data?.title
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "-")
        .trim();

      await setDoc(doc(articleCollection, slug), {
        title: data?.title,
        content: data?.content || "",
        photoURL: photoURL || "/placeholder.jpg",
        isFeatured: data?.isFeatured || false,
        publishedAt: data?.publishedAt || "",
        visibility: data?.visibility || "private",
        writtenBy: data?.writtenBy || user?.uid,
        summary: data?.summary || "",
        tags: data?.tags || "",
        category: data?.category || "",
        institutionOwning: institutionId || data?.institutionOwning,
        status: data?.status === "draft" ? "draft" : "published",
        createdAt: new Date().toISOString(),
      });
      toast("Article created successfully");
      form.reset();
    } catch (error) {
      console.error("Error processing article creation:", error);
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
      visibility: "draft",
      publishedAt: "",
    };

    processArticleCreation(newData);
  };

  const handlePublish = (data: formValues) => {
    const newData = {
      ...data,
      visibility: "published",
      publishedAt: new Date().toISOString(),
    };

    processArticleCreation(newData);
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-4 p-8 pt-6">
      <PageHeader
        title="Add New Post"
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
                  <FormControl>
                    <Input
                      placeholder="This is the title of the post"
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
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
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
                  <Button size="xs">Upload</Button>
                </div>
                <FileUploader
                  value={files}
                  onValueChange={setFiles}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-background rounded-lg p-2"
                >
                  <FileInput className="outline-dashed outline-1 outline-white">
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
                name="isFeatured"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch id="feature-article" {...field} />
                        <Label htmlFor="feature-article">
                          Feature the article
                        </Label>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Featured Article will appear on the top
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
                name="visibility"
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
                name="writtenBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Author</FormLabel>
                    <FormControl>
                      <Select>
                        <SelectTrigger id="visibility">
                          <SelectValue placeholder="Select author" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {contributors?.map((item) => (
                            <SelectItem
                              {...field}
                              key={item?.id}
                              value={item?.id}
                            >
                              {item?.displayName}
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
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`Summary of the article`}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Not more than 200 characters
                    </FormDescription>
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Category</FormLabel>
                    <FormControl>
                      <Select>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
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
};

export default AddNewPost;
