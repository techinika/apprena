export type Faqs = {
  id: string;
  title: string;
  description: string;
  status: "draft" | "published" | "deleted";
  availability: "public" | "private";
  createdAt: string;
};

export type Plans = {
  id: string;
  name: string;
  description: string;
  status: "draft" | "published" | "deleted";
  availability: "public" | "private";
  price: number;
  features: string[];
  perks: string;
};
