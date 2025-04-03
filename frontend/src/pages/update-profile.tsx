"use client";

import Head from "next/head";
import "./../styles/globals.css";
import api from "./../utils/java-api.js";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UpdateProfile() {
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
  const router = useRouter();

  const handleNavigateHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

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

  const handleCancel = () => {
    if (userData.profileUrl.startsWith("blob:")) {
      URL.revokeObjectURL(userData.profileUrl);
    }
    setUserData((prev) => ({
      ...prev,
    }));

    if (fileInputRef.current) fileInputRef.current.value = "";
    router.back();
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
        <title>Update Profile | Smart Money</title>
        <meta name="description" content="Profile Smart Money account" />
        <link rel="icon" href="/rounded-logo.png" />
      </Head>

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
        <h1 className="text-xl font-semibold">Update Profile</h1>
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

      <div className="flex flex-col justify-center items-center min-h-[80vh] bg-gray-900 text-white gap-2 p-2">
        <div className="w-40 h-40 flex items-center justify-center relative rounded-full border-2 border-[var(--color-button)] overflow-hidden">
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

        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className={`block w-64 mb-6 text-xs border rounded-lg cursor-pointer bg-[var(--color-button)] focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${
            uploading
              ? "text-gray-400 border-gray-200 file:bg-gray-200"
              : "text-gray-900 border-gray-300 file:bg-gray-100 hover:file:bg-gray-200"
          }`}
          disabled={uploading}
        />

        <div>
          <label className="block text-sm text-gray-300 mb-1">First Name</label>
          <input
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Last Name</label>
          <input
            value={userData.lastName}
            onChange={(e) =>
              setUserData({ ...userData, lastName: e.target.value })
            }
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Age</label>
          <input
            value={userData.age}
            onChange={(e) => setUserData({ ...userData, age: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleCancel}
            className="px-6 py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
