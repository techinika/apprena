import type { Metadata } from "next";
import "./globals.css";
import { APP } from "@/variables/globals";
import { Nunito } from "next/font/google";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  title: `${APP?.NAME} — ${APP?.SLOGAN}`,
  description: APP?.DESCRIPTION,
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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
