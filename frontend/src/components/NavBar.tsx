"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import "./../styles/globals.css";

const NavLinks = () => {
  const pathname = usePathname();

  return (
    <>
      <Link
        href="/"
        className={`font-sans p-2 relative overflow-hidden group ${
          pathname === "/" ? "text-white" : "text-white"
        }`}
      >
        Home
        <span
          className={`absolute left-0 bottom-0 h-0.5 bg-white transition-all duration-300 ${
            pathname === "/" ? "w-full" : "w-0 group-hover:w-full"
          }`}
        ></span>
      </Link>
      <Link
        href="#about"
        className={`font-sans p-2 relative overflow-hidden group ${
          pathname === "#about" ? "text-white" : "text-white"
        }`}
      >
        About me
        <span
          className={`absolute left-0 bottom-0 h-0.5 bg-white transition-all duration-300 ${
            pathname === "#about" ? "w-full" : "w-0 group-hover:w-full"
          }`}
        ></span>
      </Link>
      <Link
        href="#projects"
        className={`font-sans p-2 relative overflow-hidden group ${
          pathname === "#projects" ? "text-white" : "text-white"
        }`}
      >
        Projects
        <span
          className={`absolute left-0 bottom-0 h-0.5 bg-white transition-all duration-300 ${
            pathname === "#projects" ? "w-full" : "w-0 group-hover:w-full"
          }`}
        ></span>
      </Link>
      <button
        type="button"
        className="text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
      >
        Exit
        <svg
          className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </button>
    </>
  );
};

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleNavBar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`w-full fixed top-0 left-0 z-50 shadow-lg transition-colors duration-300 ${
          isScrolled
            ? "bg-gray-800 backdrop-blur-sm"
            : "bg-[var(--custom-color)]"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center p-4 px-6 md:px-12">
          <Link href={"/"}>
            <img
              src="/smart-money-removebg-preview.svg"
              alt="Smart Money Logo"
              className="h-24  invert"
            />
          </Link>

          <div className="gap-6 items-center font-sans hidden md:flex">
            <NavLinks />
          </div>

          <div className="md:hidden">
            <button onClick={toggleNavBar} className="text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-[var(--custom-color)] w-full absolute top-20 left-0 p-4 shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <NavLinks />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
