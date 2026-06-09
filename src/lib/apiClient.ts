import { auth } from "@/db/firebase";

async function getAuthToken(): Promise<string | null> {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  } catch {
    return null;
  }
}

interface ApiOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiFetch(url: string, options: ApiOptions = {}): Promise<Response> {
  const { skipAuth, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);

  if (!headers.has("Content-Type") && fetchOptions.body) {
    headers.set("Content-Type", "application/json");
  }

  if (!skipAuth) {
    const token = await getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return fetch(url, { ...fetchOptions, headers });
}
