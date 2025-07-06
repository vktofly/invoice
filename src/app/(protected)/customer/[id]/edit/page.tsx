import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomerRegistrationForm from "@/components/CustomerRegistrationForm";

const CustomerEditPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchCustomer() {
      setLoading(true);
      const res = await fetch(`/api/customers/${id}`);
      const data = await res.json();
      setCustomer(data.customer || null);
      setLoading(false);
    }
    fetchCustomer();
  }, [id]);

  const handleSubmit = async (fields: any) => {
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update customer");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update customer");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!customer) return <div className="p-8 text-center text-red-600">Customer not found.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow mt-10">
      <button className="mb-4 text-blue-600 hover:underline" onClick={() => router.back()}>&larr; Back</button>
      <h2 className="text-2xl font-semibold mb-4">Edit Customer</h2>
      <CustomerRegistrationForm initialValues={customer} onSubmit={handleSubmit} isEdit />
      {error && <div className="text-red-600 mt-4">{error}</div>}
      {success && <div className="text-green-600 mt-4">Customer updated successfully!</div>}
    </div>
  );
};

export default CustomerEditPage; 