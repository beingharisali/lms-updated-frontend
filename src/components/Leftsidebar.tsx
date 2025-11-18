"use client";

import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaClipboardList,
  FaBook,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaMedal,
  FaRobot,
} from "react-icons/fa";

function Leftsidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    {
      href: "/student/dashboard",
      icon: <FaTachometerAlt />,
      label: "Dashboard",
    },
    {
      href: "/student/attendance",
      icon: <FaClipboardList />,
      label: "Attendance",
    },
    { href: "/student/courses", icon: <FaBook />, label: "Courses" },
    { href: "/student/fees", icon: <FaMoneyBillWave />, label: "Fees" },
    {
      href: "/student/transactions",
      icon: <FaExchangeAlt />,
      label: "Transactions",
    },
    {
      href: "/student/success-stories",
      icon: <FaMedal />,
      label: "Success Stories",
    },
    { href: "/student/zeta-ai", icon: <FaRobot />, label: "Zeta AI" },
  ];

  return (
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src="https://ideocollege.com/wp-content/uploads/2023/06/ideocollege-logo.jpg"
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-lg font-bold text-[#2c3e50]">Menu</h1>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="focus:outline-none"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Fullscreen Mobile Menu with scroll support */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[9999] bg-white text-[#2c3e50] text-lg font-semibold overflow-y-auto">
          <div className="flex flex-col px-4 py-6 min-h-screen max-h-screen overflow-y-auto">
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex flex-col items-center mb-4 mt-6">
              <img
                src="https://ideocollege.com/wp-content/uploads/2023/06/ideocollege-logo.jpg"
                alt="Logo"
                className="w-20 h-20 object-contain"
              />
            </div>

            <ul className="flex flex-col items-center space-y-6 flex-grow justify-evenly">
              {navItems.map((item) => (
                <li
                  key={item.href}
                  className={`flex items-center gap-2 ${
                    pathname === item.href ? "text-[#6658d3] font-bold" : ""
                  }`}
                >
                  {item.icon}
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>

            <div className="flex justify-center mt-6">
              <button className="bg-[#f55b3c] cursor-pointer text-white px-6 py-2 rounded text-sm">
                Upgrade To Pro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar with scroll support */}
      <div className="hidden md:flex pt-0">
        <aside className="sticky top-0 h-screen bg-white shadow-md w-64 z-50 overflow-y-auto">
          <div className="flex flex-col items-center px-4 py-6 min-h-screen">
            <div className="mb-8">
              <img
                src="https://ideocollege.com/wp-content/uploads/2023/06/ideocollege-logo.jpg"
                alt="Logo"
                className="w-20 h-20 object-contain"
              />
            </div>

            <ul className="space-y-8 text-sm text-[#2c3e50] font-medium w-full pl-6">
              {navItems.map((item) => (
                <li
                  key={item.href}
                  className={`flex items-center gap-2 ${
                    pathname === item.href ? "text-[#6658d3] font-bold" : ""
                  }`}
                >
                  {item.icon}
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>

            <button className="bg-[#f55b3c] text-white w-full py-2 cursor-pointer rounded mt-10 text-sm font-semibold">
              Upgrade To Pro
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}

export default Leftsidebar;
