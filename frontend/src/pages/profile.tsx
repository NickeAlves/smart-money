import Head from "next/head";
import Header from "@/components/Header";
import "./../styles/globals.css";

export default function Profile() {
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
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center p-4 md:items-center gap-6">
        <h1 className="font-bold">Profile</h1>
        <img
          src="nicolas-profile.jpeg"
          alt="profile"
          className="rounded-full h-12 w-12 shadow-2xl"
        />
        <div className="bg-gray-700 shadow-2xl rounded-lg max-w-screen-xl max-h-screen-xl justify-center flex items-center flex-row-2">
          <div>
            <h1 className="font-extrabold">Name</h1>
            <p>Rodrigues, Nicolas</p>
            <h1 className="font-extrabold">Email</h1>
            <p>nicolas@gmail.com</p>
            <h1 className="font-extrabold">Birthday</h1>
            <p>06/07/2002</p>
          </div>
        </div>
      </div>
    </>
  );
}
