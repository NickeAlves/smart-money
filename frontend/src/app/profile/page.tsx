"use client";

import Head from "next/head";
import "../../styles/globals.css";
import api from "../../integrations/java-api.js";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    lastName: "",
    dateOfBirth: "",
    profileUrl: "",
  });
  const [age, setAge] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading] = useState(false);
  const [error, setError] = useState("");
  const [success] = useState("");
  const [cacheBuster] = useState(Date.now());
  const router = useRouter();

  const calculateAge = (dateString: string) => {
    if (!dateString) return null;
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

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
        const calculatedAge = user.dateOfBirth
          ? calculateAge(user.dateOfBirth)
          : null;

        setUserData({
          id: user.id || "",
          name: user.name || "",
          lastName: user.lastName || "",
          dateOfBirth: user.dateOfBirth || "",
          profileUrl: user.profileUrl || "",
        });

        setAge(calculatedAge);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    router.push("/profile/update-profile");
  };

  const getImageUrl = () => {
    if (!userData.profileUrl) return "/default-profile.svg";

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

      <header className="p-4 flex justify-between items-center border-b border-gray-800">
        <button
          onClick={handleGoBack}
          className="p-2 hover:bg-[var(--color-button)] rounded-full"
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
        <h1 className="text-xl">My Profile</h1>
        <button
          onClick={handleNavigateHome}
          className="p-2 hover:bg-[var(--color-button)] rounded-full"
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

      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
        <div className="w-32 h-32 md:w-40 md:h-40 mb-6 rounded-full border-4 border-[var(--color-button)] overflow-hidden flex items-center justify-center relative">
          {userData.profileUrl ? (
            <>
              <img
                src={getImageUrl()}
                alt="Profile"
                className="w-full h-full object-cover"
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
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
                <path d="M256 73.825a182.175 182.175 0 1 0 182.18 182.18A182.177 182.177 0 0 0 256 73.825zm0 71.833a55.05 55.05 0 1 1-55.054 55.046A55.046 55.046 0 0 1 256 145.658zm.52 208.723h-80.852c0-54.255 29.522-73.573 48.885-90.906a65.68 65.68 0 0 0 62.885 0c19.363 17.333 48.885 36.651 48.885 90.906z" />
              </svg>
            </div>
          )}
        </div>

        <button
          onClick={handleEditProfile}
          className="mb-6 px-6 py-2 bg-[var(--color-button)] text-white rounded-lg hover:bg-[var(--color-button-hover)] transition-colors"
        >
          Edit Profile
        </button>

        <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg text-[var(--color-button)] font-bold text-center mb-4">
            Personal Information
          </h2>
          <div className="space-y-4">
            <div>
              <h1 className="text-sm text-gray-400">Name:</h1>
              <p className="text-lg">
                {userData.name} {userData.lastName}
              </p>
            </div>

            <div>
              <h1 className="text-sm text-gray-400">Age:</h1>
              <p className="text-lg">{age !== null ? age : "Not specified"}</p>
            </div>

            {userData.dateOfBirth && (
              <div>
                <h1 className="text-sm text-gray-400">Date of Birth:</h1>
                <p className="text-lg">
                  {new Date(userData.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-2 text-red-600 bg-red-100 rounded w-full text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-2 text-green-600 bg-green-100 rounded w-full text-center">
            {success}
          </div>
        )}
      </div>
    </>
  );
}
