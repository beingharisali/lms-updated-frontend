import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Instructor Portal",
  description: "Instructor dashboard",
};

export default function InstructorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#eff6f9] p-4">
        {children}
      </div>
    </AuthProvider>
  );
}
