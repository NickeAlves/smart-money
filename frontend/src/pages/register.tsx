"use client";

import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import "./../styles/globals.css";
import api from "@/utils/java-api";
import { useAuth } from "@/context/AuthContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  password: string;
  confirmPassword: string;
}

const RegisterPage: NextPage = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: new Date(),
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        dateOfBirth: date,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        dateOfBirth: new Date(),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage(false);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const currentYear = new Date().getFullYear();
      const userYear = formData.dateOfBirth.getFullYear();

      if (currentYear - userYear < 13) {
        throw new Error("You must be at least 13 years old to register");
      }

      const userData = {
        name: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        age: currentYear - userYear,
      };

      await api.register(userData);
      login();
      setSuccessMessage(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (error) {
      const err = error as Error;
      setErrorMessage(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register | Smart Money</title>
        <meta name="Smart Money" content="Create your Smart Money account" />
        <link rel="icon" href="/rounded-logo.png" />
      </Head>
      {successMessage && (
        <div className="fixed top-4 right-4 p-3 text-white bg-green-500 rounded-lg shadow-lg transition-opacity duration-200 animate-fade-out">
          {successMessage}
          Registered successfully!
        </div>
      )}

      <div className="min-h-screen bg-gray-900 flex justify-center p-4 md:items-center">
        <div className="w-full max-w-md space-y-6 mt-4 md:mt-0">
          <div className="flex justify-center">
            <img
              src="/smart-money-removebg-preview.svg"
              alt="Smart Money Logo"
              className="w-32 h-auto invert"
              loading="lazy"
            />
          </div>

          <h2 className="text-center text-2xl font-bold text-gray-100 mb-6">
            Create Your Account
          </h2>

          {errorMessage && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-500/10 rounded-md">
              {errorMessage}
            </div>
          )}

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-gray-950">
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-2 gap-4">
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
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                    value={formData.dateOfBirth}
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

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2.5 mt-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 focus:ring-offset-gray-800 ${
                  isSubmitting
                    ? "bg-[var(--color-button)] cursor-not-allowed"
                    : "bg-[var(--color-button)] hover:bg-[var(--color-button-hover)] transition-colors"
                }`}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>

              <p className="text-center text-sm text-gray-400 mt-3">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-[var(--color-button)] hover:text-indigo-300 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
