import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Apprena";
    const description =
      searchParams.get("description") ||
      "AI-Powered Career Roadmaps — Transform your ambitions into actionable learning paths.";

    const image = new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0f172a",
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(217,119,6,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(217,119,6,0.1) 0%, transparent 50%)",
            fontFamily: "Nunito, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
            <span
              style={{
                fontSize: "32px",
                fontWeight: 900,
                color: "#f5f5f5",
                letterSpacing: "-0.02em",
              }}
            >
              Apprena
            </span>
          </div>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 900,
              color: "#f5f5f5",
              textAlign: "center",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              maxWidth: "80%",
              margin: "0 0 16px",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "24px",
              color: "#a1a1aa",
              textAlign: "center",
              maxWidth: "65%",
              lineHeight: 1.4,
            }}
          >
            {description}
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );

    const headers = new Headers(image.headers);
    headers.set(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=604800"
    );

    return new Response(image.body, {
      status: image.status,
      statusText: image.statusText,
      headers,
    });
  } catch (e) {
    console.error("OG image error:", e);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
