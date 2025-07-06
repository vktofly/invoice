import React, { useEffect, useState } from "react";
import Link from "next/link";
// import { HiOutlineUserAdd } from "react-icons/hi"; // Removed to fix linter error

interface Customer {
  id: string;
  name?: string;
  email: string;
  customer_type?: string;
  company_name?: string;
  display_name?: string;
}

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        const res = await fetch("/api/customers");
        const data = await res.json();
        setCustomers(data.customers || []);
      } catch {
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const hasCustomers = customers && customers.length > 0;

  const handleView = (id: string) => {
    window.location.href = `/customer/${id}`;
  };
  const handleEdit = (id: string) => {
    window.location.href = `/customer/${id}/edit`;
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
      const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCustomers((prev) => prev ? prev.filter((c) => c.id !== id) : prev);
      } else {
        alert('Failed to delete customer');
      }
    } catch {
      alert('Failed to delete customer');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-2">Business is no fun without people.</h2>
        <p className="text-gray-600 mb-6 text-center">Create and manage your contacts, all in one place.</p>
        <Link href="/customer/new">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center gap-2 mb-2">
            <span className="text-lg">➕</span>
            CREATE NEW CUSTOMER
          </button>
        </Link>
        <Link href="#" className="text-blue-600 hover:underline mb-4 text-sm">Click here to import customers from file</Link>
        <div className="flex gap-2 mb-8">
          {/* Social/other icons can be added here if needed */}
        </div>
      </div>
      <div className="w-full max-w-3xl mt-12">
        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading customers...</div>
        ) : hasCustomers ? (
          <div>
            <h3 className="text-lg font-semibold text-center mb-6">Your Customers</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Company</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} className="border-b">
                      <td className="px-4 py-2">{c.display_name || c.name}</td>
                      <td className="px-4 py-2">{c.email}</td>
                      <td className="px-4 py-2">{c.customer_type}</td>
                      <td className="px-4 py-2">{c.company_name}</td>
                      <td className="px-4 py-2">
                        <button className="text-blue-600 hover:underline mr-2" onClick={() => handleView(c.id)}>View</button>
                        <button className="text-yellow-600 hover:underline mr-2" onClick={() => handleEdit(c.id)}>Edit</button>
                        <button className="text-red-600 hover:underline" onClick={() => handleDelete(c.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-center mb-6">Types of contacts</h3>
            <div className="flex justify-center gap-12">
              <div className="border rounded-lg p-6 w-64 flex flex-col items-center bg-white shadow">
                <div className="text-3xl mb-2">🏢</div>
                <div className="font-medium mb-2">COMPANY</div>
                <ul className="text-gray-600 text-sm mb-2">
                  <li>CONTACT PERSON 1</li>
                  <li>CONTACT PERSON 2</li>
                  <li>CONTACT PERSON 3</li>
                </ul>
              </div>
              <div className="border rounded-lg p-6 w-64 flex flex-col items-center bg-white shadow">
                <div className="text-3xl mb-2">👤</div>
                <div className="font-medium mb-2">An individual person or a company can be added as a customer.</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomersPage; 