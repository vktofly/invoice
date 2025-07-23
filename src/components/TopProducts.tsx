'use client';
import { CubeIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { TopProductsSkeleton } from './skeletons/TopProductsSkeleton';

type TopProduct = {
  product_id: string;
  name: string;
  total_sold: number;
};

async function fetchData(): Promise<TopProduct[]> {
  // Simulate a network request
  await new Promise(resolve => setTimeout(resolve, 3000));
  return [
    { product_id: '1', name: 'Web Design Package', total_sold: 50 },
    { product_id: '2', name: 'SEO Consulting', total_sold: 35 },
    { product_id: '3', name: 'Logo Design', total_sold: 20 },
  ];
}

export default function TopProducts() {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <TopProductsSkeleton />;
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground p-6 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Top Products</h3>
        <CubeIcon className="h-6 w-6 text-muted-foreground" />
      </div>
      <ul className="divide-y divide-border">
        {products.map(product => (
          <li key={product.product_id} className="py-3 flex justify-between items-center">
            <span className="font-medium text-foreground">{product.name}</span>
            <span className="text-muted-foreground">{product.total_sold} units</span>
          </li>
        ))}
      </ul>
    </div>
  );
}