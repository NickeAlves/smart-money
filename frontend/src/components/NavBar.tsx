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
        href="/#home"
        className={`font-sans p-2 relative overflow-hidden group ${
          pathname === "/#home" ? "text-black" : "text-black"
        }`}
      >
        Home
        <span
          className={`absolute left-0 bottom-0 h-0.5 bg-black transition-all duration-300 ${
            pathname === "/#home" ? "w-full" : "w-0 group-hover:w-full"
          }`}
        ></span>
      </Link>
      <Link
        href="#about"
        className={`font-sans p-2 relative overflow-hidden group ${
          pathname === "#about" ? "text-black" : "text-black"
        }`}
      >
        About me
        <span
          className={`absolute left-0 bottom-0 h-0.5 bg-black transition-all duration-300 ${
            pathname === "#about" ? "w-full" : "w-0 group-hover:w-full"
          }`}
        ></span>
      </Link>
      <Link
        href="#projects"
        className={`font-sans p-2 relative overflow-hidden group ${
          pathname === "#projects" ? "text-black" : "text-black"
        }`}
      >
        Projects
        <span
          className={`absolute left-0 bottom-0 h-0.5 bg-black transition-all duration-300 ${
            pathname === "#projects" ? "w-full" : "w-0 group-hover:w-full"
          }`}
        ></span>
      </Link>
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
          <Link href={"/#home"}>
            <img
              className="w-24 h-24 rounded-full shadow-xl"
              src="smart-money.png"
              alt="smart-money"
            />
          </Link>

          <div className="gap-6 items-center font-sans hidden md:flex">
            <NavLinks />
          </div>

          <div className="md:hidden">
            <button onClick={toggleNavBar} className="text-black">
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
