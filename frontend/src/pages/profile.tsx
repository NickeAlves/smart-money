import Head from "next/head";
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
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center md:items-center ">
        <div className="rounded-xl border border-white bg-white/80 p-6 shadow-lg shadow-black">
          <div className="flex flex-col justify-center items-center">
            <div className="pb-6">
              <img
                src="nicolas-profile.jpeg"
                alt="profile"
                className="h-56 w-56 rounded-lg object-cover object-center shadow-2xl shadow-black"
              />
            </div>
            <p className="font-bold text-gray-600">
              Rodrigues, Nicolas <br /> <br />
            </p>
            <p className="font-bold text-gray-600">
              nicolas@gmail.com <br /> <br />
            </p>
            <p className="font-bold text-gray-600">
              06/07/2002 <br /> <br />
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
