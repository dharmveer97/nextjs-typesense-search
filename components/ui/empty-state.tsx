import { ReactNode } from 'react';
import { 
  MagnifyingGlassIcon, 
  ExclamationTriangleIcon,
  InboxIcon,
  CloudIcon,
  WifiIcon
} from '@heroicons/react/24/outline';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  className = "" 
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="mx-auto flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
}

export function NoSearchResults({ query, onClearSearch }: { 
  query: string; 
  onClearSearch: () => void;
}) {
  return (
    <EmptyState
      icon={<MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />}
      title="No results found"
      description={`We couldn't find any results for "${query}". Try adjusting your search terms or filters.`}
      action={
        <div className="space-x-4">
          <button
            onClick={onClearSearch}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Clear search
          </button>
        </div>
      }
    />
  );
}

export function NoProducts() {
  return (
    <EmptyState
      icon={<InboxIcon className="h-12 w-12 text-gray-400" />}
      title="No products available"
      description="There are currently no products in the catalog. Check back later or contact support."
    />
  );
}

export function SearchError({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      icon={<ExclamationTriangleIcon className="h-12 w-12 text-red-400" />}
      title="Something went wrong"
      description="We're having trouble loading search results. Please try again."
      action={
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Try again
        </button>
      }
    />
  );
}

export function ConnectionError({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      icon={<WifiIcon className="h-12 w-12 text-gray-400" />}
      title="Connection failed"
      description="Unable to connect to the search service. Please check your internet connection and try again."
      action={
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Retry connection
        </button>
      }
    />
  );
}

export function ServerError() {
  return (
    <EmptyState
      icon={<CloudIcon className="h-12 w-12 text-gray-400" />}
      title="Server unavailable"
      description="The search service is temporarily unavailable. We're working to fix this issue."
    />
  );
}

export function InitializingSearch() {
  return (
    <EmptyState
      icon={
        <div className="relative">
          <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
          </div>
        </div>
      }
      title="Initializing search"
      description="Setting up the search index and connecting to Typesense. This may take a moment."
    />
  );
}