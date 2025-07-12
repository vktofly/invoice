"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SearchResult {
  type: 'invoice' | 'customer' | 'product';
  id: string;
  title: string;
  description: string;
  url: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          if (response.ok) {
            const data = await response.json();
            setResults(data);
          } else {
            setResults([]);
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  const renderResults = () => {
    if (loading) {
      return <p>Loading...</p>;
    }

    if (!query) {
        return <p>Please enter a search term to begin.</p>;
    }

    if (results.length === 0) {
      return <p>No results found for &quot;{query}&quot;.</p>;
    }

    const groupedResults = results.reduce((acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = [];
      }
      acc[result.type].push(result);
      return acc;
    }, {} as Record<string, SearchResult[]>);

    return (
      <div className="space-y-6">
        {Object.entries(groupedResults).map(([type, items]) => (
          <div key={type}>
            <h2 className="text-xl font-semibold mb-2 capitalize">{type}s</h2>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id} className="p-4 bg-white rounded-lg shadow hover:bg-gray-50">
                  <Link href={item.url}>
                    <h3 className="font-bold text-blue-600">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>
      {renderResults()}
    </div>
  );
}