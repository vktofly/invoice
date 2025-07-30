"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { Organization } from '@/lib/types';
import { useAuth } from "./AuthContext";

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
  const { user, loading: authLoading } = useAuth();

  // Load orgs and current org from API/localStorage
  useEffect(() => {
    async function fetchOrgs() {
      if (!user) {
        setOrganizations([]);
        setCurrentOrgState(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/organization");
        if (!res.ok) {
          // If the response is not OK, it could be a 401 or other error.
          // We clear the orgs and stop loading.
          setOrganizations([]);
          setCurrentOrgState(null);
          return;
        }

        const data = await res.json();
        const orgs = data.organizations || [];
        setOrganizations(orgs);
        
        const savedId = typeof window !== 'undefined' ? localStorage.getItem("currentOrgId") : null;
        let found = null;
        if (savedId) {
          found = orgs.find((o: Organization) => o.id === savedId);
        }
        const newCurrentOrg = found || orgs[0] || null;
        setCurrentOrgState(newCurrentOrg);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchOrgs();
    }
  }, [user, authLoading]);

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
    <OrganizationContext.Provider value={{ organizations, setOrganizations, currentOrg, setCurrentOrg, loading }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganizationContext() {
  const ctx = useContext(OrganizationContext);
  if (!ctx) {
    // Return a default/mock context if the provider is not in the tree
    return {
      organizations: [],
      setOrganizations: () => {},
      currentOrg: null,
      setCurrentOrg: () => {},
      loading: false,
    };
  }
  return ctx;
} 