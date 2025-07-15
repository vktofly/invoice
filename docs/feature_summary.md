# Application Feature Summary

This document provides a clear overview of the features currently implemented in the Invoicer application and a list of suggested features for future development.

## Implemented Features

This section details the functionality that is already built and integrated into the application.

### Core Functionality
- **Dashboard:** A comprehensive overview of business metrics, including invoice statuses, recent activities, and quick actions.
- **Customer Management:** Full CRUD (Create, Read, Update, Delete) capabilities for managing clients.
- **Product Management:** Ability to create and manage a list of products or services.
- **User & Organization Management:** Secure user authentication, profile management, and support for creating and managing organizations.
- **Role-Based Access:** Routes and components are protected based on user roles (e.g., user, vendor, customer).
- **Global Search:** A functional search bar in the navigation to find invoices, customers, and products across the application.

### Invoice Management
- **Full Invoice Lifecycle:** Create, edit, view, and delete invoices.
- **Dynamic Form:** A single, powerful form for both creating and editing invoices.
- **PDF Generation:** Ability to download and share professional PDF versions of invoices.
- **Invoice Numbering:** Automatic generation of sequential invoice numbers.
- **Status Tracking:** Invoices can be saved as `draft` or marked as `sent`, with statuses like `paid` and `overdue` handled by the system.

### Advanced Invoice Features
- **Invoice Templates:** Users can save any invoice as a template and then create new invoices based on saved templates to save time.
- **Line Item Management:** Add, edit, and remove line items with descriptions, quantities, unit prices, and tax rates.
- **Discounts:** Apply discounts at both the individual line-item level and the overall invoice level (fixed amount or percentage).
- **Shipping Details:** Add shipping method, tracking number, and shipping costs to invoices.
- **Custom Fields:** Add custom key-value pairs to invoices to capture extra information.
- **Attachments:** Upload and associate files (like contracts or timesheets) with an invoice.
- **Recurring Invoices (UI):** The user interface allows for setting up the schedule and details for recurring invoices.

---

## Suggested New Features

This section lists potential new features to enhance the application, categorized by priority.

### High Priority
- **Recurring Invoices (Backend Automation):**
  - **Description:** While the UI for creating recurring profiles exists, the backend mechanism to automatically generate these invoices on schedule (e.g., via a daily cron job) needs to be built. This is the critical next step to complete the feature.
- **Online Payment Integration (Stripe/PayPal):**
  - **Description:** Integrate a payment gateway to allow clients to pay their invoices directly online with a credit card. This involves adding a "Pay Now" button to the public invoice view, creating payment intents, and handling webhooks to update the invoice status automatically.
- **Expense Tracking:**
  - **Description:** Introduce a new module for users to log, categorize, and manage their business expenses. This would allow for better financial tracking and profitability analysis.
- **Estimates & Quotes:**
  - **Description:** Create a system for sending estimates or quotes to clients, which can then be approved and converted into an invoice with a single click.
- **Enhanced Notification System:**
  - **Description:** Build a dedicated notification center page and expand the types of notifications (e.g., "Invoice Viewed by Client," "Payment Failed," "Template Created").
- **Advanced Reporting:**
  - **Description:** Enhance the existing reporting section with more detailed analytics, such as profit/loss statements, sales tax summaries, and client-specific revenue reports.

### Medium Priority
- **Multi-Language Support:**
  - **Description:** Internationalize the application to support multiple languages for both the UI and the generated invoices.
- **Dashboard Customization:**
  - **Description:** Allow users to rearrange or hide widgets on their dashboard for a more personalized experience.

### Low Priority / Long-Term
- **Real-time Collaboration:**
  - **Description:** A complex feature that would allow multiple team members to edit an invoice simultaneously.