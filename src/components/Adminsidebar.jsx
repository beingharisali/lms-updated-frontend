"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaClipboardList,
  FaBookOpen,
  FaMoneyBillWave,
  FaEnvelope,
  FaUsers,
  FaUserGraduate,
  FaUserPlus,
  FaUserCheck,
  // FaClipboardList,
  FaRobot,
  FaDoorOpen,
  FaPenFancy,
  FaExchangeAlt,
  FaMedal,
  FaVideo,
} from "react-icons/fa";
import { BadgeCheck, ChevronDown } from "lucide-react";

function Adminsidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    // Determine role based on current path
    const role = pathname.startsWith("/admin")
      ? "superadmin"
      : pathname.startsWith("/student")
      ? "student"
      : "staff";
    setUserRole(role);
  }, [pathname]);

  const navItems = [
    {
      href: "/dashboard",
      icon: <FaTachometerAlt />,
      label: "Dashboard",
      roles: ["superadmin", "staff", "student"],
    },
    {
      icon: <BadgeCheck className="w-4 h-4 " />,
      label: "Admission",
      roles: ["superadmin", "staff"],
      submenu: [
        {
          label: "Add Students",
          href: "/admission/addstudent",
          roles: ["superadmin", "staff"],
        },
        {
          label: "Add Teachers",
          href: "/admission/addteacher",
          roles: ["superadmin", "staff"],
        },
        {
          label: "Add Staff",
          href: "/admission/addstaff",
          roles: ["superadmin"],
        },
        {
          label: "Add Visitor Leads",
          href: "/admission/visitor-portal",
          roles: ["superadmin"],
        },
      ],
    },
    {
      href: "/attendance",
      icon: <FaClipboardList />,
      label: "Attendance",
      roles: ["student"],
    },
    {
      href: "/staff-faculty",
      icon: <FaUsers />,
      label: "Staff/Faculty",
      roles: ["superadmin"],
    },
    {
      href: "/student",
      icon: <FaUserGraduate />,
      label: "Student",
      roles: ["superadmin", "staff"],
    },
    {
      href: "/visitor-leads",
      icon: <FaUserCheck />,
      label: "Visitor Leads",
      roles: ["superadmin"],
    },
    {
      href: "/courses",
      icon: <FaBookOpen />,
      label: "Courses",
      roles: ["superadmin", "staff", "student"],
    },
    {
      href: "/fees",
      icon: <FaMoneyBillWave />,
      label: "Fees",
      roles: ["superadmin", "staff", "student"],
    },
    {
      href: "/zeta-ai",
      icon: <FaRobot />,
      label: "Zeta AI",
      roles: ["student"],
    },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });

  const renderNavItem = (item) => {
    const fullHref =
      userRole === "superadmin"
        ? `/admin${item.href}`
        : userRole === "student"
        ? `/student${item.href}`
        : `/staff${item.href}`;
    const isSubActive = item.submenu?.some((sub) => {
      const subFullHref =
        userRole === "superadmin"
          ? `/admin${sub.href}`
          : userRole === "student"
          ? `/student${sub.href}`
          : `/staff${sub.href}`;
      return pathname === subFullHref;
    });
    const isActive = pathname === fullHref;

    if (item.submenu) {
      const filteredSubmenu = item.submenu.filter((subItem) => {
        if (!subItem.roles) return true;
        return subItem.roles.includes(userRole);
      });

      if (filteredSubmenu.length === 0) return null;

      return (
        <li key={item.label} className="w-">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center justify-center gap-2 hover:text-[#6658d3] ${
              isSubActive ? "text-[#6658d3] font-bold" : "text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {dropdownOpen && (
            <ul className="ml-6 mt-1 space-y-1 text-sm text-gray-600">
              {filteredSubmenu.map((subItem) => {
                const subFullHref =
                  userRole === "superadmin"
                    ? `/admin${subItem.href}`
                    : userRole === "student"
                    ? `/student${subItem.href}`
                    : `/staff${subItem.href}`;
                return (
                  <li key={subItem.href}>
                    <Link
                      href={subFullHref}
                      className={`block py-1 hover:text-[#6658d3] ${
                        pathname === subFullHref
                          ? "text-[#6658d3] font-bold"
                          : ""
                      }`}
                    >
                      {subItem.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li
        key={item.href}
        className={`flex items-center gap-2 ${
          isActive ? "text-[#6658d3] font-bold" : "text-gray-700"
        }`}
      >
        {item.icon}
        <Link href={fullHref}>{item.label}</Link>
      </li>
    );
  };

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

      {/* Fullscreen Mobile Menu */}
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
              {filteredNavItems.map(renderNavItem)}
            </ul>

            <div className="flex justify-center mt-6">
              <button className="bg-[#f55b3c] cursor-pointer text-white px-6 py-2 rounded text-sm">
                Upgrade To Pro
              </button>
            </div>
          </div>
        </div>
      )}

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
              {filteredNavItems.map(renderNavItem)}
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

export default Adminsidebar;
