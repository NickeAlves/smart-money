"use client";

import Head from "next/head";
import api from "../integrations/java-api.js";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import "./../styles/globals.css";

interface UserData {
  id: string;
  email: string;
  newEmail: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  profileUrl: string;
}

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showEmailFields, setShowEmailFields] = useState(false);

  const router = useRouter();

  const [userData, setUserData] = useState<UserData>({
    id: "",
    email: "",
    newEmail: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    profileUrl: "",
  });

  const [originalData, setOriginalData] = useState<UserData>({
    id: "",
    email: "",
    newEmail: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    profileUrl: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await api.getCurrentUser();
        const initialData = {
          id: user.id || "",
          email: user.email || "",
          newEmail: "",
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
          profileUrl: user.profileUrl || "",
        };
        setUserData(initialData);
        setOriginalData(initialData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const verifyCurrentPassword = async () => {
    try {
      setSubmitting(true);
      setError("");

      const response = await api.verifyPassword(userData.currentPassword);

      if (!response.success) {
        throw new Error(response.message || "Failed to verify password");
      }

      setPasswordVerified(true);
      setSuccess("");
    } catch (error) {
      const err = error as Error;
      setError(err.message || "Failed to verify password");
      setPasswordVerified(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      if (!passwordVerified) {
        setError("Please verify your current password first");
        return;
      }

      if (userData.newEmail && !/\S+@\S+\.\S+/.test(userData.newEmail)) {
        setError("Please enter a valid email");
        return;
      }

      if (userData.newPassword) {
        if (
          userData.newPassword.length < 6 ||
          userData.newPassword.length > 100
        ) {
          setError("New password must be between 6 and 100 characters");
          return;
        }
        if (userData.newPassword !== userData.confirmNewPassword) {
          setError("New passwords do not match");
          return;
        }
      }

      const updateData = {
        email: userData.newEmail || undefined,
        password: userData.newPassword || undefined,
      };

      const updateResponse = await api.updateUser(userData.id, updateData);

      if (!updateResponse?.success) {
        throw new Error(updateResponse?.message || "Failed to update account");
      }
      setSuccess("Account updated successfully!");

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update account"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setUserData(originalData);
    setPasswordVerified(false);
    setShowPasswordFields(false);
    setShowEmailFields(false);
    setError("");
    setSuccess("");
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
        <title>Settings | Smart Money</title>
        <meta name="description" content="Account Smart Money account" />
        <link rel="icon" href="/rounded-logo.png" />
      </Head>

      <header className="p-4 flex justify-between items-center border-b border-gray-800">
        <button
          onClick={() => router.back()}
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
        <h1 className="text-xl">Settings</h1>
        <button
          onClick={() => router.push("/")}
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

      <main className="flex flex-col justify-center items-center min-h-[80vh] bg-gray-900 text-white gap-4 p-4">
        <div className="w-full max-w-md space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={userData.currentPassword}
              onChange={(e) =>
                setUserData({ ...userData, currentPassword: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={passwordVerified}
            />
          </div>

          {!passwordVerified && (
            <button
              onClick={verifyCurrentPassword}
              className="w-full px-6 py-2 text-white bg-[var(--color-button)] rounded-lg hover:bg-gray-800 transition-colors"
              disabled={submitting || !userData.currentPassword}
            >
              {submitting ? "Verifying..." : "Verify Password"}
            </button>
          )}

          {passwordVerified && (
            <>
              <button
                onClick={() => setShowEmailFields(!showEmailFields)}
                className="w-full px-6 py-2 text-white bg-[var(--color-button)] rounded-lg hover:bg-gray-600 transition-colors"
              >
                {showEmailFields ? "Cancel Email Change" : "Change Email"}
              </button>
              {showEmailFields && (
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    New Email (current: {userData.email})
                  </label>
                  <input
                    value={userData.newEmail}
                    onChange={(e) =>
                      setUserData({ ...userData, newEmail: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <button
                onClick={() => setShowPasswordFields(!showPasswordFields)}
                className="w-full px-6 py-2 text-white bg-[var(--color-button)] rounded-lg hover:bg-gray-600 transition-colors"
              >
                {showPasswordFields
                  ? "Cancel Password Change"
                  : "Change Password"}
              </button>

              {showPasswordFields && (
                <>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={userData.newPassword}
                      required
                      minLength={6}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={userData.confirmNewPassword}
                      required
                      minLength={6}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          confirmNewPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {(error || success) && (
            <div
              className={`mb-4 p-2 text-sm rounded w-full text-center ${
                error
                  ? "text-red-600 bg-red-100"
                  : "text-green-600 bg-green-100"
              }`}
            >
              {error || success}
            </div>
          )}

          {passwordVerified && (
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleCancel}
                className="px-6 py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-500 transition-colors"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
