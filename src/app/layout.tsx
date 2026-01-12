import type { Metadata } from "next";
import "./globals.css";
import { APP } from "@/variables/globals";
import { Nunito } from "next/font/google";
import { AuthProvider } from "@/lib/AuthContext";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: `${APP?.NAME} | ${APP?.SLOGAN}`,
  description: `${APP?.DESCRIPTION}`,
  keywords: [
    "AI Roadmap",
    "Career Path",
    "Learning Management",
    "Skill Tracking",
    "Professional Development",
  ],
  openGraph: {
    title: `${APP?.NAME} | ${APP?.SLOGAN}`,
    description: `${APP?.SHORT_DESCRIPTION}`,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    siteName: `${APP?.NAME}`,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP?.NAME} | ${APP?.SLOGAN}`,
    description: `${APP?.SHORT_DESCRIPTION}`,
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
        <AuthProvider>
          <Toaster position="top-center" expand={true} richColors />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
