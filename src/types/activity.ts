export interface Activity {
  id: string;
  title: string;
  category: string;
  status: "todo" | "in-progress" | "completed";
  priority: number;
  userId: string;
  createdAt: string;
}
