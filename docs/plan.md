we should consider migrating to @supabase/ssr  │
╰───────────────────────────────────────────────────╯

Here's the updated plan:

   1. Review `src/lib/supabase/server-utils.ts` to be absolutely sure how getUserRole works and if it's
      what I should be using everywhere.
   2. Secure the invoice pages:
       * In src/app/(protected)/invoices/page.tsx, I'll ensure that if the userRole is customer, the
         query to fetch invoices is filtered by the customer's ID. I'll need to get the user's ID for
         this.
       * I'll make sure the "Edit" button/link is hidden from customers on the invoice list and invoice
         details pages. It looks like InvoiceListClient.tsx already does this, but I'll double-check.
       * I'll prevent direct access to the edit page (src/app/(protected)/invoices/[id]/edit/page.tsx)
         for customers. I'll add a role check at the top of the page component, similar to what's done
         in other pages.
   3. Secure the invoice API routes:
       * I'll examine src/app/api/invoices/[id]/route.ts and make sure the PATCH, PUT, and DELETE
         handlers check the user's role. If the user is a customer, the request should be rejected.

  I'll start by reading src/lib/supabase/server-utils.ts.

 