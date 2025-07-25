
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

const ProductSchema = z.object({
  name: z.string().nonempty('Product name is required'),
  description: z.string().optional(),
  sku: z.string().optional(),
  quantity: z.number().int().nonnegative('Quantity must be a non-negative integer'),
  price: z.number().nonnegative('Price cannot be negative'),
});

type FormState = z.infer<typeof ProductSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    name: '',
    quantity: 0,
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: name === 'quantity' || name === 'price' ? parseFloat(value) : value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const result = ProductSchema.safeParse(formState);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) throw new Error('Failed to create product');
      router.push('/products');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">New Product</h1>
      <div className="p-6 bg-white rounded-lg shadow-sm border space-y-4">
        <input type="text" name="name" placeholder="Product Name" onChange={handleInputChange} className="input w-full" />
        <textarea name="description" placeholder="Description" onChange={handleInputChange} className="input w-full"></textarea>
        <input type="text" name="sku" placeholder="SKU" onChange={handleInputChange} className="input w-full" />
        <input type="number" name="quantity" placeholder="Quantity" onChange={handleInputChange} className="input w-full" />
        <input type="number" name="price" placeholder="Price" onChange={handleInputChange} className="input w-full" />
        <div className="flex justify-end">
          <button onClick={handleSubmit} disabled={loading} className="btn-primary">Save Product</button>
        </div>
      </div>
    </div>
  );
}
