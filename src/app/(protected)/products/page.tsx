import { getUserRole, getServerSupabase } from '@/lib/supabase/server-utils';
import ProductListClient from './ProductListClient';
import ProductsPageSkeleton from '@/components/skeletons/ProductsPageSkeleton';

async function getProducts(supabase: any) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data;
}

export default async function ProductsPage() {
  const userRole = await getUserRole();
  const allowedRoles = ["user", "vendor"];

  if (!userRole || !allowedRoles.includes(userRole)) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">Not Authorized</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  const supabase = await getServerSupabase();
  const products = await getProducts(supabase);

  if (!products) {
    return <ProductsPageSkeleton />;
  }

  return <ProductListClient initialProducts={products} />;
}