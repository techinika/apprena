import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

export const getTransactionHistory = async (
  userId: string,
  pageSize: number = 5,
  lastVisible: QueryDocumentSnapshot<DocumentData> | null = null
) => {
  const txRef = collection(db, "transactions");

  let q = query(
    txRef,
    where("userId", "==", userId),
    orderBy("timestamp", "desc"),
    limit(pageSize)
  );

  if (lastVisible) {
    q = query(q, startAfter(lastVisible));
  }

  const snapshot = await getDocs(q);
  const transactions = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    transactions,
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
    hasMore: snapshot.docs.length === pageSize,
  };
};
