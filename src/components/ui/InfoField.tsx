// src/components/ui/InfoField.tsx
"use client";
import React from "react";

interface InfoFieldProps {
  label: string;
  value?: React.ReactNode;
}

export default function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div>
      <p className="text-gray-600 font-medium">{label}</p>
      <p className="text-gray-800 break-words">{value ?? "-"}</p>
    </div>
  );
}
