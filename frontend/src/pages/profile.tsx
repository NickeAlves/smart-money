"use client";

import Head from "next/head";
import Header from "@/components/Header";
import "./../styles/globals.css";
import api from "./../utils/java-api.js";
import { useState, useEffect } from "react";

export default function Profile() {
  const [userData, setUserData] = useState({
    name: "",
    lastName: "",
    email: "",
    age: "",
    profileUrl: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await api.getCurrentUser();
        setUserData({
          name: user.name || "",
          lastName: user.lastName || "",
          email: user.email || "",
          age: user.age || "",
          profileUrl: user.profileUrl || "",
        });
      } catch (error) {
        console.log("Error while searching user data.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <p className="text-white">loading</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Profile | Smart Money</title>
        <meta
          name="description"
          content="Sign in to your Smart Money account"
        />
        <link rel="icon" href="/rounded-logo.png" />
      </Head>
      <Header />
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center md:items-center ">
        <div className="rounded-xl border border-white bg-white/80 p-6 shadow-lg shadow-black">
          <div className="flex flex-col justify-center items-center">
            <div className="pb-6">
              <img
                src={userData.profileUrl || "nicolas-profile.jpeg"}
                alt="profile"
                className="h-56 w-56 rounded-lg object-cover object-center shadow-2xl shadow-black"
              />
            </div>
            <p className="font-bold text-gray-600">
              {userData.name} {userData.lastName}
              <br /> <br />
            </p>
            <p className="font-bold text-gray-600">
              {userData.email} <br /> <br />
            </p>
            <p className="font-bold text-gray-600">
              {userData.age} <br /> <br />
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
