"use client";

import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import api from "../utils/java-api.js";
import { useRouter } from "next/navigation";
import "./../styles/globals.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface UserData {
  id: string;
  name: string;
  lastName: string;
  dateOfBirth: Date | null;
  profileUrl: string;
}

export default function UpdateProfile() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>({
    id: "",
    name: "",
    lastName: "",
    dateOfBirth: null,
    profileUrl: "",
  });
  const [originalUserData, setOriginalUserData] = useState<
    Omit<UserData, "id" | "name" | "lastName">
  >({
    profileUrl: "",
    dateOfBirth: null,
  });
  const [success, setSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDateEditable, setIsDateEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getImageUrl = (url: string): string => {
    if (!url) return "/default-profile.svg";
    if (url.startsWith("blob:")) return url;
    return url.includes("?") ? url : `${url}?ts=${Date.now()}`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const user = await api.getCurrentUser();
        const fetchedDateOfBirth = user?.dateOfBirth
          ? new Date(user.dateOfBirth)
          : null;

        setUserData({
          id: user?.id || "",
          name: user?.name || "",
          lastName: user?.lastName || "",
          dateOfBirth: fetchedDateOfBirth,
          profileUrl: user?.profileUrl
            ? `http://localhost:8080${user.profileUrl}`
            : "",
        });

        setOriginalUserData({
          profileUrl: user?.profileUrl
            ? `http://localhost:8080${user.profileUrl}`
            : "",
          dateOfBirth: fetchedDateOfBirth,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrorMessage("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    return () => {
      if (userData.profileUrl.startsWith("blob:")) {
        URL.revokeObjectURL(userData.profileUrl);
      }
    };
  }, []);

  const handleDateChange = (date: Date | null) => {
    setUserData((prev) => ({ ...prev, dateOfBirth: date }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      if (userData.profileUrl.startsWith("blob:")) {
        URL.revokeObjectURL(userData.profileUrl);
      }
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setUserData((prev) => ({ ...prev, profileUrl: previewUrl }));
    } else {
      setSelectedFile(null);
      setUserData((prev) => ({
        ...prev,
        profileUrl: originalUserData.profileUrl,
      }));
    }
  };

  const handleCancel = () => {
    if (userData.profileUrl.startsWith("blob:")) {
      URL.revokeObjectURL(userData.profileUrl);
    }
    setUserData((prev) => ({
      ...prev,
      profileUrl: originalUserData.profileUrl,
      dateOfBirth: originalUserData.dateOfBirth,
    }));
    setSelectedFile(null);
    setIsDateEditable(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.back();
  };

  const handleSubmit = async () => {
    try {
      setErrorMessage("");
      setSuccess("");
      let newProfileUrl = userData.profileUrl;

      if (selectedFile) {
        try {
          const uploadResponse = await api.uploadProfilePicture(
            userData.id,
            selectedFile
          );

          if (!uploadResponse?.success) {
            throw new Error(
              uploadResponse?.message || "Upload failed without error message"
            );
          }

          if (!uploadResponse.data?.profileUrl) {
            throw new Error("Server response missing profile URL");
          }

          newProfileUrl = `http://localhost:8080${uploadResponse.data.profileUrl}`;

          setUserData((prev) => ({
            ...prev,
            profileUrl: `${newProfileUrl}?ts=${Date.now()}`,
          }));
        } catch (error: unknown) {
          let errorMessage = "Image upload failed";
          if (error instanceof Error) {
            errorMessage = error.message;
          } else if (typeof error === "string") {
            errorMessage = error;
          }
          throw new Error(errorMessage);
        }
      }

      const updateResponse = await api.updateUser(userData.id, {
        name: userData.name,
        lastName: userData.lastName,
        dateOfBirth: isDateEditable
          ? userData.dateOfBirth
          : originalUserData.dateOfBirth,
        profileUrl: newProfileUrl.replace("http://localhost:8080", ""),
      });

      if (!updateResponse?.success) {
        throw new Error(
          updateResponse?.message || "Failed to update profile data"
        );
      }

      setSuccess("Profile updated successfully!");

      setTimeout(() => {
        router.push(`/profile?refresh=${Date.now()}`);
      }, 1500);
    } catch (error: unknown) {
      let errorMessage = "Failed to update profile";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      setErrorMessage(errorMessage);
      console.error("Profile update error:", error);

      setUserData((prev) => ({
        ...prev,
        profileUrl: originalUserData.profileUrl,
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Update profile | Smart Money</title>
        <meta name="description" content="Profile Smart Money account" />
        <link rel="icon" href="/rounded-logo.png" />
      </Head>

      <header className="flex justify-start pl-6 pt-4">
        <button onClick={handleCancel}>
          <div className="flex rounded-full hover:scale-110 transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 text-[var(--slate)]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </div>
        </button>
      </header>

      <h1 className="flex justify-center text-2xl font-bold text-white mt-4">
        Update Profile
      </h1>

      <div className="flex flex-col justify-center items-center min-h-[80vh] bg-gray-900 text-white gap-6 p-4">
        {success && (
          <div className="fixed top-4 right-4 p-3 text-white bg-green-500 rounded-lg shadow-lg animate-fade-in-out">
            {success}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-500/10 rounded-md max-w-md text-center">
            {errorMessage}
          </div>
        )}

        <div className="w-40 h-40 flex items-center justify-center relative rounded-full border-2 border-[var(--color-button)] overflow-hidden">
          <img
            src={getImageUrl(userData.profileUrl)}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/default-profile.svg";
            }}
          />
        </div>

        <div className="relative">
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          <label
            htmlFor="profileImage"
            className="text-white bg-[var(--color-button)] rounded-lg hover:bg-[var(--color-button-hover)] px-4 py-2 shadow cursor-pointer transition-all"
          >
            Change Photo
          </label>
        </div>

        <div className="w-full max-w-md space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              First Name
            </label>
            <input
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Last Name
            </label>
            <input
              value={userData.lastName}
              onChange={(e) =>
                setUserData({ ...userData, lastName: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Date of Birth
            </label>
            {!isDateEditable ? (
              <div className="flex items-center gap-2">
                <span className="px-4 py-2 bg-gray-800 rounded-md">
                  {originalUserData.dateOfBirth?.toLocaleDateString() ||
                    "Not set"}
                </span>
                <button
                  onClick={() => setIsDateEditable(true)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Change
                </button>
              </div>
            ) : (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={userData.dateOfBirth}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        "& .MuiInputBase-root": {
                          backgroundColor: "#1F2937",
                          color: "white",
                          "& fieldset": { borderColor: "#4B5563" },
                          "&:hover fieldset": { borderColor: "#6366F1" },
                        },
                        "& .MuiInputLabel-root": { color: "#9CA3AF" },
                        "& .Mui-focused .MuiInputLabel-root": {
                          color: "#6366F1",
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleCancel}
            className="px-6 py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-white bg-[var(--color-button)] rounded-lg hover:bg-[var(--color-button-hover)] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
