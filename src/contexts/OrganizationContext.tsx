"use client"
import React, { createContext, useContext, useEffect, useState } from "react";

type Organization = {
  id: string;
  name: string;
  industry: string;
  country: string;
  state: string;
  address?: string;
  currency: string;
  language: string;
  timezone: string;
  gst_registered: boolean;
  gst_number?: string;
  created_by: string;
  created_at: string;
  role: string;
};

type OrgContextType = {
  organizations: Organization[];
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>;
  currentOrg: Organization | null;
  setCurrentOrg: (org: Organization | null) => void;
  loading: boolean;
};

const OrganizationContext = createContext<OrgContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrg, setCurrentOrgState] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  // Load orgs and current org from API/localStorage
  useEffect(() => {
    async function fetchOrgs() {
      setLoading(true);
      try {
        const res = await fetch("/api/organization");
        const data = await res.json();
        if (res.ok) {
          setOrganizations(data.organizations || []);
          // Try to restore from localStorage
          const savedId = typeof window !== 'undefined' ? localStorage.getItem("currentOrgId") : null;
          let found = null;
          if (savedId) {
            found = (data.organizations || []).find((o: Organization) => o.id === savedId);
          }
          setCurrentOrgState(found || (data.organizations?.[0] || null));
        }
      } finally {
        setLoading(false);
      }
    }
    fetchOrgs();
  }, []);

  // Persist current org in localStorage
  const setCurrentOrg = (org: Organization | null) => {
    setCurrentOrgState(org);
    if (typeof window !== 'undefined') {
      if (org) localStorage.setItem("currentOrgId", org.id);
      else localStorage.removeItem("currentOrgId");
    }
  };

  return (
    <OrganizationContext.Provider value={{ organizations, setOrganizations, currentOrg, setCurrentOrg, loading }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganizationContext() {
  const ctx = useContext(OrganizationContext);
  if (!ctx) throw new Error("useOrganizationContext must be used within OrganizationProvider");
  return ctx;
} 