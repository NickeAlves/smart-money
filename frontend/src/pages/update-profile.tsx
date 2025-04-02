"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import api from "../utils/java-api.js";
import { useRouter } from "next/navigation";
import "./../styles/globals.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import ScrollToTopButton from "./../components/ScrollToTopButton";

export default function UpdateProfile() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    lastName: "",
    dateOfBirth: null as Date | null,
    profileUrl: "",
  });
  const [originalDateOfBirth, setOriginalDateOfBirth] = useState<Date | null>(
    null
  );
  const [success, setSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cacheBuster] = useState(Date.now());

  const getImageUrl = () => {
    if (!userData.profileUrl) return "/default-profile.svg";
    return `http://localhost:8080${userData.profileUrl}${
      userData.profileUrl.includes("?") ? "&" : "?"
    }v=${cacheBuster}`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await api.getCurrentUser();
        const fetchedDateOfBirth = user.dateOfBirth
          ? new Date(user.dateOfBirth)
          : null;
        setUserData({
          id: user.id || "",
          name: user.name || "",
          lastName: user.lastName || "",
          dateOfBirth: fetchedDateOfBirth,
          profileUrl: user.profileUrl || "",
        });
        setOriginalDateOfBirth(fetchedDateOfBirth);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const handleDateChange = (date: Date | null) => {
    setUserData((prev) => ({
      ...prev,
      dateOfBirth: date,
    }));
  };

  const handleSubmit = async () => {
    try {
      setErrorMessage("");
      const currentYear = new Date().getFullYear();

      const effectiveDateOfBirth = userData.dateOfBirth || originalDateOfBirth;
      if (!effectiveDateOfBirth) {
        throw new Error("Date of birth is required.");
      }

      const userYear = effectiveDateOfBirth.getFullYear();
      const age = currentYear - userYear;

      if (age < 13) {
        throw new Error(
          "You must be at least 13 years old to update your profile."
        );
      }

      const updatedUserData = {
        ...userData,
        dateOfBirth: effectiveDateOfBirth,
        age: age,
      };

      await api.updateUser(userData.id, updatedUserData);
      setSuccess("Profile updated successfully!");

      setTimeout(() => {
        setSuccess("");
        router.push("/profile");
      }, 3000);
    } catch (error) {
      const err = error as Error;
      setErrorMessage(
        err.message || "Failed to update profile. Please try again."
      );
      console.log("Failed to update profile.", error);
    }
  };

  return (
    <>
      <Head>
        <title>Update profile | Smart Money</title>
        <meta name="description" content="Profile Smart Money account" />
        <link rel="icon" href="/rounded-logo.png" />
      </Head>

      <header className="flex  justify-start pl-6 pt-4">
        <div className="flex">
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
      </header>
      <h1 className="flex justify-center text-2xl font-bold ">
        Update Profile
      </h1>

      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white gap-6">
        {success && (
          <div className="fixed top-4 right-4 p-3 text-white bg-green-500 rounded-lg shadow-lg transition-opacity duration-300 animate-fade-out">
            {success}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-500/10 rounded-md">
            {errorMessage}
          </div>
        )}

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
        <ScrollToTopButton />
        <button className="text-gray-900 bg-gray-100 rounded-full hover:scale-110 transition-transform p-2 pr-4 pl-4 shadow-sm shadow-black">
          Update image
        </button>

        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full px-3 py-2 pr-16 text-sm bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
            name="lastName"
            type="text"
            required
            value={userData.lastName}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, lastName: e.target.value }))
            }
            className="w-full px-3 py-2 pr-16 text-sm bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Date of Birth
          </label>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              className=""
              value={userData.dateOfBirth || originalDateOfBirth}
              onChange={handleDateChange}
              slots={{
                textField: TextField,
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: {
                    "& .MuiInputBase-root": {
                      backgroundColor: "#374151",
                      color: "#D1D5DB",
                      borderRadius: "6px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#4B5563",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#6366F1",
                    },
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#6366F1",
                    },
                    "& .MuiInputBase-input": {
                      padding: "8px 12px",
                      fontSize: "0.875rem",
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </div>

        <div className="flex gap-6 text-gray-900">
          <button
            className="text-gray-900 bg-gray-100 rounded-2xl hover:scale-110 transition-transform p-2 pr-4 pl-4 shadow-sm shadow-black"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}
