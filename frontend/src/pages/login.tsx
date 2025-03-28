"use client";

import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import "./../styles/globals.css";
import api from "@/utils/java-api";

interface LoginCredentials {
  email: string;
  password: string;
}

const LoginPage: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const credentials: LoginCredentials = { email, password };
      const response = await api.login(credentials);

      if (response.token) {
        localStorage.setItem("token", response.token);
        router.push("/");
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      const err = error as Error;
      setErrorMessage(err.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Smart Money</title>
        <link rel="icon" href="/rounded-logo.png" />
      </Head>

      <div className="min-h-screen bg-gray-900 flex flex-col justify-center p-4 sm:p-6">
        <div className="w-full max-w-xs sm:max-w-sm mx-auto">
          <div className="flex justify-center mb-4 sm:mb-6">
            <img
              src="/smart-money-removebg-preview.svg"
              alt="Smart Money Logo"
              className="w-40 sm:w-52 h-auto invert"
            />
          </div>

          <h2 className="text-center text-xl sm:text-2xl font-bold text-gray-100 mb-4 sm:mb-6">
            Sign in to your account
          </h2>

          {errorMessage && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-500/10 rounded-md">
              {errorMessage}
            </div>
          )}

          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg shadow-gray-950">
            <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-medium text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-medium text-gray-300 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 sm:py-2.5 mt-2 text-xs sm:text-sm font-medium text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 focus:ring-offset-gray-800 ${
                  isSubmitting
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600"
                }`}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              <p className="text-center text-xs sm:text-sm text-gray-400 mt-3 sm:mt-4">
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
