export type InvoiceData = {
  amount: number;
  invoiceNumber: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
  expiryAt: string;
  description: string;
  paymentLinkUrl: string;
  type: "SINGLE" | "RECURRING"; 
  paymentStatus: "NEW" | "PENDING" | "COMPLETED" | "FAILED"; 
  currency: "USD" | "RWF" | "EUR"; 
  customer: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  createdBy: "SYSTEM" | string;
  paymentAccountIdentifier: string;
  paymentItems: PaymentItem[];
};
