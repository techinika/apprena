import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    accountIdentifier,
    paymentProvider,
    invoiceNumber,
    transactionReference,
  } = req.body;

  if (!accountIdentifier || !paymentProvider || !invoiceNumber) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PAYMENT_BASE_URL}/transactions/initiate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "irembopay-secretKey": process.env
            .NEXT_PUBLIC_PAYMENT_SECRET_KEY as string,
          "X-API-Version": "2",
        },
        body: JSON.stringify({
          accountIdentifier,
          paymentProvider,
          invoiceNumber,
          transactionReference,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error("Error initiating payment:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
