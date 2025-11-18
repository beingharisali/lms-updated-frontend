"use client";
import React from "react";
import { FaUser } from "react-icons/fa";

interface ProfilePictureProps {
  src?: string | { url?: string };
  size?: number;
}

export default function ProfilePicture({
  src,
  size = 96,
}: ProfilePictureProps) {
  const url = typeof src === "string" ? src : src?.url;
  return url ? (
    <div
      style={{ width: size, height: size }}
      className="mx-auto rounded-full overflow-hidden border-2 border-gray-300"
    >
      <img
        src={url}
        alt="profile"
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/coding.png";
        }}
      />
    </div>
  ) : (
    <div
      style={{ width: size, height: size }}
      className="mx-auto rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300"
    >
      <FaUser className="text-gray-400" />
    </div>
  );
}
