'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import SortableTableHeader from '@/components/shared/SortableTableHeader';

type SortDirection = 'ascending' | 'descending';

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
}

interface ProductListClientProps {
  initialProducts: Product[];
}

export default function ProductListClient({ initialProducts }: ProductListClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: SortDirection }>({
    key: 'name',
    direction: 'ascending',
  });

  const sortedAndFilteredProducts = useMemo(() => {
    let filtered = products.filter(p => {
      const searchLower = search.toLowerCase();
      return !search ||
        p.name?.toLowerCase().includes(searchLower) ||
        p.sku?.toLowerCase().includes(searchLower);
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [products, search, sortConfig]);

  const handleSort = (key: string) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 dark:bg-gray-800/40 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Products</h1>
        <Link href="/products/new" className="btn-primary bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          New Product
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-2 mb-4 items-end">
        <input
          type="text"
          placeholder="Search by name or SKU"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-input w-full md:w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-white/20 dark:border-gray-700">
              <SortableTableHeader title="Name" sortKey="name" sortConfig={sortConfig} onSort={handleSort} />
              <SortableTableHeader title="SKU" sortKey="sku" sortConfig={sortConfig} onSort={handleSort} />
              <SortableTableHeader title="Quantity" sortKey="quantity" sortConfig={sortConfig} onSort={handleSort} className="text-right" />
              <SortableTableHeader title="Price" sortKey="price" sortConfig={sortConfig} onSort={handleSort} className="text-right" />
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredProducts.map(product => (
              <tr key={product.id} className="border-b border-white/20 hover:bg-white/50 dark:border-gray-700 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.sku}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">{product.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">${(product.price || 0).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/products/${product.id}`} className="text-blue-500 hover:underline dark:text-blue-400">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}