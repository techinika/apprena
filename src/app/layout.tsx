import type { Metadata } from "next";
import "./globals.css";
import { APP } from "@/variables/globals";
import { AuthProvider } from "@/lib/AuthContext";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: `${APP?.NAME} — ${APP?.SLOGAN}`,
  description: APP?.DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <AuthProvider>
          {children}
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
