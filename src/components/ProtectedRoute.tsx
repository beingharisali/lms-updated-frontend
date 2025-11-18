// // /components/ProtectedRoute.tsx
// "use client";
// import React, { ReactNode, useEffect } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { useRouter } from "next/navigation";
// import type { UserRole } from "@/types/user";

// interface Props {
//   allowedRoles?: UserRole[];
//   children: ReactNode;
// }

// export default function ProtectedRoute({ allowedRoles, children }: Props) {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (loading) return;
//     if (!user) {
//       const current =
//         typeof window !== "undefined" ? window.location.pathname : "/";
//       if (current.startsWith("/admin")) router.replace("/admin");
//       else if (current.startsWith("/student")) router.replace("/student");
//       else if (current.startsWith("/instructor")) router.replace("/instructor");
//       else if (current.startsWith("/staff")) router.replace("/staff");
//       else router.replace("/");
//       return;
//     }
//     if (allowedRoles && !allowedRoles.includes(user.role)) {
//       router.replace("/");
//       return;
//     }
//   }, [user, loading, allowedRoles, router]);

//   if (loading) return <p>Loading...</p>;
//   if (!user) return null;
//   if (allowedRoles && !allowedRoles.includes(user.role)) return null;
//   return <>{children}</>;
// }

"use client";
import React, { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/types/user";

interface Props {
  allowedRoles?: UserRole[];
  children: ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace("/");
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
