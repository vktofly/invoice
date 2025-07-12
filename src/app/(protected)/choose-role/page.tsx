"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const roles = [
  {
    key: "customer",
    label: "Customer",
    icon: (
      <span className="inline-block text-3xl">🧑‍💼</span>
    ),
    desc: "See and download your invoices."
  },
  {
    key: "vendor",
label: "Vendor",
    icon: (
      <span className="inline-block text-3xl">🏪</span>
    ),
    desc: "Full access to manage invoices and more."
  },
];

export default function ChooseRolePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSelect = async (role: string) => {
    setSelected(role);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to set role");
        setLoading(false);
        return;
      }
      if (role === 'vendor') {
        router.push('/home');
      } else {
        router.push('/customer');
      }
    } catch (err: any) {
      setError(err.message || "Failed to set role");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded shadow p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Choose your role</h1>
        <div className="grid grid-cols-1 gap-4">
          {roles.map((role) => (
            <button
              key={role.key}
              className={`flex items-center gap-4 border rounded-lg p-4 transition-all hover:shadow-md focus:outline-none ${selected === role.key ? "border-indigo-600 bg-indigo-50" : "border-gray-200 bg-white"}`}
              onClick={() => handleSelect(role.key)}
              disabled={loading}
            >
              {role.icon}
              <div className="flex-1 text-left">
                <div className="font-semibold text-lg">{role.label}</div>
                <div className="text-gray-500 text-sm">{role.desc}</div>
              </div>
              {selected === role.key && <span className="text-indigo-600 font-bold">✓</span>}
            </button>
          ))}
        </div>
        {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
        <div className="mt-6 text-center text-gray-400 text-xs">You can change your role later in your profile settings.</div>
      </div>
    </div>
  );
} 