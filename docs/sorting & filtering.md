Based on my analysis of the UI guidelines and the code for the Invoices,
  Customers, and Products pages, here is a comprehensive plan to implement the requested
  sorting and filtering features.

  The overall strategy is to enhance the existing client components (...ListClient.tsx)
  with state management for sorting and filtering, ensuring all new UI elements conform to
  the design system specified in new ui guideline.md.

  ---

  Phase 1: Foundational Component & Invoices Page

  This phase focuses on creating a reusable sorting component and implementing the most
  complex feature set on the Invoices page.

   * Step 1: Create Reusable `SortableTableHeader` Component
       * Action: Create a new file src/components/shared/SortableTableHeader.tsx.
       * Details: This component will accept props like title, sortKey, and the current sort
         configuration. It will display the column title and sorting indicators (up/down
         arrows) based on the active sort state. It will also handle the onClick event to
         trigger the sorting logic in its parent component.

   * Step 2: Enhance Invoice Data Fetching
       * Action: Modify src/app/(protected)/invoices/page.tsx.
       * Details: Update the getInvoices function to ensure the is_recurring field is
         included in the Supabase query. This is necessary for the new "Recurring Invoice"
         filter.

   * Step 3: Implement Sorting and Filtering on Invoices Page
       * Action: Modify src/app/(protected)/invoices/InvoiceListClient.tsx.
       * Details:
           1. State Management:
               * Introduce state to manage the table's sort configuration (e.g.,
                 sortConfig). Default the sort to "Issue Date" in descending order.
               * Introduce state to manage the new filters: one for "Recurring Status" (All,
                 Yes, No).
           2. UI Updates:
               * Add a new dropdown filter for "Recurring Status" next to the existing
                 search and status filters.
               * Replace the static <th> elements in the table header with the new
                 SortableTableHeader component for sortable columns like "Invoice #",
                 "Customer", "Date", and "Total".
           3. Logic Implementation:
               * Create a function that updates the sortConfig state when a
                 SortableTableHeader is clicked.
               * Expand the existing filtering logic to account for the new "Recurring
                 Status" filter.
               * Apply the sorting logic to the filtered list of invoices before rendering.

  ---

  Phase 2: Customer Page Enhancement

  This phase applies the established pattern to the Customers page, adding sorting and new
  filtering capabilities.

   * Step 1: Implement Sorting and Filtering on Customers Page
       * Action: Modify src/app/(protected)/customer/CustomerListClient.tsx.
       * Details:
           1. State Management:
               * Add state for sortConfig.
               * Add state for new filters: a search input and a "Customer Type" dropdown
                 (All, Business, Individual).
           2. UI Updates:
               * Add the search and filter inputs above the customer list, styled according
                 to the UI guidelines.
               * Integrate the SortableTableHeader component for all relevant columns (e.g.,
                 "Name", "Email", "Type", "Company").
           3. Logic Implementation:
               * Implement client-side logic to filter customers based on the search term
                 and selected type.
               * Implement client-side sorting logic, similar to the Invoices page.

  ---

  Phase 3: Products Page Enhancement

  Finally, this phase brings sorting and filtering to the Products page.

   * Step 1: Implement Sorting and Filtering on Products Page
       * Action: Modify src/app/(protected)/products/ProductListClient.tsx.
       * Details:
           1. State Management:
               * Add state for sortConfig.
               * Add state for a search filter.
           2. UI Updates:
               * Add a search input above the product list.
               * Integrate the SortableTableHeader component for columns like "Name", "SKU",
                 "Quantity", and "Price".
           3. Logic Implementation:
               * Implement client-side logic to filter products based on the search term
                 (querying Name and SKU).
               * Implement client-side sorting logic.

  ---

  This plan ensures a consistent user experience across all three pages by using a
  reusable component and a unified approach to state management and UI.