"use client";

import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import "./../styles/globals.css";
import api from "@/utils/java-api";
import { useAuth } from "@/context/AuthContext";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";

interface LoginCredentials {
  email: string;
  password: string;
}

const LoginPage: NextPage = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage(false);

    try {
      await api.login(credentials);
      login(); // Sem argumento, agora deve funcionar com o AuthContext ajustado
      setSuccessMessage(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Smart Money</title>
        <meta
          name="description"
          content="Sign in to your Smart Money account"
        />
        <link rel="icon" href="/rounded-logo.png" />
      </Head>

      <div className="min-h-screen bg-gray-900 flex justify-center p-4 md:items-center">
        <div className="w-full max-w-md space-y-6 mt-8 md:mt-0">
          <div className="flex justify-center">
            <img
              src="/smart-money-removebg-preview.svg"
              alt="Smart Money Logo"
              className="w-32 h-auto invert"
              loading="lazy"
            />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-gray-950">
            <h2 className="text-center text-2xl font-bold text-gray-100 mb-6">
              Sign in to your account
            </h2>

            {errorMessage && (
              <div className="mb-4 p-3 text-sm text-red-500 bg-red-500/10 rounded-md">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <Alert
                icon={<CheckIcon fontSize="inherit" />}
                severity="success"
                sx={{ mb: 2 }}
              >
                Login successful! Redirecting to homepage...
              </Alert>
            )}

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
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
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  disabled={isSubmitting}
                />
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
                  autoComplete="current-password"
                  required
                  minLength={8}
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2.5 mt-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 focus:ring-offset-gray-800 ${
                  isSubmitting
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500"
                }`}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              <p className="text-center text-sm text-gray-400 mt-4">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
