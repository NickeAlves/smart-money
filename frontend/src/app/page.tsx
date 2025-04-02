"use client";
import Header from "@/components/Header";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export default function Home() {
  return (
    <>
      <main className="pt-20 min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Header />
          <ScrollToTopButton />
        </div>
      </main>
    </>
  );
}
