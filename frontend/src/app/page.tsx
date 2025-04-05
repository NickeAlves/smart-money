"use client";
import Header from "@/components/Header";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export default function Home() {
  return (
    <>
      <header className="">
        <Header />
        <ScrollToTopButton />
      </header>
      <main className="flex justify-center bg-gray-900 pt-24 pr-12 pl-12">
        <div className="container bg-[var(--slate)] rounded-2xl p-12"></div>
      </main>
      <footer></footer>
    </>
  );
}
