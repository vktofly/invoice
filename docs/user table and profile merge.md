 Explanation

  Current Situation:

  Right now, our user data is split across three tables:

   1. auth.users: The core Supabase table for authentication (email, password, etc.). We don't touch this directly.
   2. public.profiles: Contains application-specific data like full_name, theme, and the organization_id we just added.
   3. public.user_roles: Contains only the user_id and their role.

  The main problem with this setup is that to get a complete picture of a user (e.g., their role and their organization), we
  have to perform two separate database queries. This is exactly what caused the bug on the /post-login page. This approach
  is inefficient and makes the code more complex and prone to errors.

  Proposed Simplification:

  I propose we merge the user_roles table into the profiles table.

  The new structure would be:

   1. auth.users: (No change)
   2. public.profiles: Would now contain id, full_name, organization_id, and the new role column.

  Benefits of this change:

   * Efficiency: We can get all of a user's application data (profile info, organization, and role) in a single database query.
   * Simplicity: The code will be much cleaner and easier to understand. We'll only need to interact with one table (profiles)
     for all user-related data.
   * Robustness: This eliminates the class of bugs we've been fighting, where we forget to query one of the tables and get
     incomplete data.

  Step-by-Step Plan


  If you agree, here is the plan I will follow to implement this simplification safely:

   1. Create a Database Migration: I will write a new SQL migration file to:
       * Add a role column to the profiles table.
       * Copy the existing roles from user_roles into the new role column in profiles.
       * Safely drop the user_roles table.

   2. Update `db.ts` Type Definitions: I will update the src/types/db.ts file to reflect the new database schema (adding role
      to profiles and removing user_roles).

   3. Update Server-Side Code: I will find all instances where user_roles is used in the code and update them to use the
      profiles table instead. This will primarily affect:
       * src/app/(auth)/login/actions.ts: The signUp function will now insert the role directly into the profiles table.
       * src/lib/supabase/server-utils.ts: The getUserRole function will be updated to get the role from the profiles table.

   4. Update Client-Side Code: I will update any components that reference user_roles, such as the
      src/app/(protected)/post-login/page.tsx we just fixed, to use the new, simpler data structure.

  This is a significant but very beneficial refactoring. By explaining it first, I want to ensure you're comfortable with
  the approach before I proceed.