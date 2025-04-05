"use client";

import AuthNav from "@/components/client/navigation/AuthNav";
import Nav from "@/components/client/navigation/Nav";
import FooterSection from "@/components/sections/footer/default";
import { useAuth } from "@/lib/AuthContext";
import React, { useEffect, useState } from "react";
import { Sidebar } from "./sidebar";
import { collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import { db } from "@/db/firebase";
import { Topic } from "@/types/Discussion";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cn, generateSlug } from "@/lib/utils";
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
import { Input } from "@/components/ui/input";
import Editor from "@/components/admin/blog/Editor";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { redirect } from "next/navigation";

const formSchema = z.object({
  title: z.string(),
  description: z.string().max(160).min(4),
  content: z.string(),
  tags: z.string(),
  topic: z.string(),
});

type formValues = z.infer<typeof formSchema>;

function NewDiscussion() {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const discussionCollection = collection(db, "discussions");
  const topicCollection = collection(db, "topics");
  const userRef = doc(db, "profile", String(user?.uid));

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      tags: "",
      topic: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const getData = async () => {
      const q = query(topicCollection);
      onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            ...docData,
          } as Topic;
        });
        setTopics(data);
      });
    };
    getData();
  }, [topicCollection]);

  async function onSubmit() {
    const data = form.getValues();
    console.log(data);

    setLoading(true);
    const { title, description, tags, topic, content } = data;
    const topicRef = doc(db, "topics", String(topic));
    if (!title || !description) {
      alert("Name and Description need to be added!");
      setLoading(false);
      return;
    }
    const slug = generateSlug(title);
    try {
      await setDoc(doc(discussionCollection, slug), {
        title,
        description,
        content,
        tags,
        topic: topicRef,
        views: [],
        replyCount: 0,
        upvotes: [],
        status: "pending_approval",
        createdBy: userRef,
        createdAt: new Date(),
      });
      toast(
        "Discussion submitted for approval! You will received an email with the status of your request!"
      );
      form.reset();
      redirect("/discussions");
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      {user ? <AuthNav /> : <Nav />}
      <div className="size">
        <div className="grid lg:grid-cols-5">
          <Sidebar topics={topics} className="hidden lg:block" />
          <div className="col-span-3 lg:col-span-4 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8">
              <div className="space-between flex items-center">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      New Discussion
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {`Please fill in all the details for your discussion, question or need.`}
                    </p>
                  </div>
                </div>
                <div className="ml-auto">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      onSubmit();
                    }}
                    className={`flex gap-2`}
                  >
                    Submit Discussion
                  </Button>
                </div>
              </div>
              <Form {...form}>
                <form className="space-y-3 mt-3">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">
                          Discussion Title
                        </FormLabel>
                        <FormControl>
                          <Input placeholder={`e.g, Technology`} {...field} />
                        </FormControl>
                        <FormDescription>
                          Please explain your question as if you are asking
                          someone else.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">
                          Discussion Summary
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g. My question is about learning to write programs."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Summarize what you want to discuss about.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">
                          Discussion Details
                        </FormLabel>
                        <FormControl>
                          <Editor field={field} />
                        </FormControl>
                        <FormDescription>
                          Please explain in details and share all the details
                          that will provide a better understanding of your
                          question.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">
                          Discussion Topic
                        </FormLabel>
                        <FormControl>
                          <div className="w-full">
                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={open}
                                  className="w-full justify-between"
                                >
                                  {form.getValues("topic")
                                    ? topics.find(
                                        (item) =>
                                          item?.id === form.getValues("topic")
                                      )?.name
                                    : "Select framework..."}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search topic..." />
                                  <CommandList>
                                    <CommandEmpty>No topic found.</CommandEmpty>
                                    <CommandGroup>
                                      {topics.map((item) => (
                                        <CommandItem
                                          key={item?.id}
                                          value={item?.id}
                                          onSelect={(currentValue) => {
                                            field.onChange(currentValue);
                                            setOpen(false);
                                          }}
                                        >
                                          {item?.name}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              form.getValues("topic") ===
                                                item?.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Choose the main topic/category of your discussion.
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
                        <FormLabel className="font-bold">
                          Discussion Tags
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`e.g, Technology, HTML, CSS, Irembo Services, etc`}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Separate tags using a comma.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}

export default NewDiscussion;
