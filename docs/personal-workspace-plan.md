# Plan: Implementing Personal Workspaces

This document outlines the strategy for allowing new users to create invoices immediately upon signup, without being forced to manually create an "organization." This will be achieved by automatically generating a default "Personal Workspace" for every new user.

## 1. The Goal

The primary objective is to improve the onboarding experience for freelancers, sole proprietors, and individual users. A new user should be able to sign up and start creating invoices seamlessly.

## 2. The Strategy: Automatic Personal Workspace Creation

Instead of allowing `organization_id` to be `null` on invoices, which would introduce significant code complexity, we will ensure every user belongs to at least one organization.

-   **Automatic Creation:** When a new user is created in the `auth.users` table, a corresponding "personal" organization will be automatically generated for them in the `organizations` table.
-   **Naming Convention:** This default organization will be named using the user's identity (e.g., "[User's Email]'s Workspace").
-   **Data Integrity:** This approach ensures that every invoice can always be associated with an `organization_id`, preserving data integrity and simplifying application logic. All components and hooks that rely on `currentOrg` will continue to work as expected.

## 3. Implementation Steps

### Step 1: Create a Database Function

A new SQL function will be created. This function will contain the logic to insert a new record into the `public.organizations` table.

-   **Name:** `create_personal_organization()`
-   **Trigger:** It will be triggered by the `NEW` record in `auth.users`.
-   **Logic:** It will extract the new user's ID and email from the `NEW` record and use them to create the organization entry. The `created_by` field will be set to the new user's ID.

### Step 2: Create a Database Trigger

A trigger will be attached to the `auth.users` table.

-   **Name:** `on_new_user_create_personal_organization`
-   **Event:** It will fire `AFTER INSERT` on `auth.users`.
-   **Action:** For each new row (user), it will execute the `create_personal_organization()` function.

### Step 3: Update Application Logic (If Necessary)

The existing application code is already well-positioned to handle this change.

-   `OrganizationContext`: This context already fetches all organizations a user belongs to. The new personal workspace will be fetched automatically on the user's first login.
-   `InvoiceForm`: The check that requires an organization to exist before creating an invoice will now pass by default for new users, as they will have a `currentOrg` from their personal workspace.

## 4. User Experience

-   **Onboarding:** A new user signs up and is immediately able to use the application's core features.
-   **Organization Setup Page:** The `/organization-setup` page will now act as a "Profile" or "Business Details" page for users editing their personal workspace. They can update their name, address, etc., which will then appear on their invoices.
-   **Scalability:** If a user later wishes to create a formal, multi-user organization or is invited to another, the system will already support it. They will simply switch between their personal workspace and other organizations.
