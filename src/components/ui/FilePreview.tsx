// src/components/ui/FilePreview.tsx
"use client";
import React from "react";
import { FaFilePdf, FaFileImage, FaFile, FaDownload } from "react-icons/fa";

interface FilePreviewProps {
  file?: string | { url?: string; name?: string };
  label?: string;
}

export default function FilePreview({ file, label }: FilePreviewProps) {
  if (!file) return null;
  const fileUrl = typeof file === "string" ? file : file.url || "";
  const fileName =
    typeof file === "string"
      ? label || file.split("/").pop()
      : file.name || label;
  const ext = (fileName || "").split(".").pop()?.toLowerCase() ?? "";
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
  const isPdf = ext === "pdf";

  return (
    <div className="mb-4">
      <p className="text-gray-600 font-medium mb-2">{label}</p>
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
        {isImage ? (
          <FaFileImage className="text-blue-500 text-xl" />
        ) : isPdf ? (
          <FaFilePdf className="text-red-500 text-xl" />
        ) : (
          <FaFile className="text-gray-500 text-xl" />
        )}
        <span className="text-sm text-gray-700 flex-1 truncate">
          {fileName}
        </span>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
        >
          <FaDownload className="text-xs" /> View
        </a>
      </div>
    </div>
  );
}
