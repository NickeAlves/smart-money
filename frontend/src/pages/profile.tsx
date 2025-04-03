"use client";

import Head from "next/head";
import "./../styles/globals.css";
import api from "./../utils/java-api.js";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  id: string;
  name: string;
  lastName: string;
  email: string;
  age: string;
  profileUrl: string;
}

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>({
    id: "",
    name: "",
    lastName: "",
    email: "",
    age: "",
    profileUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [imageVersion, setImageVersion] = useState(0);

  const getSafeProfileUrl = (url: string | undefined): string => {
    if (!url) return "/default-profile.svg";
    if (url.startsWith("http"))
      return url.includes("?") ? url : `${url}?v=${Date.now()}`;
    return `http://localhost:8080${
      url.startsWith("/") ? "" : "/"
    }${url}?v=${Date.now()}`;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const user = await api.getCurrentUser();

        setUserData({
          id: user?.id || "",
          name: user?.name || "",
          lastName: user?.lastName || "",
          email: user?.email || "",
          age: user?.age || "",
          profileUrl: getSafeProfileUrl(user?.profileUrl),
        });

        setImageVersion((prev) => prev + 1);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData((prev) => ({
          ...prev,
          profileUrl: "/default-profile.svg",
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleEditProfile = () => {
    router.push("/update-profile");
  };

  const handleNavigateHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <p className="text-white">Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Profile | Smart Money</title>
        <meta name="description" content="Your Smart Money profile" />
        <link rel="icon" href="/rounded-logo.png" />
      </Head>

      <div className="min-h-screen bg-gray-900 text-white">
        <header className="p-4 flex justify-between items-center border-b border-gray-800">
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-gray-800 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </button>
          <h1 className="text-xl font-semibold">My Profile</h1>
          <button
            onClick={handleNavigateHome}
            className="p-2 hover:bg-gray-800 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </button>
        </header>

        <main className="p-6 flex flex-col items-center">
          <div className="w-32 h-32 md:w-40 md:h-40 mb-6 rounded-full border-4 border-[var(--color-button)] overflow-hidden">
            <img
              key={`profile-img-${imageVersion}`}
              src={userData.profileUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/default-profile.svg";
              }}
            />
          </div>

          <button
            onClick={handleEditProfile}
            className="mb-8 px-6 py-2 bg-[var(--color-button)] text-white rounded-lg hover:bg-[var(--color-button-hover)] transition-colors"
          >
            Edit Profile
          </button>

          <div className="w-full max-w-md space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="flex justify-center text-lg text-[var(--color-button)] font-bold mb-4">
                Personal Information
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="text-lg">
                    {userData.name} {userData.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-lg">{userData.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Age</p>
                  <p className="text-lg">{userData.age || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
