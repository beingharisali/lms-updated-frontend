// components/SearchBar.tsx
"use client";
import React from "react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search courses..."
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="w-full md:w-1/2 mx-auto">
      <div className="relative">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-full py-3 px-4 pl-10 focus:outline-none shadow-sm bg-white"
        />
        <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" viewBox="0 0 24 24" fill="none">
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}
