"use client";

import { updatePassword } from "@/app/(auth)/login/actions";
import { useSearchParams } from "next/navigation";

export default function UpdatePasswordPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 rounded-lg border bg-white p-6 shadow">
        <h1 className="text-xl font-semibold text-center">Set New Password</h1>
        <form action={updatePassword}>
          <input
            type="password"
            name="password"
            placeholder="New password"
            className="w-full rounded border px-3 py-2"
            required
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="mt-4 w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
} 