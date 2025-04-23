"use client";

import "./../../styles/globals.css";
import Head from "next/head";
import api from "../../integrations/java-api.js";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  format,
  parseISO,
  isValid,
  addYears,
  differenceInYears,
} from "date-fns";

interface UserData {
  id: string;
  name: string;
  lastName: string;
  dateOfBirth: Date | null;
  profileUrl: string;
}

interface ApiUser {
  id: string;
  name: string;
  lastName: string;
  dateOfBirth: string | null;
  profileUrl: string | null;
}

interface UserUpdatePayload {
  name?: string;
  lastName?: string;
  dateOfBirth?: string | null;
  profileUrl?: string;
}

export default function UpdateProfile() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const router = useRouter();
  const [isDateEditable, setIsDateEditable] = useState(false);

  const [userData, setUserData] = useState<UserData>({
    id: "",
    name: "",
    lastName: "",
    dateOfBirth: null,
    profileUrl: "",
  });

  const [originalUserData, setOriginalUserData] = useState<UserData>({
    id: "",
    name: "",
    lastName: "",
    dateOfBirth: null,
    profileUrl: "",
  });

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const user: ApiUser = await api.getCurrentUser();

      let parsedDate: Date | null = null;
      if (user.dateOfBirth) {
        parsedDate = parseISO(user.dateOfBirth);
        if (!isValid(parsedDate)) {
          console.error("Invalid date from API:", user.dateOfBirth);
          parsedDate = null;
        }
      }

      const newUserData: UserData = {
        id: user.id || "",
        name: user.name || "",
        lastName: user.lastName || "",
        dateOfBirth: parsedDate,
        profileUrl: user.profileUrl || "/default-profile.svg",
      };

      setUserData(newUserData);
      setOriginalUserData(newUserData);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleDateChange = useCallback((date: Date | null) => {
    setError("");
    setUserData((prev) => ({ ...prev, dateOfBirth: date }));
  }, []);

  const handleCancelDateEdit = useCallback(() => {
    setUserData((prev) => ({
      ...prev,
      dateOfBirth: originalUserData.dateOfBirth,
    }));
    setIsDateEditable(false);
  }, [originalUserData.dateOfBirth]);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !userData.id) return;

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError(
          "Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP)."
        );
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("File size exceeds 5MB limit.");
        return;
      }

      setUploading(true);
      setError("");
      setSuccess("");

      try {
        const previewUrl = URL.createObjectURL(file);
        setUserData((prev) => ({ ...prev, profileUrl: previewUrl }));

        const result = await api.uploadProfilePicture(userData.id, file);
        if (!result?.success) {
          throw new Error(
            result?.message || "Failed to upload profile picture"
          );
        }

        setUserData((prev) => ({
          ...prev,
          profileUrl: result.data?.profileUrl || prev.profileUrl,
        }));
        setCacheBuster(Date.now());
        setSuccess("Profile picture updated successfully!");
      } catch (err) {
        console.error("Upload error:", err);
        setError(err instanceof Error ? err.message : "Upload failed");
        setUserData((prev) => ({
          ...prev,
          profileUrl: originalUserData.profileUrl,
        }));
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [userData.id, originalUserData.profileUrl]
  );

  const validateForm = useCallback(() => {
    if (!userData.name.trim()) {
      setError("First name is required");
      return false;
    }
    if (!userData.lastName.trim()) {
      setError("Last name is required");
      return false;
    }

    if (userData.dateOfBirth && !isValid(userData.dateOfBirth)) {
      setError("Invalid date of birth");
      return false;
    }

    if (userData.dateOfBirth) {
      const age = differenceInYears(new Date(), userData.dateOfBirth);
      if (age < 13) {
        setError("You must be at least 13 years old");
        return false;
      }
    }

    return true;
  }, [userData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const updateData: UserUpdatePayload = {};

      if (userData.name !== originalUserData.name) {
        updateData.name = userData.name;
      }
      if (userData.lastName !== originalUserData.lastName) {
        updateData.lastName = userData.lastName;
      }
      if (
        userData.dateOfBirth?.getTime() !==
        originalUserData.dateOfBirth?.getTime()
      ) {
        updateData.dateOfBirth = userData.dateOfBirth
          ? format(userData.dateOfBirth, "yyyy-MM-dd")
          : null;
      }

      if (Object.keys(updateData).length === 0) {
        setSuccess("No changes detected");
        return;
      }

      const result = await api.updateUser(userData.id, updateData);
      if (!result?.success) {
        throw new Error(result?.message || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      setTimeout(() => router.push("/profile"), 1500);
    } catch (err) {
      console.error("Update error:", err);
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUploading(false);
    }
  }, [userData, originalUserData, validateForm, router]);

  const handleCancel = useCallback(() => {
    if (userData.profileUrl.startsWith("blob:")) {
      URL.revokeObjectURL(userData.profileUrl);
    }
    router.push("/profile");
  }, [userData.profileUrl, router]);

  const getImageUrl = useCallback(() => {
    if (!userData.profileUrl) return "/default-profile.svg";
    if (userData.profileUrl.startsWith("blob:")) return userData.profileUrl;

    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
    const isAbsoluteUrl = userData.profileUrl.startsWith("http");

    return isAbsoluteUrl
      ? `${userData.profileUrl}?v=${cacheBuster}`
      : `${baseUrl}${userData.profileUrl}?v=${cacheBuster}`;
  }, [userData.profileUrl, cacheBuster]);

  const calculateAge = (date: Date | null): string => {
    if (!date) return "";
    const age = differenceInYears(new Date(), date);
    return ` (${age} years old)`;
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
        <title>Update Profile | Smart Money</title>
        <meta name="description" content="Update your profile information" />
        <link rel="icon" href="/rounded-logo.png" />
      </Head>

      <header className="p-4 flex justify-between items-center border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-[var(--color-button)]"
          aria-label="Go back"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-white">Update Profile</h1>
        <button
          onClick={() => router.push("/")}
          className="p-2 rounded-full hover:bg-[var(--color-button)]"
          aria-label="Go home"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </button>
      </header>

      <main className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
        <div className="max-w-md mx-auto flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-full border-4 border-[var(--color-button)] overflow-hidden">
              <img
                src={getImageUrl()}
                alt="Profile"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.currentTarget.src = "/default-profile.svg";
                }}
              />
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              disabled={uploading}
              className="hidden"
              id="profile-upload"
            />
            <label
              htmlFor="profile-upload"
              className={`px-4 py-2 bg-[var(--color-button)] text-white rounded-md cursor-pointer hover:bg-gray-800 transition-colors ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploading ? "Uploading..." : "Change Photo"}
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-800 rounded-md border border-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-100 text-green-800 rounded-md border border-green-200">
              {success}
            </div>
          )}

          {/* Profile Form */}
          <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                First Name
              </label>
              <input
                id="name"
                type="text"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                disabled={uploading}
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={userData.lastName}
                onChange={(e) =>
                  setUserData({ ...userData, lastName: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                disabled={uploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Date of Birth{calculateAge(userData.dateOfBirth)}
              </label>
              {!isDateEditable ? (
                <div className="flex gap-2">
                  <div className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white">
                    {userData.dateOfBirth
                      ? format(userData.dateOfBirth, "MMMM d, yyyy")
                      : "Not set"}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDateEditable(true)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors"
                    disabled={uploading}
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={userData.dateOfBirth}
                      onChange={handleDateChange}
                      maxDate={addYears(new Date(), -13)}
                      minDate={addYears(new Date(), -120)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          error: !!error,
                          helperText: error || " ",
                          sx: {
                            "& .MuiInputBase-root": {
                              backgroundColor: "#374151",
                              color: "white",
                              "& fieldset": { borderColor: "#4B5563" },
                              "&:hover fieldset": { borderColor: "#6B7280" },
                              "&.Mui-focused fieldset": {
                                borderColor: "#818CF8",
                              },
                            },
                            "& .MuiFormHelperText-root": {
                              color: "#F87171",
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                  <button
                    type="button"
                    onClick={handleCancelDateEdit}
                    className="w-full py-2 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 text-white bg-gray-600 hover:bg-gray-500 rounded-md transition-colors"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={uploading}
                className={`px-6 py-2 text-white rounded-md transition-colors ${
                  uploading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-[var(--color-button)] hover:bg-gray-800"
                }`}
              >
                {uploading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
