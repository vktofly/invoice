1. SSR (Server-Side Rendering) — Should Be Used For:
All list/index pages (e.g., /invoices, /products, /customers, /organizations, /expenses, /time-tracking)
All dashboard pages (admin, user, vendor)
Detail pages (e.g., /invoices/[id], /products/[id], /customers/[id], /organizations/[id]) — unless they require heavy client interactivity

2. CSR (Client-Side Rendering) — Should Be Used For:
Authentication flows (login, signup, password reset)
Highly interactive forms (multi-step wizards, organization setup, edit forms)
Settings pages (user settings, profile settings)
Subcomponents for PDF downloaders, modals, dynamic widgets, etc.

3. Migration Plan
A. SSR Refactor (Convert to SSR if not already)
/landing/page.tsx (if it’s mostly static or marketing, SSR is best)
/invoices/[id]/page.tsx (if possible, otherwise keep CSR for heavy interactivity)
/products/[id]/page.tsx
/customers/[id]/page.tsx
/organizations/[id]/page.tsx
/expenses/[id]/page.tsx
/time-tracking/[id]/page.tsx
/admin/users/[id]/page.tsx
/recurring-invoices/[id]/page.tsx
B. CSR Refactor (Keep or convert to CSR)
/organization-setup/page.tsx (multi-step, local state)
/choose-role/page.tsx (interactive, local state)
/settings/SettingsForm.tsx (user settings)
/invoices/[id]/edit/page.tsx (edit form)
/products/[id]/edit/page.tsx
/customers/[id]/edit/page.tsx
/organizations/[id]/edit/page.tsx
/recurring-invoices/[id]/edit/page.tsx
/admin/users/[id]/edit/page.tsx
/search/page.tsx (if it’s highly interactive)
Any subcomponents for PDF download, modals, etc.

4. Next Steps
For each SSR page:
Remove "use client" at the top.
Refactor to an async function.
Fetch all data server-side (using Supabase SSR utilities).
Only use client components for interactive sub-features.
For each CSR page:
Add "use client" at the top.
Use React hooks for state, effects, and navigation.
Fetch data client-side as needed.