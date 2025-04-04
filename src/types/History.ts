export interface History {
  id: string;
  title: string;
  cover: string;
  description?: string;
  occuringDate?: string;
  likes: {
    userId: string;
    date: string;
  }[];
  shares: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
