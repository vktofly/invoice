"use client";
import React, { useState, useEffect } from 'react';
import { listTopProducts } from '@/lib/supabase/products';
import { CubeIcon } from '@heroicons/react/24/outline';

export const TopProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await listTopProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 dark:bg-gray-800/40 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        <CubeIcon className="h-6 w-6 inline-block mr-2" />
        Top Products
      </h3>
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : (
        <ul className="divide-y divide-white/20 dark:divide-gray-700">
          {products.map((product) => (
            <li key={product.product_id} className="py-3 flex justify-between items-center">
              <span className="font-medium text-gray-800 dark:text-gray-100">{product.name}</span>
              <span className="text-gray-600 dark:text-gray-300">{product.total_sold} units</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

