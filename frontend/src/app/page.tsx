"use client";

import Header from "@/components/Header";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import api from "@/integrations/java-api.js";
import { useEffect, useState } from "react";

export default function Home() {
  const [userData, setUserData] = useState({
    id: "",
    name: "",
  });

  const [, setLoading] = useState(true);
  const [, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await api.getCurrentUser();
        setUserData({
          id: user.id || "",
          name: user.name || "",
        });
      } catch (error) {
        console.error("Error fetching user data: ", error);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    <>
      <header className="">
        <Header />
        <ScrollToTopButton />
      </header>
      <main className="flex flex-col justify-center items-center bg-gray-900 pt-32 pr-12 pl-12">
        <h1 className="text-2xl font-extralight p-4">
          Hello,{" "}
          <strong className="bg-[var(--color-button)] rounded-lg pr-2 pl-2">
            {userData.name}
          </strong>
          !
        </h1>
        <div className="container bg-[var(--slate)] rounded-2xl p-2"></div>
      </main>
      <footer></footer>
    </>
  );
}
