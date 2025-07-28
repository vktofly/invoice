# SSR vs CSR Strategy for Next.js/Supabase App

## Principles
- **SSR (Server-Side Rendering)** is preferred for:
  - Pages that display data on initial load (dashboards, lists, details)
  - Pages requiring authentication/authorization before rendering
  - SEO-sensitive pages
  - Pages where fast first paint and up-to-date data are important
- **CSR (Client-Side Rendering)** is used for:
  - Highly interactive forms, wizards, or flows with lots of local state
  - Pages/components that require real-time updates or websockets
  - Pages that must access browser APIs (localStorage, window, etc.)
  - Subcomponents that handle modals, PDF downloads, or client-only UI

## SSR: Should Be Used For
- All main dashboard pages (admin, user, vendor)
- List/index pages (invoices, products, customers, organizations, expenses, time-tracking, etc.)
- Detail pages where possible (e.g., `/invoices/[id]`, `/products/[id]`, `/customers/[id]`), unless they require heavy client interactivity
- Any page that needs to check user role/permissions before rendering
- Any page where SEO or fast load is important

## CSR: Should Be Used For
- Authentication flows (login, signup, password reset)
- Highly interactive forms (multi-step wizards, organization setup, etc.)
- Settings forms that require instant feedback or local state
- Pages/components that use browser APIs (localStorage, notifications, etc.)
- Subcomponents for PDF downloaders, modals, or dynamic widgets
- Real-time dashboards or chat (if needed)

## Recommended File Patterns
- **Pages:** Default to SSR (no `"use client"` at the top). Use async server components and fetch data server-side.
- **Components:** Use `"use client"` only for components that need it. Import them into SSR pages as children.
- **Forms:** If a form is simple, SSR is fine. If it needs lots of local state or instant feedback, make it a client component.

## Example Mapping
| Page/Component                        | SSR/CSR | Rationale                                      |
|---------------------------------------|---------|------------------------------------------------|
| `/admin`, `/organizations`, `/invoices`| SSR     | Data-driven, needs auth, fast load              |
| `/invoices/[id]`                      | SSR     | Detail page, can fetch data server-side         |
| `/invoices/[id]/edit`                 | CSR     | Interactive form, lots of local state           |
| `/organization-setup`                 | CSR     | Multi-step, local state, uses browser APIs      |
| `/settings`                           | CSR     | User settings, instant feedback                 |
| PDF Downloaders, Modals               | CSR     | Client-only features                            |

## Migration Checklist
- [ ] Remove `"use client"` from all pages that do not need it
- [ ] Move all data fetching to server-side in SSR pages
- [ ] Only use client hooks in components with `"use client"`
- [ ] Use SSR for all list/detail pages unless interactivity requires CSR
- [ ] Use CSR for forms, wizards, and client-only features

## Rationale
- SSR improves performance, SEO, and security for most pages
- CSR is reserved for highly interactive or browser-dependent features
- This hybrid approach gives the best user experience and maintainability

---

**For future development:**
- Default to SSR for new pages
- Use CSR only when necessary (forms, modals, real-time, browser APIs)
- Review existing pages regularly to ensure correct rendering strategy 