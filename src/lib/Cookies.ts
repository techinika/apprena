"use server";

import { Institution } from "@/types/Institution";
import { cookies } from "next/headers";

export const setCookies = async ({
  institution,
}: {
  institution: Institution | undefined;
}) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "values",
    value: JSON.stringify({
      activeInstitution: institution,
    }),
    secure: true,
    httpOnly: true,
  });
};

export const getCookies = async () => {
  const cookieStore = await cookies();
  const cookieData = cookieStore.get("values");

  if (!cookieData) return null;

  try {
    return JSON.parse(cookieData.value);
  } catch (error) {
    console.error("Error parsing cookies:", error);
    return null;
  }
};
