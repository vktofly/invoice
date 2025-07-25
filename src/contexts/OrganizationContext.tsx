"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { Organization } from '@/lib/types';

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
  const [initializing, setInitializing] = useState(true);

  // Load orgs and current org from API/localStorage
  useEffect(() => {
    async function fetchOrgs() {
      setLoading(true);
      setInitializing(true);
      try {
        const res = await fetch("/api/organization");
        const data = await res.json();
        if (res.ok) {
          const orgs = data.organizations || [];
          setOrganizations(orgs);
          
          const savedId = typeof window !== 'undefined' ? localStorage.getItem("currentOrgId") : null;
          let found = null;
          if (savedId) {
            found = orgs.find((o: Organization) => o.id === savedId);
          }
          const newCurrentOrg = found || orgs[0] || null;
          setCurrentOrgState(newCurrentOrg);
        }
      } finally {
        setLoading(false);
        setInitializing(false);
      }
    }
    fetchOrgs();
  }, []);

  // Persist current org in localStorage
  const setCurrentOrg = (org: Organization | null) => {
    setCurrentOrgState(org);
    if (typeof window !== 'undefined') {
      if (org) {
        localStorage.setItem("currentOrgId", org.id);
      } else {
        localStorage.removeItem("currentOrgId");
      }
    }
  };

  return (
    <OrganizationContext.Provider value={{ organizations, setOrganizations, currentOrg, setCurrentOrg, loading: loading || initializing }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganizationContext() {
  const ctx = useContext(OrganizationContext);
  if (!ctx) throw new Error("useOrganizationContext must be used within OrganizationProvider");
  return ctx;
} 