"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function OrganizationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params?.id as string;
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId) return;
    async function fetchOrg() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/organization");
        const data = await res.json();
        if (res.ok) {
          const found = (data.organizations || []).find((o: any) => o.id === orgId);
          if (found) {
            setOrg(found);
          } else {
            setError("Organization not found or you do not have access.");
          }
        } else {
          setError(data.error || "Failed to fetch organization.");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrg();
  }, [orgId]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button
        className="mb-6 text-blue-600 hover:underline"
        onClick={() => router.push("/organizations")}
      >
        &larr; Back to Organizations
      </button>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : org ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{org.name}</h1>
            {org.role === "admin" && (
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded font-semibold hover:bg-indigo-700"
                onClick={() => router.push(`/organizations/${org.id}/edit`)}
              >
                Edit Organization
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-gray-600 text-sm">Industry</div>
              <div className="font-medium">{org.industry}</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm">Country</div>
              <div className="font-medium">{org.country}</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm">State/Union Territory</div>
              <div className="font-medium">{org.state}</div>
            </div>
            {org.address && (
              <div className="md:col-span-2">
                <div className="text-gray-600 text-sm">Address</div>
                <div className="font-medium">{org.address}</div>
              </div>
            )}
            <div>
              <div className="text-gray-600 text-sm">Currency</div>
              <div className="font-medium">{org.currency}</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm">Language</div>
              <div className="font-medium">{org.language}</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm">Time Zone</div>
              <div className="font-medium">{org.timezone}</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm">GST Registered</div>
              <div className="font-medium">{org.gst_registered ? "Yes" : "No"}</div>
            </div>
            {org.gst_number && (
              <div>
                <div className="text-gray-600 text-sm">GST Number</div>
                <div className="font-medium">{org.gst_number}</div>
              </div>
            )}
            <div>
              <div className="text-gray-600 text-sm">Created At</div>
              <div className="font-medium">{new Date(org.created_at).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm">Your Role</div>
              <div className="font-medium">{org.role}</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
} 