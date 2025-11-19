"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Users, BookOpen, NotebookPen } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Blue Section */}
      <div className="bg-gradient-to-b   from-[#1C276A] to-[#004AAD] text-white px-4 pt-10 pb-20 flex flex-col items-center ">
        <img
          src="/Ideo_Logo.png"
          alt="Ideoversity Logo"
          className="w-80 h-30   mb-4"
        />
        <h1 className="text-4xl mt-6 mb-2 font-bold text-center">
          Ideoversity Arfa Tower Main
        </h1>
        <p className="text-xl mt-2 text-blue-100 text-center fontlight">
          Learning Management System 4.0
        </p>
        <p className="text-sm mt-3 text-blue-200 text-center">
          Empowering Future Technology Leaders
        </p>
      </div>

      {/* Cards over blue section */}
      <div className="   pb-5 -mt-7 w-full px-4 flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {/* Super Admin */}
          <Link
            href={`/auth/admin`}
            className="bg-white text-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform transform hover:-translate-y-1 hover:shadow-2xl border-t-4 border-blue-400"
          >
            <div className="w-16 h-16 flex justify-center mx-auto bg-blue-100 rounded-full items-center text-center mb-4 group-hover:scale-110">
              <ShieldCheck className="w-10 h-10 mt-3 text-blue-500 mb-3" />
            </div>
            <h2 className="text-lg font-semibold">Super Admin</h2>
            <p className="text-sm text-center">
              System administration and configuration
            </p>
          </Link>

          {/* Staff Portal */}
          <Link
            href={"/auth/staff"}
            className="bg-white text-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform transform hover:-translate-y-1 hover:shadow-2xl border-t-4 border-yellow-400"
          >
            <div className="w-16 h-16 flex justify-center mx-auto bg-amber-100 rounded-full items-center text-center mb-4 group-hover:scale-110">
              <Users className="w-10 h-10 mt-3 text-yellow-500 mb-3" />
            </div>
            <h2 className="text-lg font-semibold">Staff Portal</h2>
            <p className="text-sm text-center">Faculty and staff management</p>
          </Link>

          {/* Student Portal */}
          <Link
            href={"/auth/student"}
            className="bg-white text-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform transform hover:-translate-y-1 hover:shadow-2xl border-t-4 border-green-400"
          >
            <div className="w-16 h-16 flex justify-center mx-auto bg-green-100 rounded-full items-center text-center mb-4 group-hover:scale-110">
              <BookOpen className="w-10 h-10 mt-3 text-green-500 mb-3" />
            </div>
            <h2 className="text-lg font-semibold">Student Portal</h2>
            <p className="text-sm text-center">Access your learning journey</p>
          </Link>

          <Link
            href={"/auth/instructor"}
            className="bg-white text-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform transform hover:-translate-y-1 hover:shadow-2xl border-t-4 border-purple-400"
          >
            <div className="w-16 h-16 flex justify-center mx-auto bg-purple-100 rounded-full items-center text-center mb-4 group-hover:scale-110">
              <NotebookPen className="w-10 h-10 mt-3 text-purple-500 mb-3" />
            </div>
            <h2 className="text-lg font-semibold">Instructor Portal</h2>
            <p className="text-sm text-center">
              Access your teaching journey and management
            </p>
          </Link>
        </div>
      </div>

      {/* White Section */}
      <div className="bg-white text-gray-900 px-4 p flex flex-col items-center">
        {/* Buttons */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
              <Link href="/admission" className="text-gray-700">
                Admission Form
              </Link>
            </div>
            <a
              href="https://www.youtube.com/channel/UCb2BjLEfzYF78eXTlDB5iHg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="red"
                className="bi bi-youtube"
                viewBox="0 0 16 16"
              >
                <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
              </svg>
              <span className="text-gray-700">YouTube</span>
            </a>

            <a
              href="tel:+1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="blue"
                className="bi bi-telephone"
                viewBox="0 0 16 16"
              >
                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
              </svg>
              <span className="text-gray-700">Contact Us</span>
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.example.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="green"
                className="bi bi-google-play"
                viewBox="0 0 16 16"
              >
                <path d="M14.222 9.374c1.037-.61 1.037-2.137 0-2.748L11.528 5.04 8.32 8l3.207 2.96zm-3.595 2.116L7.583 8.68 1.03 14.73c.201 1.029 1.36 1.61 2.303 1.055zM1 13.396V2.603L6.846 8zM1.03 1.27l6.553 6.05 3.044-2.81L3.333.215C2.39-.341 1.231.24 1.03 1.27" />
              </svg>
              <span className="text-gray-700">Play Store</span>
            </a>
          </div>
        </section>
      </div>

      <footer className="bottom-0 left-0 w-full bg-white text-gray-500 text-xs py-4 px-4 shadow-[0_-1px_4px_rgba(0,0,0,0.1)] z-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm">© 2025 Ideoversity™. All Rights Reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1 text-sm">
            Developed by P2PClouds <span className="hidden sm:inline">|</span>{" "}
            Made in Pakistan <span className="ml-1">🇵🇰</span>
          </p>
        </div>
              
      </footer>
    </div>
  );
}
