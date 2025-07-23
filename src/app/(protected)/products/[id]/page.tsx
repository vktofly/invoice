
import { getServerSupabase } from '@/lib/supabase/server-utils';
import Link from 'next/link';

async function getProduct(supabase: any, id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = await getServerSupabase();
  const product = await getProduct(supabase, params.id);

  if (!product) return <p>Not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Product Details</h1>
      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <p><strong>Name:</strong> {product.name}</p>
        <p><strong>Description:</strong> {product.description}</p>
        <p><strong>SKU:</strong> {product.sku}</p>
        <p><strong>Quantity:</strong> {product.quantity}</p>
        <p><strong>Price:</strong> ${(product.price || 0).toFixed(2)}</p>
      </div>
      <div className="mt-6 flex gap-4">
        <Link href={`/products/${params.id}/edit`} className="btn-secondary">Edit</Link>
        {/* For delete, use a client subcomponent if needed */}
      </div>
    </div>
  );
}
