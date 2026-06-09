import type { Metadata } from "next";
import "./globals.css";
import { APP } from "@/variables/globals";
import { Nunito } from "next/font/google";
import { AuthProvider } from "@/lib/AuthContext";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { Toaster } from "sonner";
import dynamic from "next/dynamic";

const MentorChat = dynamic(() => import("@/components/parts/chat/MentorChat"), {
  ssr: false,
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://apprena.app";

export const metadata: Metadata = {
  title: {
    default: `${APP?.NAME} | ${APP?.SLOGAN}`,
    template: `%s | ${APP?.NAME}`,
  },
  description: APP?.DESCRIPTION,
  viewport: "width=device-width, initial-scale=1",
  keywords: [
    "AI Roadmap",
    "Career Path",
    "Learning Management",
    "Skill Tracking",
    "Professional Development",
    "Career Coaching",
    "AI Career Planner",
  ],
  authors: [{ name: APP?.OWNER || "Apprena" }],
  creator: APP?.NAME,
  publisher: APP?.NAME,
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: `${APP?.NAME} | ${APP?.SLOGAN}`,
    description: APP?.SHORT_DESCRIPTION,
    url: baseUrl,
    siteName: APP?.NAME,
    locale: "en_US",
    type: "website",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP?.NAME} | ${APP?.SLOGAN}`,
    description: APP?.SHORT_DESCRIPTION,
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const Font = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-main",
});

const IREMBOPAY_SCRIPT = process.env.NODE_ENV === "production"
  ? "https://dashboard.irembopay.com/assets/payment/inline.js"
  : "https://dashboard.sandbox.irembopay.com/assets/payment/inline.js";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo-short.png" />
        <link rel="preload" href={IREMBOPAY_SCRIPT} as="script" />
        <link rel="preconnect" href="https://*.googleapis.com" />
        <link rel="preconnect" href="https://*.firestore.googleapis.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
      </head>
      <body className={`${Font.variable} antialiased`}>
        <script
          src={IREMBOPAY_SCRIPT}
          async
          defer
          data-init={false}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: APP?.NAME,
              description: APP?.DESCRIPTION,
              url: baseUrl,
              applicationCategory: "Career & Education",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "RWF",
              },
              author: {
                "@type": "Organization",
                name: APP?.OWNER || "Apprena",
              },
            }),
          }}
        />
        <ThemeProvider>
          <AuthProvider>
            <Toaster position="top-center" expand={true} richColors />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
