# Invoice Rendering Architecture Plan

This document outlines the robust plan for creating a consistent and unified invoice rendering system across the application.

## 1. The Problem

Currently, the invoice preview in the `InvoiceForm`, the final web view of a saved invoice, and the downloaded PDF are generated using separate, unlinked codebases. This leads to visual inconsistencies and makes maintenance difficult. Any change to the invoice's appearance must be manually replicated in multiple places, which is inefficient and error-prone.

## 2. The Solution: A Single Source of Truth

The solution is to establish a **single source of truth** for the invoice's visual representation. This will be achieved by creating a central, reusable React component that is used everywhere an invoice needs to be displayed.

## 3. Implementation Steps

### Step 1: Create the `InvoiceTemplate` Component

-   **Location:** `src/components/invoice/InvoiceTemplate.tsx`
-   **Purpose:** This will be a purely presentational ("headless") component.
-   **Responsibilities:**
    -   Accept all necessary invoice data (customer details, line items, totals, taxes, notes, company logo, etc.) as props.
    -   Contain all the JSX and Tailwind CSS required to render a professional-looking invoice.
    -   Adhere strictly to the project's `ui-guidelines.md`. For PDF/print media, it will use solid backgrounds instead of glassmorphism to ensure readability.
    -   It will contain **no business logic**, state hooks, or data-fetching logic.

### Step 2: Integrate `InvoiceTemplate` into the `InvoiceForm` Preview

-   **Location:** `src/components/invoice/InvoiceForm.tsx`
-   **Action:** The "Preview" tab will be refactored.
-   **Implementation:**
    -   The existing preview rendering logic will be removed.
    -   The new `InvoiceTemplate` component will be rendered in its place.
    -   The live data from the form's state will be passed directly as props to the `InvoiceTemplate`.
    -   **Benefit:** This provides a real-time, pixel-perfect preview of the final invoice.

### Step 3: Unify the Invoice View Page

-   **Location:** `src/app/(protected)/invoices/[id]/page.tsx`
-   **Action:** The main content area of the page will be refactored to use the new template.
-   **Implementation:**
    -   The page will fetch all necessary data for the specific invoice.
    -   The existing, disparate rendering logic will be removed.
    -   The fetched data will be passed as props to the `InvoiceTemplate` component.
    -   **Benefit:** The dedicated page for viewing a saved invoice will now be visually identical to the form preview and the PDF, creating a seamless user experience.

### Step 4: Align PDF Generation with the Template

-   **Location:** `src/app/(protected)/invoices/[id]/InvoicePDF.tsx`
-   **Action:** The PDF generation component will be visually aligned with the `InvoiceTemplate`.
-   **Implementation:**
    -   Because `@react-pdf/renderer` uses a different technology (React components mapping to PDF primitives, not HTML), we cannot use the `InvoiceTemplate` directly.
    -   Instead, the styles and structure of `InvoicePDF.tsx` will be manually updated to mirror the appearance of `InvoiceTemplate.tsx` as closely as possible.
    -   This involves translating Tailwind CSS concepts to the StyleSheet objects used by the PDF renderer.
-   **Integration:**
    -   The "Download PDF" buttons in `InvoiceActions.tsx` and `InvoiceDetailActions.tsx` will continue to use the `InvoicePDF` component, which now produces a visually consistent output.


## 4. Benefits of this Architecture

-   **Consistency:** The invoice will look identical everywhere, eliminating user confusion.
-   **Maintainability:** To update the invoice design, we only need to edit the `InvoiceTemplate.tsx` file. The changes will automatically apply to the preview, web view, and PDF.
-   **Scalability:** This component-based approach is clean, follows React best practices, and is easy to extend in the future.
-   **Reduced Code:** It removes redundant rendering logic, leading to a smaller, more efficient codebase.
