import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import "./../styles/globals.css";

const RegisterPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Register | Smart Money</title>
        <link rel="icon" href="/rounded-logo.png" />
      </Head>

      <div className="min-h-screen bg-gray-900 flex flex-col justify-center pb-6">
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-center">
            <img
              src="/smart-money-removebg-preview.svg"
              alt="Smart Money Logo"
              className="w-52 h-auto invert"
            />
          </div>

          <h2 className="text-center text-2xl font-bold text-gray-100 mb-6">
            Create Your Account
          </h2>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-gray-950">
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 text-sm bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 text-sm bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 text-sm bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 text-sm bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 text-sm bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 focus:ring-offset-gray-800"
              >
                Register
              </button>

              <p className="text-center text-sm text-gray-400 mt-4">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                >
                  Sign In
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
