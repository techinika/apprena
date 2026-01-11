/* eslint-disable @typescript-eslint/no-explicit-any */
export const formatDate = (timestamp: any) => {
  if (!timestamp) return "---";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};
