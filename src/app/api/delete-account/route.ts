import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize the admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // The order of deletion is important to avoid foreign key constraint violations.
    // Start with tables that depend on others.

    // 1. Delete invoice items
    await supabaseAdmin.from('invoice_items').delete().eq('owner', userId);
    
    // 2. Delete invoices
    await supabaseAdmin.from('invoices').delete().eq('owner', userId);

    // 3. Delete customers
    await supabaseAdmin.from('customers').delete().eq('auth_user_id', userId);

    // 4. Delete products
    await supabaseAdmin.from('products').delete().eq('user_id', userId);

    // 5. Delete notifications
    await supabaseAdmin.from('notifications').delete().eq('user_id', userId);

    // Finally, delete the user from the auth schema
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteUserError) {
      throw deleteUserError;
    }

    return NextResponse.json({ success: true, message: 'Account deleted successfully.' }, { status: 200 });

  } catch (error: any) {
    console.error('Error deleting account:', error);
    return NextResponse.json({ error: error.message || 'An error occurred while deleting the account.' }, { status: 500 });
  }
}
