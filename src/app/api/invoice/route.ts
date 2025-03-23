/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PAYMENT_BASE_URL}/invoices`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "irembopay-secretkey": `${process.env.NEXT_PUBLIC_PAYMENT_SECRET_KEY}`,
          "X-API-Version": "2",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    console.log(data);

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error: any) {
    console.log(error);
  }
}
