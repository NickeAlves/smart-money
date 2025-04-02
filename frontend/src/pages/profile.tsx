"use client";

import Head from "next/head";
import "./../styles/globals.css";
import api from "./../utils/java-api.js";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    lastName: "",
    email: "",
    age: "",
    profileUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [cacheBuster] = useState(Date.now());

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await api.getCurrentUser();
        setUserData({
          id: user.id || "",
          name: user.name || "",
          lastName: user.lastName || "",
          email: user.email || "",
          age: user.age || "",
          profileUrl: user.profileUrl || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getImageUrl = () => {
    if (!userData.profileUrl) return "/default-profile.svg";

    return `http://localhost:8080${userData.profileUrl}${
      userData.profileUrl.includes("?") ? "&" : "?"
    }v=${cacheBuster}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Profile | Smart Money</title>
        <meta name="description" content="Profile Smart Money account" />
        <link rel="icon" href="/rounded-logo.png" />
      </Head>
      <div className="flex flex-row items-baseline gap-4 p-4">
        <div className="">
          <button>
            <div
              className="flex rounded-full hover:scale-110 transition-transform"
              typeof="button"
              onClick={() => router.back()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6 text-[var-(--slate)]"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </div>
          </button>
        </div>
        <div className="flex flex-row">
          <button>
            <div
              className="flex rounded-full pr-4 pl-4 hover:scale-110 transition-transform"
              typeof="button"
              onClick={() => router.replace("/")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6 text-[var-(--slate)]"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>

      <div className="pt-12 flex flex-col gap-6 justify-center items-center">
        <div className="w-full  max-w-2xl rounded-xl border p-6 shadow-lg shadow-black bg-[var(--card)]">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 md:w-40 md:h-40 mb-6 flex items-center justify-center relative shadow-xl shadow-black rounded-full">
              <img
                src={getImageUrl()}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
                crossOrigin="anonymous"
                onError={(e) => {
                  console.error("Image error:", e);
                  e.currentTarget.src = "/default-profile.svg";
                }}
              />
            </div>

            <div className="flex items-baseline gap-6">
              <button
                className="text-gray-900 bg-[var(--slate)] font-bold rounded-2xl text-center p-2 pr-4 pl-4 shadow-sm shadow-black hover:scale-110 transition-transform"
                onClick={() => router.push("/update-profile")}
              >
                Edit profile
              </button>
            </div>

            <div className="w-full space-y-4 mt-6">
              <div className="flex flex-col">
                <span className="text-sm text-slate-200">Name</span>
                <p className="font-medium text-slate-100">
                  {userData.name} {userData.lastName}
                </p>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-slate-200">Email</span>
                <p className="font-medium text-slate-100">{userData.email}</p>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-slate-200">Age</span>
                <p className="font-medium text-slate-100">{userData.age}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
