"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";

function ConfirmPayment({
  action,
  open,
  cancel,
}: {
  action: () => void;
  cancel: () => void;
  open: boolean;
}) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Proceed to Payment</AlertDialogTitle>
          <AlertDialogDescription>
            The invoice has been generated, and your profile has been created.
            You can pay now, or login later and pay from your dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancel}>Pay Later</AlertDialogCancel>
          <AlertDialogAction onClick={action}>Pay Now</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmPayment;
