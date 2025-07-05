"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrgs() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/organization");
        const data = await res.json();
        if (res.ok) {
          setOrganizations(data.organizations || []);
        } else {
          setError(data.error || "Failed to fetch organizations.");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrgs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Organizations</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
          onClick={() => router.push("/organization-setup")}
        >
          + New Organization
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : organizations.length === 0 ? (
        <div>No organizations found. Create one to get started!</div>
      ) : (
        <div className="space-y-4">
          {organizations.map((org) => (
            <div key={org.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between bg-white shadow-sm">
              <div>
                <div className="text-lg font-semibold">{org.name}</div>
                <div className="text-gray-600 text-sm">{org.industry} &bull; {org.country}</div>
                <div className="text-xs text-gray-500 mt-1">Role: <span className="font-medium">{org.role}</span></div>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded font-semibold hover:bg-indigo-700"
                  onClick={() => router.push(`/organizations/${org.id}`)}
                >
                  Go to Organization
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 