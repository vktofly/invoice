# Application Enhancement Roadmap

This document outlines a strategic roadmap for enhancing the Invoicer application. The features and improvements listed below are designed to improve the user experience, expand core functionality, and provide deeper business insights for our users.

---

## 1. User Experience & Interface (UI/UX) Enhancements

These enhancements focus on making the application more polished, modern, and enjoyable to use, directly aligning with the established UI guidelines.

### **Feature: Implement Skeleton Loaders**
-   **Goal:** Provide a smoother, more professional loading experience by replacing jarring "Loading..." text with visual placeholders that mimic the final layout.
-   **Scope:** Affects all data-heavy pages, including the main dashboard, Invoices, Customers, and Products lists.
-   **Implementation Sketch:** Utilize the existing skeleton components (e.g., `InvoicePageSkeleton`) within React `Suspense` boundaries for server components or during client-side data fetching states.
-   **Priority:** High

### **Feature: Create Engaging Empty States**
-   **Goal:** Improve the user experience when no data is present by providing helpful and visually appealing empty state messages.
-   **Scope:** Invoices, Customers, and Products list pages.
-   **Implementation Sketch:** Create a reusable `EmptyState.tsx` component that accepts an icon, title, description, and a primary call-to-action button (e.g., "Create Your First Invoice"). Integrate this into the respective `...ListClient.tsx` components when the data array is empty.
-   **Priority:** Medium

### **Feature: Dashboard Customization**
-   **Goal:** Empower users to personalize their workspace by rearranging dashboard widgets to suit their workflow.
-   **Scope:** The main dashboard page (`/home`).
-   **Implementation Sketch:** Integrate a lightweight drag-and-drop library like `react-beautiful-dnd`. Wrap the dashboard widgets in draggable components and store the user's preferred layout in the database (e.g., in a new JSON field in the `profiles` table).
-   **Priority:** Medium

### **Feature: Consistent Modal Styling**
-   **Goal:** Unify the design of all modal dialogs according to the "Glassmorphism-Lite" style defined in the UI guidelines.
-   **Scope:** All modals, including `AddCustomerModal`, `AddPaymentModal`, etc.
-   **Implementation Sketch:** Create a reusable `Modal.tsx` wrapper component that implements the `backdrop-blur` effect and a standard layout (header, content, footer). Refactor existing modals to use this new wrapper for a consistent look and feel.
-   **Priority:** High

---

## 2. Core Feature Enhancements

These suggestions build upon existing features to make them more powerful and efficient.

### **Feature: Saved Filters & Views**
-   **Goal:** Allow users to save and quickly apply complex filter and sort combinations, saving time on repetitive tasks.
-   **Scope:** Invoices, Customers, and Products list pages.
-   **Implementation Sketch:** Add a "Save View" button to the filter bar. When clicked, store the current filter and sort state in a new `saved_views` database table, linked to the user. Display saved views in a dropdown for one-click access.
-   **Priority:** Medium

### **Feature: Bulk Actions**
-   **Goal:** Increase user efficiency by allowing them to perform actions on multiple items at once.
-   **Scope:** Invoices and Customers list pages.
-   **Implementation Sketch:** Add a checkbox to each table row and a "select all" checkbox in the header. When items are selected, display a contextual action bar with options like "Delete Selected," "Mark as Paid," or "Export CSV."
-   **Priority:** High

### **Feature: Advanced Invoice Templates**
-   **Goal:** Give users more control over their branding and workflow by allowing them to manage a library of invoice templates.
-   **Scope:** A new section within the "Settings" page.
-   **Implementation Sketch:** Create a new page at `/settings/templates` with full CRUD functionality for invoice templates. Users can create, edit, delete, and set a default template. This would expand on the simple "Save as Template" feature.
-   **Priority:** Medium

---

## 3. New High-Impact Features

These are new capabilities that would significantly expand the application's value.

### **Feature: Global Search**
-   **Goal:** Provide a fast and intuitive way for users to find any piece of information from anywhere in the application.
-   **Scope:** A search bar in the main navigation header.
-   **Implementation Sketch:** Create a new search page at `/search`. The global search input would navigate to this page with the query. The search page would then execute parallel queries across invoices, customers, and products, displaying the results in categorized sections.
-   **Priority:** High

### **Feature: Notification Center**
-   **Goal:** Proactively inform users about important events, improving their awareness and engagement.
-   **Scope:** A dropdown panel from the bell icon in the header and a dedicated `/notifications` page.
-   **Implementation Sketch:** Expand the existing `notifications` table schema. Create server-side logic (e.g., database triggers or API endpoints) to generate notifications for events like "Invoice Paid," "Invoice Overdue," etc. Implement a real-time subscription using Supabase Realtime to update the bell icon badge.
-   **Priority:** High

### **Feature: Dedicated Profile & Settings Pages**
-   **Goal:** Provide a centralized location for users to manage their account and application preferences.
-   **Scope:** New pages at `/profile` and `/settings`.
-   **Implementation Sketch:**
    -   **/profile:** A form to update user metadata (name, password, profile picture).
    -   **/settings:** A tabbed interface for managing application-wide settings like theme (light/dark), currency, date format, and notification preferences. Store these preferences in the `profiles` table.
-   **Priority:** Medium

---

## 4. Reporting & Analytics

Leverage the application's data to provide users with valuable insights into their business.

### **Feature: Interactive Reporting Dashboard**
-   **Goal:** Help users understand their business performance through clear and interactive data visualizations.
-   **Scope:** A dedicated `/reports` page.
-   **Implementation Sketch:** Utilize a charting library like `recharts` or `chart.js` to build interactive components for various reports. Create new Supabase database functions to aggregate data efficiently for these reports.
-   **Priority:** Medium

### **Feature: New Report Types**
-   **Goal:** Provide actionable insights that help with accounting and business strategy.
-   **Scope:** New components within the `/reports` page.
-   **Implementation Sketch:**
    -   **Sales by Customer/Product:** Group invoice data to show revenue per customer or product.
    -   **Tax Summary:** Aggregate `tax_amount` from invoices within a date range.
    -   **Profit & Loss:** Requires implementing an "Expenses" feature first. Once done, this report would subtract total expenses from total revenue.
-   **Priority:** Low (dependent on other features)

### **Feature: Exporting Reports**
-   **Goal:** Allow users to use their data outside the application for accounting or further analysis.
-   **Scope:** Add "Export" buttons to the `/reports` page.
-   **Implementation Sketch:** Implement functions to convert report data to CSV format on the client-side. For PDF exports, use `@react-pdf/renderer` to create a printable view of the report.
-   **Priority:** Medium
