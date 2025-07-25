# Invoice Page: Implemented Features and Suggestions

## Implemented Features

Based on the analysis of the `InvoiceForm.tsx` component, the following features are currently implemented in the new invoice page:

*   **Invoice Creation and Editing:** The form can be used to create new invoices and edit existing ones.
*   **Customer Management:**
    *   Select existing customers from a dropdown.
    *   Add new customers via a modal without leaving the form.
    *   View the outstanding balance for a selected customer.
*   **Address Management:**
    *   Select billing and shipping addresses from a dropdown for the selected customer.
    *   Add new addresses for a customer via a modal.
    *   Copy the billing address to the shipping address.
*   **Invoice Details:**
    *   Automatically generates the next invoice number.
    *   Set issue date and due date.
    *   Select payment terms (Net 15, 30, 45, 60) or a custom due date.
    *   Select the currency (USD, EUR, GBP, INR).
*   **Line Items:**
    *   Add, edit, and remove line items with description, quantity, unit price, and tax rate.
    *   The total for each line item is calculated automatically.
*   **Calculations:**
    *   Subtotal, total tax, and invoice total are calculated automatically.
    *   The balance due is calculated by adding the invoice total to the customer's outstanding balance.
*   **Customization:**
    *   Add notes to the invoice.
    *   Add a logo URL.
    *   Choose a color theme for the invoice.
    *   Add an authorized signature.
*   **Preview:** A real-time preview of the invoice is available in a separate tab.
*   **Actions:**
    *   Save the invoice as a draft.
    *   Save and send the invoice.

## Suggestions for New Features

Here are some suggestions for new features that could be added to the new invoice page:

### Next Up

*   **Recurring Invoices:**
    *   Add an option to make an invoice recurring.
    *   Allow users to set the frequency of the recurring invoice (e.g., weekly, monthly, quarterly, yearly).
    *   Allow users to set the start and end dates for the recurring invoice.
*   **Discounts:**
    *   Add a field to apply a discount to the entire invoice (either a percentage or a fixed amount).
    *   Add a field to apply a discount to individual line items.
*   **Attachments:**
    *   Allow users to attach files to an invoice (e.g., a timesheet, a project plan, or a contract).
*   **Templates:**
    *   Allow users to save an invoice as a template to be reused later.
    *   Provide a selection of pre-made invoice templates.
*   **Payment Integration:**
    *   Integrate with payment gateways (e.g., Stripe, PayPal) to allow customers to pay the invoice online.
    *   Add a "Pay Now" button to the invoice preview.
*   **Shipping Details:**
    *   Add fields for shipping details, such as the shipping method, tracking number, and shipping costs.
*   **Custom Fields:**
    *   Allow users to add custom fields to the invoice to capture additional information.
*   **Multi-language Support:**
    *   Allow users to create invoices in multiple languages.

### For Later

*   **Real-time Collaboration:**
    *   Allow multiple users to collaborate on an invoice in real-time.
