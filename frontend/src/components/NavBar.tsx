"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import "./../styles/globals.css";

const NavLinks = ({
  mobile = false,
  onLogout,
  isLoggingOut,
}: {
  mobile?: boolean;
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
}) => {
  return (
    <>
      <Link
        href="/"
        className={`font-sans p-2 relative overflow-hidden group text-white ${
          mobile ? "w-full text-center" : ""
        }`}
      >
        Home
        <span className="absolute left-0 bottom-0 h-0.5 bg-white transition-all duration-300 w-0 group-hover:w-full"></span>
      </Link>
      <Link
        href="#about"
        className={`font-sans p-2 relative overflow-hidden group text-white ${
          mobile ? "w-full text-center" : ""
        }`}
      >
        About me
        <span className="absolute left-0 bottom-0 h-0.5 bg-white transition-all duration-300 w-0 group-hover:w-full"></span>
      </Link>
      <Link
        href="#projects"
        className={`font-sans p-2 relative overflow-hidden group text-white ${
          mobile ? "w-full text-center" : ""
        }`}
      >
        Projects
        <span className="absolute left-0 bottom-0 h-0.5 bg-white transition-all duration-300 w-0 group-hover:w-full"></span>
      </Link>

      <Popover className="relative justify-center">
        <PopoverButton className="inline-flex items-center">
          <img
            src="profile-user-svgrepo-com.svg"
            alt="profile-picture"
            className="h-8 md:h-8 invert rounded-full hover:scale-110 transition-transform"
          />
        </PopoverButton>

        <PopoverPanel className="absolute right-0 z-10 mt-3 w-40 bg-gray-700 shadow-lg rounded-lg">
          <div className="p-2 text-white">
            <Link
              href="/profile"
              className="block px-4 py-2 hover:bg-gray-800 rounded"
            >
              Your Profile
            </Link>
            <Link
              href="/settings"
              className="block px-4 py-2 hover:bg-gray-800 rounded"
            >
              Settings
            </Link>
            <button
              onClick={onLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-start gap-2 px-4 py-2 text-red-600 hover:bg-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut size={16} />
              {isLoggingOut ? "Exiting..." : "Sign out"}
            </button>
          </div>
        </PopoverPanel>
      </Popover>
    </>
  );
};

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest(".navbar-container")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="navbar-container">
      <nav
        className={`w-full fixed top-0 left-0 z-50 shadow-lg transition-colors duration-300 ${
          isScrolled
            ? "bg-gray-800 backdrop-blur-sm"
            : "bg-[var(--custom-color)]"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center p-4 px-6 md:px-12">
          <Link href="/">
            <img
              src="/smart-money-removebg-preview.svg"
              alt="Smart Money Logo"
              className="h-16 md:h-20 invert"
            />
          </Link>

          <div className="gap-6 items-center font-sans hidden md:flex">
            <NavLinks onLogout={handleLogout} isLoggingOut={isLoggingOut} />
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-gray-800 shadow-lg transition-all duration-300">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col items-center gap-4">
              <NavLinks
                mobile
                onLogout={handleLogout}
                isLoggingOut={isLoggingOut}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
