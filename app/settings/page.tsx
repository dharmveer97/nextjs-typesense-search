'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function SettingsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/typesense/collections');
      if (!response.ok) throw new Error('Failed to fetch collections');
      const data = await response.json();
      setCollections(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleDeleteCollection = async () => {
    if (!confirm('Are you sure you want to delete the products collection? This will remove all data.')) {
      return;
    }

    try {
      const response = await fetch('/api/typesense/collections', {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete collection');
      
      setMessage('Collection deleted successfully');
      await fetchCollections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting collection');
    }
  };

  const handleResetData = async () => {
    if (!confirm('This will reset the collection and reload sample data. Continue?')) {
      return;
    }

    try {
      // Delete collection
      await fetch('/api/typesense/collections', { method: 'DELETE' });
      
      // Reinitialize with sample data
      const response = await fetch('/api/typesense/init', {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to reset data');
      
      const data = await response.json();
      setMessage(`Data reset successfully. ${data.documentsImported} documents imported.`);
      await fetchCollections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error resetting data');
    }
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
            <h1 className="ml-8 text-2xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Typesense Configuration */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Typesense Configuration</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Host:</span>{' '}
                <span className="text-gray-600">{process.env.NEXT_PUBLIC_TYPESENSE_HOST || 'Not configured'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Port:</span>{' '}
                <span className="text-gray-600">{process.env.NEXT_PUBLIC_TYPESENSE_PORT || 'Not configured'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Protocol:</span>{' '}
                <span className="text-gray-600">{process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || 'Not configured'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Collections */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Collections</h2>
            {loading ? (
              <LoadingSpinner />
            ) : collections.length > 0 ? (
              <div className="space-y-3">
                {collections.map((collection) => (
                  <div key={collection.name} className="border rounded p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{collection.name}</h3>
                        <p className="text-sm text-gray-600">
                          Documents: {collection.num_documents || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No collections found</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <div className="space-y-3">
              <button
                onClick={handleResetData}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Reset Sample Data
              </button>
              <button
                onClick={handleDeleteCollection}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Products Collection
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}