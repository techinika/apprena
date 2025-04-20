import { useState } from "react";
import { collection, addDoc, serverTimestamp, doc } from "firebase/firestore";
import { db } from "@/db/firebase";
import { User } from "firebase/auth";

interface UploadOptions {
  file: File;
  user: User | null;
  institutionId?: string;
}

export const useImageUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async ({
    file,
    user,
    institutionId,
  }: UploadOptions): Promise<string | null> => {
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      const uploadsCollection = collection(db, "uploads");

      const uploaderRef = doc(db, "profile", String(user?.uid));
      const institutionRef = institutionId
        ? doc(db, "institutions", institutionId)
        : uploaderRef;

      await addDoc(uploadsCollection, {
        objectType: "image",
        uploader: uploaderRef,
        institutionAssociated: institutionRef,
        dateUploaded: serverTimestamp(),
        objectUrl: result?.url,
        originalName: file.name,
        size: file.size,
        contentType: file.type,
      });

      return result?.url;
    } catch (err) {
      console.error("Upload failed", err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage,
    uploading,
    error,
  };
};
