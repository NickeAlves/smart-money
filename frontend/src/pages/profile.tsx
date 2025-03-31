"use client";

import Head from "next/head";
import Header from "@/components/Header";
import "./../styles/globals.css";
import api from "./../utils/java-api.js";
import { useState, useEffect, useRef } from "react";

export default function Profile() {
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    lastName: "",
    email: "",
    age: "",
    profileUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cacheBuster, setCacheBuster] = useState(Date.now());

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
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !userData.id) return;

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const previewUrl = URL.createObjectURL(file);
      setUserData((prev) => ({ ...prev, profileUrl: previewUrl }));

      const result = await api.uploadProfilePicture(userData.id, file);

      if (!result?.success) {
        throw new Error(result?.message || "Upload failed");
      }

      const newCacheBuster = Date.now();
      setCacheBuster(newCacheBuster);

      const newProfileUrl = result.data?.profileUrl
        ? `${result.data.profileUrl}?v=${newCacheBuster}`
        : "";

      setUserData((prev) => ({
        ...prev,
        profileUrl: newProfileUrl,
      }));

      setSuccess("Profile picture updated successfully!");

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Upload error:", error);
      setError(error instanceof Error ? error.message : "Upload failed");

      const user = await api.getCurrentUser();
      setUserData((prev) => ({
        ...prev,
        profileUrl: user.profileUrl || "",
      }));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const getImageUrl = () => {
    if (!userData.profileUrl) return "";

    if (userData.profileUrl.startsWith("blob:")) {
      return userData.profileUrl;
    }

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
      <Header />
      <div className="min-h-screen bg-gray-900 flex flex-col lg:flex-row gap-6 justify-center items-center px-4 py-8">
        <div className="w-full lg:w-2/3 max-w-2xl rounded-xl border border-white bg-white/80 p-6 shadow-lg shadow-black">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 md:w-40 md:h-40 mb-6 flex items-center justify-center relative">
              {userData.profileUrl ? (
                <>
                  <img
                    src={getImageUrl()}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      console.error("Image error:", e);
                      e.currentTarget.src = "/default-profile.svg";
                    }}
                    onLoad={() => {
                      if (userData.profileUrl.startsWith("blob:")) {
                        URL.revokeObjectURL(userData.profileUrl);
                      }
                    }}
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="w-3/4 h-3/4 fill-gray-600"
                  >
                    <path
                      d="M256 73.825a182.175 182.175 0 1 0 182.18 182.18A182.177 182.177 0 0 0 256 73.825zm0 71.833a55.05 55.05 0 1 1-55.054 55.046A55.046 55.046 0 0 1 256 145.658zm.52 208.723h-80.852c0-54.255 29.522-73.573 48.885-90.906a65.68 65.68 0 0 0 62.885 0c19.363 17.333 48.885 36.651 48.885 90.906z"
                      data-name="Profile"
                    />
                  </svg>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 p-2 text-red-600 text-sm bg-red-100 rounded w-full text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-2 text-green-600 text-sm bg-green-100 rounded w-full text-center">
                {success}
              </div>
            )}

            <label
              htmlFor="profile-upload"
              className={`block mb-4 text-sm font-medium ${
                uploading
                  ? "text-gray-400"
                  : "text-gray-900 hover:text-blue-600"
              } cursor-pointer transition-colors`}
            >
              {uploading ? "Uploading..." : "Upload Profile Picture"}
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className={`block w-64 mb-6 text-xs border rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${
                uploading
                  ? "text-gray-400 border-gray-200 file:bg-gray-200"
                  : "text-gray-900 border-gray-300 file:bg-gray-100 hover:file:bg-gray-200"
              }`}
              disabled={uploading}
            />

            <div className="w-full space-y-4">
              <div className="flex flex-row gap-4 items-baseline">
                <h1 className="font-extrabold text-black text-lg min-w-[80px]">
                  Name:
                </h1>
                <p className="font-bold text-gray-600">
                  {userData.name} {userData.lastName}
                </p>
              </div>

              <div className="flex flex-row gap-4 items-baseline">
                <h1 className="font-extrabold text-black text-lg min-w-[80px]">
                  Email:
                </h1>
                <p className="font-bold text-gray-600">{userData.email}</p>
              </div>

              <div className="flex flex-row gap-4 items-baseline">
                <h1 className="font-extrabold text-black text-lg min-w-[80px]">
                  Age:
                </h1>
                <p className="font-bold text-gray-600">{userData.age}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3 max-w-md rounded-xl border border-white bg-white/80 p-6 shadow-lg shadow-black">
          <h1 className="font-extrabold text-gray-900 text-2xl mb-4">
            Your Statistics
          </h1>
          <div className="text-gray-600">
            <div className="mb-4">
              <h2 className="font-bold text-lg">Account Summary</h2>
              <p className="text-sm">Coming soon...</p>
            </div>
            <div className="mb-4">
              <h2 className="font-bold text-lg">Recent Activity</h2>
              <p className="text-sm">Feature in development</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
