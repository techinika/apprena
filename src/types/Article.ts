export type Article = {
  id: string;
  title: string;
  status: "draft" | "published" | "deleted";
  availability: "public" | "private";
  author: string;
  body: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
};
