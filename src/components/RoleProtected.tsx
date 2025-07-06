"use client";
import React, { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface RoleProtectedProps {
  allowedRoles: string[];
  children: ReactNode;
}

export default function RoleProtected({ allowedRoles, children }: RoleProtectedProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const role = user?.user_metadata?.role;

  useEffect(() => {
    if (!loading && user && role && !allowedRoles.includes(role)) {
      // Optionally, you could redirect here
      // router.replace("/not-authorized");
    }
  }, [user, loading, role, allowedRoles, router]);

  if (loading) return null;
  if (!user || !role) return null;
  if (!allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded shadow p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold mb-2">Not authorized</h1>
          <p className="text-gray-600 mb-6">You do not have permission to view this page.</p>
          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
            onClick={() => router.push(role === "customer" ? "/customer/invoices" : "/dashboard")}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
} 