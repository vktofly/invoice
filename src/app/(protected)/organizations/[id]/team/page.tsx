"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrganizationContext } from '@/contexts/OrganizationContext';

const ROLES = ["admin", "member"];

export default function TeamPage() {
  const params = useParams();
  const orgId = params?.id as string;
  const router = useRouter();
  const { organizations, currentOrg } = useOrganizationContext();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // user id
  const [message, setMessage] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!orgId) return;
    async function fetchMembers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/organization/${orgId}/members`);
        const data = await res.json();
        if (res.ok) {
          setMembers(data.members || []);
          // Check if current user is admin
          const me = data.members.find((m: any) => m.email === currentOrg?.role ? currentOrg.role : null);
          setIsAdmin(currentOrg?.role === 'admin');
        } else {
          setError(data.error || "Failed to fetch members.");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, [orgId, currentOrg]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/organization/${orgId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setMembers(data.members || []);
        setMessage("Invitation sent!");
        setInviteEmail("");
        setInviteRole("member");
      } else {
        setError(data.error || "Failed to invite user.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRoleChange = async (user_id: string, newRole: string) => {
    setActionLoading(user_id);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/organization/${orgId}/members`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, action: "update_role", role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setMembers(data.members || []);
        setMessage("Role updated.");
      } else {
        setError(data.error || "Failed to update role.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemove = async (user_id: string) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    setActionLoading(user_id);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/organization/${orgId}/members`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, action: "remove" }),
      });
      const data = await res.json();
      if (res.ok) {
        setMembers(data.members || []);
        setMessage("Member removed.");
      } else {
        setError(data.error || "Failed to remove member.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button
        className="mb-6 text-blue-600 hover:underline"
        onClick={() => router.push(`/organizations/${orgId}`)}
      >
        &larr; Back to Organization
      </button>
      <h1 className="text-2xl font-bold mb-4">Team Management</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600 mb-4">{error}</div>
      ) : (
        <>
          {isAdmin && (
            <form onSubmit={handleInvite} className="mb-6 flex flex-col md:flex-row gap-2 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Invite by Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  className="border rounded px-3 py-2 focus:outline-none focus:ring"
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
                disabled={inviteLoading}
              >
                {inviteLoading ? "Inviting..." : "Invite"}
              </button>
            </form>
          )}
          {message && <div className="text-green-600 mb-2">{message}</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded bg-white">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Role</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
                  {isAdmin && <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.email} className="border-t">
                    <td className="px-4 py-2">{member.email}</td>
                    <td className="px-4 py-2">
                      {isAdmin && member.status === 'active' ? (
                        <select
                          value={member.role}
                          onChange={e => handleRoleChange(member.id, e.target.value)}
                          disabled={actionLoading === member.id}
                          className="border rounded px-2 py-1"
                        >
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      ) : (
                        <span className="capitalize">{member.role}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 capitalize">{member.status}</td>
                    {isAdmin && (
                      <td className="px-4 py-2">
                        {member.status === 'active' && (
                          <button
                            onClick={() => handleRemove(member.id)}
                            disabled={actionLoading === member.id}
                            className="text-red-600 hover:underline mr-2"
                          >
                            Remove
                          </button>
                        )}
                        {member.status === 'invited' && (
                          <span className="text-gray-400">Pending invite</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
} 