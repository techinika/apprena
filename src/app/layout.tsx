import type { Metadata } from "next";
import "./globals.css";
import { APP } from "@/variables/globals";
import { Nunito } from "next/font/google";
import { AuthProvider } from "@/lib/AuthContext";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: `${APP?.NAME} | ${APP?.SLOGAN}`,
    template: `%s | ${APP?.NAME}`,
  },
  description: APP?.DESCRIPTION,
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://apprena.app"),
  openGraph: {
    title: `${APP?.NAME} | ${APP?.SLOGAN}`,
    description: APP?.SHORT_DESCRIPTION,
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://apprena.app",
    siteName: APP?.NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP?.NAME} | ${APP?.SLOGAN}`,
    description: APP?.SHORT_DESCRIPTION,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${Font.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: APP?.NAME,
              description: APP?.DESCRIPTION,
              url: process.env.NEXT_PUBLIC_BASE_URL || "https://apprena.app",
              applicationCategory: "Career & Education",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Organization",
                name: APP?.OWNER || "Apprena",
              },
            }),
          }}
        />
        <AuthProvider>
          <Toaster position="top-center" expand={true} richColors />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
