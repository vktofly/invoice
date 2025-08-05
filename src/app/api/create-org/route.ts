import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
    const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.id) {
      console.error('Authorization error: User not found or user ID is missing.');
      return new NextResponse(JSON.stringify({ error: 'Unauthorized: Missing user credentials.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }



    // Idempotency check: See if an organization already exists for this user
    const { data: existingOrg, error: orgCheckError } = await supabase
      .from('organizations')
      .select('id')
      .eq('owner', user.id)
      .maybeSingle();

    if (orgCheckError && orgCheckError.code !== 'PGRST116') { // PGRST116 means no rows found, which is not an error here.
        console.error('Error checking for organization:', { userId: user.id, error: orgCheckError });
        return new NextResponse(JSON.stringify({ error: 'Database error while checking for organization.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (existingOrg) {
      return new NextResponse(JSON.stringify({ message: 'Organization already exists.', org: existingOrg }), {
        status: 200, // OK, since it's not a new creation
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create a new organization since one doesn't exist
    const { data: newOrg, error: createOrgError } = await supabase
      .from('organizations')
      .insert([{
        owner: user.id,
        created_by: user.id,
        name: `${user.email?.split('@')[0]}'s Organization`,
        industry: 'Other',
      }])
      .select()
      .single();

    if (createOrgError) {
        console.error('Error creating organization:', { userId: user.id, error: createOrgError });
        return new NextResponse(JSON.stringify({ error: 'Failed to create organization.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Link the new organization to the user's profile
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({ organization_id: newOrg.id })
      .eq('id', user.id);

    if (profileUpdateError) {
      console.error('Database error: Failed to link organization to profile.', profileUpdateError);
      // Even if this fails, the org was created, so we don't block the user.
      // But we log it for debugging.
    }

    console.log(`Organization created successfully for user ${user.id} with org ID ${newOrg.id}`);
    return new NextResponse(JSON.stringify(newOrg), {
      status: 201, // Created
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('An unexpected error occurred in /api/create-org:', { error });
    return new NextResponse(JSON.stringify({ error: 'An unexpected error occurred.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }
}
