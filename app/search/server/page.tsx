import { Suspense } from 'react';
import { searchWithFallback } from '@/lib/typesense/server';
import { SearchResultsSkeleton, FacetsSkeleton } from '@/components/ui/skeleton';
import { NoSearchResults, SearchError } from '@/components/ui/empty-state';
import Link from 'next/link';
import { CogIcon, PlusIcon } from '@heroicons/react/24/outline';

interface SearchPageProps {
  searchParams: {
    q?: string;
    filter_by?: string;
    sort_by?: string;
    page?: string;
  };
}

async function ServerSearchResults({ searchParams, allParams }: { searchParams: any, allParams: any }) {
  const query = searchParams.q || '';
  const filterBy = searchParams.filter_by || '';
  const sortBy = searchParams.sort_by || '_text_match:desc,rating:desc';
  const page = parseInt(searchParams.page || '1');

  try {
    const results = await searchWithFallback('products', {
      q: query || '*',
      filter_by: filterBy,
      sort_by: sortBy,
      page,
      per_page: 12,
      facet_by: 'category,brand,in_stock',
      highlight_fields: 'name,description',
    });

    if (results.found === 0 && query) {
      return (
        <div className="col-span-full">
          <div className="text-center py-12 px-4">
            <div className="mx-auto flex justify-center mb-4">
              <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              We couldn't find any results for "{query}". Try adjusting your search terms or filters.
            </p>
            <div className="flex justify-center">
              <a
                href="/search/server"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear search
              </a>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Results Info */}
        <div className="col-span-full mb-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {results.found > 0 ? (
                <>
                  Showing {((page - 1) * 12) + 1}-{Math.min(page * 12, results.found)} of {results.found} results
                  {query && <span> for "<span className="font-medium">{query}</span>"</span>}
                  <span className="ml-2 text-gray-400">
                    ({results.search_time_ms}ms)
                  </span>
                </>
              ) : (
                'No results found'
              )}
            </p>
          </div>
        </div>

        {/* Facets Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              {searchParams.filter_by && (
                <a
                  href={`/search/server?${new URLSearchParams({ 
                    q: searchParams.q || '', 
                    sort_by: searchParams.sort_by || '_text_match:desc,rating:desc' 
                  })}`}
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                >
                  Clear all
                </a>
              )}
            </div>
            <div className="space-y-6">
              {results.facet_counts?.map((facet) => (
                <div key={facet.field_name} className="space-y-3">
                  <h4 className="font-medium text-gray-700 capitalize">
                    {facet.field_name.replace('_', ' ')}
                  </h4>
                  <div className="space-y-2">
                    {facet.counts.map((count: any) => {
                      const currentFilters = searchParams.filter_by?.split(' && ') || [];
                      const fieldFilter = currentFilters.find(f => f.startsWith(`${facet.field_name}:`));
                      const isChecked = fieldFilter?.includes(count.value) || false;
                      
                      // Build the new filter string for this toggle
                      const otherFilters = currentFilters.filter(f => !f.startsWith(`${facet.field_name}:`));
                      let newFilterBy = '';
                      
                      if (!isChecked) {
                        // Add this filter
                        let newFilter;
                        if (facet.field_name === 'in_stock') {
                          newFilter = `${facet.field_name}:=${count.value}`;
                        } else if (facet.field_name === 'price' || facet.field_name === 'rating') {
                          newFilter = `${facet.field_name}:[${count.value}..${count.value}]`;
                        } else {
                          newFilter = `${facet.field_name}:[\`${count.value}\`]`;
                        }
                        otherFilters.push(newFilter);
                        newFilterBy = otherFilters.join(' && ');
                      } else {
                        // Remove this filter (otherFilters already excludes it)
                        newFilterBy = otherFilters.join(' && ');
                      }
                      
                      const newParams = new URLSearchParams({
                        q: searchParams.q || '',
                        sort_by: searchParams.sort_by || '_text_match:desc,rating:desc',
                        page: '1' // Reset to page 1 when filtering
                      });
                      
                      if (newFilterBy) {
                        newParams.set('filter_by', newFilterBy);
                      }
                      
                      return (
                        <div key={count.value} className="flex items-center justify-between text-sm">
                          <a
                            href={`/search/server?${newParams.toString()}`}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 -mx-1 px-1 py-1 rounded"
                          >
                            <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                              isChecked 
                                ? 'bg-indigo-600 border-indigo-600' 
                                : 'border-gray-300'
                            }`}>
                              {isChecked && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className="text-gray-600">
                              {facet.field_name === 'in_stock' 
                                ? (count.value === 'true' ? 'In Stock' : 'Out of Stock')
                                : count.value
                              }
                            </span>
                          </a>
                          <span className="text-gray-400">({count.count})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Results Grid */}
        <main className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.hits.map((hit) => {
              const doc = hit.document;
              return (
                <div key={doc.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {doc.image_url && (
                    <div className="h-48 bg-gray-200">
                      <img
                        src={doc.image_url}
                        alt={doc.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {doc.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {doc.description}
                    </p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-indigo-600">
                        ${doc.price}
                      </span>
                      {doc.rating && (
                        <div className="flex items-center space-x-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(doc.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            ({doc.reviews_count})
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        doc.in_stock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {doc.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-md transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {results.found > 12 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex space-x-2">
                {page > 1 && (
                  <Link
                    href={`/search/server?${new URLSearchParams({
                      ...searchParams,
                      page: (page - 1).toString(),
                    })}`}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
                  >
                    Previous
                  </Link>
                )}
                <span className="px-4 py-2 bg-indigo-600 text-white rounded-md">
                  Page {page}
                </span>
                {page * 12 < results.found && (
                  <Link
                    href={`/search/server?${new URLSearchParams({
                      ...searchParams,
                      page: (page + 1).toString(),
                    })}`}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
                  >
                    Next
                  </Link>
                )}
              </nav>
            </div>
          )}
        </main>
      </>
    );
  } catch (error) {
    console.error('Server search error:', error);
    return (
      <div className="col-span-full">
        <div className="text-center py-12 px-4">
          <div className="mx-auto flex justify-center mb-4">
            <svg className="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            We're having trouble loading search results. Please try again.
          </p>
          <div className="flex justify-center">
            <a
              href={`/search/server?${new URLSearchParams(allParams as Record<string, string>)}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Try again
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default function ServerSearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-indigo-600">
              Typesense Search
            </h1>
            <div className="flex space-x-4">
              <Link
                href="/admin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Product
              </Link>
              <Link
                href="/settings"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <CogIcon className="h-5 w-5 mr-2" />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <form method="GET" className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search products..."
                className="w-full px-4 py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                autoFocus
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <span className="sr-only">Search</span>
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </button>
            </div>
          </form>

          {/* Sort Options */}
          <div className="mt-4 flex justify-center space-x-2">
            <span className="text-sm text-gray-700 flex items-center">Sort by:</span>
            <div className="flex space-x-1">
              <a 
                href={`/search/server?${new URLSearchParams({ ...searchParams, sort_by: '_text_match:desc,rating:desc' } as any)}`}
                className={`px-3 py-1 text-xs rounded ${searchParams.sort_by === '_text_match:desc,rating:desc' || !searchParams.sort_by ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Relevance
              </a>
              <a 
                href={`/search/server?${new URLSearchParams({ ...searchParams, sort_by: 'price:asc' } as any)}`}
                className={`px-3 py-1 text-xs rounded ${searchParams.sort_by === 'price:asc' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Price ↑
              </a>
              <a 
                href={`/search/server?${new URLSearchParams({ ...searchParams, sort_by: 'price:desc' } as any)}`}
                className={`px-3 py-1 text-xs rounded ${searchParams.sort_by === 'price:desc' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Price ↓
              </a>
              <a 
                href={`/search/server?${new URLSearchParams({ ...searchParams, sort_by: 'rating:desc' } as any)}`}
                className={`px-3 py-1 text-xs rounded ${searchParams.sort_by === 'rating:desc' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Rating ↓
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <Suspense fallback={<><div className="w-64"><FacetsSkeleton /></div><div className="flex-1"><SearchResultsSkeleton /></div></>}>
            <ServerSearchResults searchParams={searchParams} allParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}