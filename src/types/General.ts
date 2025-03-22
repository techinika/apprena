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
  features: Feature[];
  perks: string;
  createdAt: string;
};

export type Feature = {
  id: string;
  label: string;
  name: string;
  permissions: Permission[];
  createdAt: string;
};

export type Permission = {
  id: string;
  name: string;
  createdAt: string;
};
