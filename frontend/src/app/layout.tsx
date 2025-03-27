import type { Metadata } from "next";
import "./../styles/globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Smart Money",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="rounded-logo.png" />
      </head>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
