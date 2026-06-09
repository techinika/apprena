const IREMBOPAY_BASE_URL = process.env.NODE_ENV === "production" 
  ? "https://api.irembopay.com" 
  : "https://api.sandbox.irembopay.com";

const IREMBOPAY_SECRET_KEY = process.env.IREMBOPAY_SECRET_KEY;
const IREMBOPAY_PUBLIC_KEY = process.env.NEXT_PUBLIC_IREMBOPAY_PUBLIC_KEY;
const PAYMENT_ACCOUNT_IDENTIFIER = process.env.IREMBOPAY_PAYMENT_ACCOUNT || "APPRENA-RWF";

interface CreateInvoiceParams {
  transactionId: string;
  amount: number;
  currency?: string;
  description?: string;
  customer?: {
    email?: string;
    phoneNumber?: string;
    name?: string;
  };
  expiryDays?: number;
}

interface InvoiceResult {
  invoiceNumber: string;
  transactionId: string;
  paymentStatus: string;
  amount: number;
  currency: string;
  paymentLinkUrl: string;
}

export async function createInvoice(params: CreateInvoiceParams): Promise<InvoiceResult> {
  if (!IREMBOPAY_SECRET_KEY) {
    throw new Error("IREMBOPAY_SECRET_KEY not configured");
  }

  const expiryAt = params.expiryDays 
    ? new Date(Date.now() + params.expiryDays * 24 * 60 * 60 * 1000).toISOString()
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const requestBody = {
    transactionId: params.transactionId,
    paymentItems: [
      {
        code: "ORG-SUB",
        quantity: 1,
        unitAmount: params.amount,
      },
    ],
    paymentAccountIdentifier: PAYMENT_ACCOUNT_IDENTIFIER,
    description: params.description,
    customer: params.customer,
    expiryAt,
    language: "EN",
  };

  const response = await fetch(`${IREMBOPAY_BASE_URL}/payments/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "irembopay-secretkey": IREMBOPAY_SECRET_KEY,
      "X-API-Version": "2",
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    console.error("IremboPay API Error:", {
      status: response.status,
      body: data,
      request: requestBody,
    });
    throw new Error(data.message || data.errors?.[0]?.detail || data.errors?.[0]?.code || "Failed to create invoice");
  }

  return {
    invoiceNumber: data.data.invoiceNumber,
    transactionId: data.data.transactionId,
    paymentStatus: data.data.paymentStatus,
    amount: data.data.amount,
    currency: data.data.currency,
    paymentLinkUrl: data.data.paymentLinkUrl,
  };
}

export async function getInvoice(invoiceNumber: string): Promise<InvoiceResult> {
  if (!IREMBOPAY_SECRET_KEY) {
    throw new Error("IREMBOPAY_SECRET_KEY not configured");
  }

  const response = await fetch(`${IREMBOPAY_BASE_URL}/payments/invoices/${invoiceNumber}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "irembopay-secretkey": IREMBOPAY_SECRET_KEY,
      "X-API-Version": "2",
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to get invoice");
  }

  return {
    invoiceNumber: data.data.invoiceNumber,
    transactionId: data.data.transactionId,
    paymentStatus: data.data.paymentStatus,
    amount: data.data.amount,
    currency: data.data.currency,
    paymentLinkUrl: data.data.paymentLinkUrl,
  };
}

export function getPublicKey(): string {
  return IREMBOPAY_PUBLIC_KEY || "";
}

export function isPaymentConfigured(): boolean {
  return !!IREMBOPAY_SECRET_KEY && !!IREMBOPAY_PUBLIC_KEY;
}
