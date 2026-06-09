import { adminAuth } from "./firebaseAdmin";

export async function verifyAuth(request: Request): Promise<{ uid: string }> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized: missing or invalid Authorization header");
  }
  const token = authHeader.split("Bearer ")[1];
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return { uid: decoded.uid };
  } catch {
    throw new Error("Unauthorized: invalid or expired token");
  }
}
