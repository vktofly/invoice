"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const industries = [
  "IT Services",
  "Retail",
  "Manufacturing",
  "Healthcare",
  "Education",
  "Finance",
  "Other",
];
const countries = ["India", "United States", "United Kingdom", "Australia", "Canada"];
const statesIndia = [
  "Andhra Pradesh",
  "Delhi",
  "Karnataka",
  "Maharashtra",
  "Tamil Nadu",
  "Uttar Pradesh",
  "West Bengal",
  // ...add more as needed
];
const currencies = [
  { code: "INR", label: "INR - Indian Rupee" },
  { code: "USD", label: "USD - US Dollar" },
  { code: "EUR", label: "EUR - Euro" },
];
const languages = ["English", "Hindi", "French", "Spanish"];
const timezones = [
  "(GMT 5:30) India Standard Time (Asia/Calcutta)",
  "(GMT 0:00) Greenwich Mean Time (GMT)",
  "(GMT -5:00) Eastern Time (US & Canada)",
];

export default function EditOrganizationPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params?.id as string;
  const [form, setForm] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
            setForm({ ...found });
            setRole(found.role);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const validate = () => {
    if (!form.name) return "Organization Name is required.";
    if (!form.industry) return "Industry is required.";
    if (!form.country) return "Country is required.";
    if (!form.state) return "State/Union Territory is required.";
    if (!form.currency) return "Currency is required.";
    if (!form.language) return "Language is required.";
    if (!form.timezone) return "Time zone is required.";
    if (form.gst_registered && !form.gst_number) return "GST Number is required if GST is registered.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setSaving(false);
      return;
    }
    try {
      const res = await fetch(`/api/organization/${orgId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Organization updated successfully!");
        router.push(`/organizations/${orgId}`);
      } else {
        setError(data.error || "Failed to update organization.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto py-8 px-4">Loading...</div>;
  }
  if (error) {
    return <div className="max-w-3xl mx-auto py-8 px-4 text-red-600">{error}</div>;
  }
  if (role !== "admin") {
    return <div className="max-w-3xl mx-auto py-8 px-4 text-red-600">You do not have permission to edit this organization.</div>;
  }
  if (!form) return null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button
        className="mb-6 text-blue-600 hover:underline"
        onClick={() => router.push(`/organizations/${orgId}`)}
      >
        &larr; Back to Organization
      </button>
      <h1 className="text-2xl font-bold mb-4">Edit Organization</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Organization Name */}
        <div>
          <label className="block font-medium mb-1">Organization Name<span className="text-red-500">*</span></label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            placeholder="Enter organization name"
          />
        </div>
        {/* Industry */}
        <div>
          <label className="block font-medium mb-1">Industry<span className="text-red-500">*</span></label>
          <select
            name="industry"
            value={form.industry}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
          >
            <option value="">Select Industry</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>
        {/* Location and State */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">Organization Location<span className="text-red-500">*</span></label>
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            >
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">State/Union Territory<span className="text-red-500">*</span></label>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            >
              <option value="">Select State</option>
              {form.country === "India" && statesIndia.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Address */}
        <div>
          <label className="block font-medium mb-1">Address</label>
          <textarea
            name="address"
            value={form.address || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            placeholder="Enter organization address"
            rows={2}
          />
        </div>
        {/* Currency and Language */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">Currency<span className="text-red-500">*</span></label>
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">Language<span className="text-red-500">*</span></label>
            <select
              name="language"
              value={form.language}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            >
              {languages.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Time Zone */}
        <div>
          <label className="block font-medium mb-1">Time Zone<span className="text-red-500">*</span></label>
          <select
            name="timezone"
            value={form.timezone}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
        {/* GST Toggle */}
        <div className="flex items-center gap-2">
          <label className="font-medium">Is this business registered for GST?</label>
          <input
            type="checkbox"
            name="gst_registered"
            checked={!!form.gst_registered}
            onChange={handleChange}
            className="toggle-checkbox"
          />
          <span>{form.gst_registered ? "Yes" : "No"}</span>
        </div>
        {/* GST Number (conditional) */}
        {form.gst_registered && (
          <div>
            <label className="block font-medium mb-1">GST Number<span className="text-red-500">*</span></label>
            <input
              name="gst_number"
              value={form.gst_number || ""}
              onChange={handleChange}
              required={form.gst_registered}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              placeholder="Enter GST Number"
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 mt-4"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {message && <div className="text-green-600 mt-2">{message}</div>}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  );
} 