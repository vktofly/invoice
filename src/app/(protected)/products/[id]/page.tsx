
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      } else {
        router.push('/products');
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id, router]);

  const handleDelete = async () => {
    if (!id) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    router.push('/products');
  };

  if (loading) return <p>Loading...</p>;
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
        <button onClick={() => router.push(`/products/${id}/edit`)} className="btn-secondary">Edit</button>
        <button onClick={handleDelete} className="btn-danger">Delete</button>
      </div>
    </div>
  );
}
