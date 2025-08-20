'use client';

import { ProductForm } from '@/components/forms/ProductForm';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function AdminPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleProductSubmit = () => {
    setSuccessMessage('Product added successfully!');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Search
            </Link>
            <h1 className="ml-8 text-2xl font-bold text-gray-900">Add Product</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Product Information</h2>
            <ProductForm onSubmit={handleProductSubmit} />
          </div>
        </div>
      </main>
    </div>
  );
}