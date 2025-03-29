import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";

import ScrollToTopButton from "@/components/ScrollToTopButton";
import "./../styles/globals.css";

export const metadata: Metadata = {
  title: "Smart Money",
  description: "Sistema financeiro inteligente",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/rounded-logo.png" />
      </head>
      <body className="bg-gray-900 text-white">
        <AuthProvider>{children}</AuthProvider>
        <ScrollToTopButton />
      </body>
    </html>
  );
}
