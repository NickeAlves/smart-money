"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import "./../styles/globals.css";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import api from "@/utils/java-api";

const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
  },
  {
    label: "Settings",
    icon: Cog6ToothIcon,
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
  },
];

const NavLinks = ({
  mobile = false,
  onLogout,
  isLoggingOut,
}: {
  mobile?: boolean;
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
}) => {
  const [loading, setLoading] = useState(true);
  const [cacheBuster] = useState(Date.now());
  const [, setError] = useState("");

  const [userData, setUserData] = useState({
    profileUrl: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await api.getCurrentUser();
        setUserData({
          profileUrl: user.profileUrl || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getImageUrl = () => {
    if (!userData.profileUrl) return "";

    if (userData.profileUrl.startsWith("blob:")) {
      return userData.profileUrl;
    }

    return `http://localhost:8080${userData.profileUrl}${
      userData.profileUrl.includes("?") ? "&" : "?"
    }v=${cacheBuster}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/"
        className={`font-sans p-2 relative overflow-hidden group text-white ${
          mobile ? "w-full text-center py-3" : ""
        } hover:bg-gray-700/50 rounded-md transition-colors`}
      >
        Home
        {!mobile && (
          <span className="absolute left-0 bottom-0 h-0.5 bg-[var(--color-button)] transition-all duration-300 w-0 group-hover:w-full"></span>
        )}
      </Link>
      <Link
        href="#about"
        className={`font-sans p-2 relative overflow-hidden group text-white ${
          mobile ? "w-full text-center py-3" : ""
        } hover:bg-gray-700/50 rounded-md transition-colors`}
      >
        About me
        {!mobile && (
          <span className="absolute left-0 bottom-0 h-0.5 bg-[var(--color-button)] transition-all duration-300 w-0 group-hover:w-full"></span>
        )}
      </Link>
      <Link
        href="#projects"
        className={`font-sans p-2 relative overflow-hidden group text-white ${
          mobile ? "w-full text-center py-3" : ""
        } hover:bg-gray-700/50 rounded-md transition-colors`}
      >
        Projects
        {!mobile && (
          <span className="absolute left-0 bottom-0 h-0.5 bg-[var(--color-button)] transition-all duration-300 w-0 group-hover:w-full"></span>
        )}
      </Link>

      <Popover className="relative justify-center">
        <PopoverButton className="inline-flex items-center outline-none">
          <img
            src={getImageUrl()}
            alt="Profile"
            className={`${
              mobile ? "h-10 w-10 my-3" : "h-12 w-12"
            } border border-[var(--color-button)] rounded-full hover:scale-110 transition-transform`}
            crossOrigin="anonymous"
            onError={(e) => {
              console.error("Image error:", e);
              e.currentTarget.src = "/default-profile.svg";
            }}
            onLoad={() => {
              if (userData.profileUrl.startsWith("blob:")) {
                URL.revokeObjectURL(userData.profileUrl);
              }
            }}
          />
        </PopoverButton>

        <PopoverPanel
          className={`absolute ${
            mobile ? "left-1/2 transform -translate-x-1/2" : "right-0"
          } z-10 mt-3 w-40 bg-gray-700 shadow-lg shadow-black rounded-lg`}
        >
          <div className="p-2 text-white">
            {profileMenuItems.map((item, index) => {
              const Icon = item.icon;
              return item.label === "Sign Out" ? (
                <button
                  key={index}
                  onClick={onLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center justify-start gap-2 px-4 py-2 text-red-600 hover:bg-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon className="h-4 w-4" />
                  {isLoggingOut ? "Exiting..." : item.label}
                </button>
              ) : (
                <Link
                  key={index}
                  href={`/${item.label.toLowerCase().replace("my ", "")}`}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
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
  const pathname = usePathname();
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

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="navbar-container">
      <nav
        className={`w-full fixed top-0 left-0 z-50 border-b border-gray-800 transition-colors duration-300 ${
          isScrolled
            ? "bg-gray-800/90 backdrop-blur-sm"
            : "bg-[var(--custom-color)]"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center p-2 px-4 md:px-12">
          <Link href="/">
            <img
              src="/smart-money-removebg-preview.svg"
              alt="Smart Money Logo"
              className="h-14 md:h-20 invert"
            />
          </Link>

          <div className="gap-4 md:gap-6 items-center font-sans hidden md:flex">
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
        <div className="md:hidden fixed top-20 left-0 right-0 z-40 bg-gray-800/95 backdrop-blur-sm shadow-lg shadow-black transition-all duration-300">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col items-center gap-1">
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
