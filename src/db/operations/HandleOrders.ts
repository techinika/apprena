import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export const createOrGetOrder = async (
  userId: string,
  planId: string,
  amount: number
) => {
  const ordersRef = collection(db, "orders");
  const q = query(
    ordersRef,
    where("userId", "==", userId),
    where("planId", "==", planId),
    where("status", "==", "pending")
  );

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].id;
  }

  const newOrder = await addDoc(ordersRef, {
    userId,
    planId,
    amount,
    currency: "RWF",
    status: "pending",
    createdAt: serverTimestamp(),
    invoiceNumber: `INV-${Date.now()}`,
  });

  return newOrder.id;
};
