'use client';

import { useState, useEffect } from 'react';
import { useOrganizationContext } from '@/contexts/OrganizationContext';
import { useRouter } from 'next/navigation';

export default function OrganizationSetup() {
  const { organizations, currentOrg, setCurrentOrg, setOrganizations } = useOrganizationContext();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    industry: '',
    country: '',
    state: '',
    currency: 'USD',
    language: 'en',
    timezone: 'UTC',
    gst_registered: false,
    gst_number: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (currentOrg) {
      setFormData({
        name: currentOrg.name || '',
        address: currentOrg.address || '',
        industry: currentOrg.industry || '',
        country: currentOrg.country || '',
        state: currentOrg.state || '',
        currency: currentOrg.currency || 'USD',
        language: currentOrg.language || 'en',
        timezone: currentOrg.timezone || 'UTC',
        gst_registered: currentOrg.gst_registered || false,
        gst_number: currentOrg.gst_number || '',
      });
    }
  }, [currentOrg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const method = currentOrg ? 'PUT' : 'POST';
      const res = await fetch('/api/organization', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (method === 'POST') {
        setOrganizations([...organizations, data.organization]);
      } else {
        const updatedOrgs = organizations.map(org =>
          org.id === data.organization.id ? data.organization : org
        );
        setOrganizations(updatedOrgs);
      }
      
      setCurrentOrg(data.organization);
      router.push('/home'); // Redirect to a relevant page after setup
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {currentOrg ? 'Update Your Organization' : 'Setup Your Organization'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Organization Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input mt-1 block w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Address
          </label>
          <input
            type="text"
            name="address"
            id="address"
            value={formData.address}
            onChange={handleInputChange}
            className="input mt-1 block w-full"
          />
        </div>
        {/* Add other fields similarly */}
        <div className="flex justify-end">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Organization'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </form>
    </div>
  );
}
