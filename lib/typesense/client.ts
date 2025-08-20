import Typesense from 'typesense';
import { Client, SearchParams, MultiSearchParams } from 'typesense';
import { CollectionSchema } from 'typesense/lib/Typesense/Collection';
import type { 
  SearchResponse, 
  MultiSearchResponse,
  FacetSearchResponse,
  SearchAnalyticsEventCreateRequest
} from '../../types/typesense';

// Client instances cache
let adminClient: Client | null = null;
let searchClient: Client | null = null;

// Environment configuration
const getConfig = () => {
  const isServer = typeof window === 'undefined';
  
  return {
    host: isServer 
      ? process.env.TYPESENSE_HOST || process.env.NEXT_PUBLIC_TYPESENSE_HOST!
      : process.env.NEXT_PUBLIC_TYPESENSE_HOST!,
    port: parseInt(
      isServer 
        ? process.env.TYPESENSE_PORT || process.env.NEXT_PUBLIC_TYPESENSE_PORT!
        : process.env.NEXT_PUBLIC_TYPESENSE_PORT!
    ),
    protocol: isServer 
      ? process.env.TYPESENSE_PROTOCOL || process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL!
      : process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL!,
    adminKey: process.env.TYPESENSE_API_KEY!,
    searchKey: isServer 
      ? process.env.TYPESENSE_SEARCH_ONLY_API_KEY || process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY!
      : process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY!,
  };
};

/**
 * Get admin client with full API access
 * Should only be used on server-side
 */
export function getAdminClient(): Client {
  if (!adminClient) {
    const config = getConfig();
    
    adminClient = new Typesense.Client({
      nodes: [{
        host: config.host,
        port: config.port,
        protocol: config.protocol as 'http' | 'https',
      }],
      apiKey: config.adminKey,
      connectionTimeoutSeconds: 10,
      retryIntervalSeconds: 1,
      numRetries: 3,
      healthcheckIntervalSeconds: 30,
      logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    });
  }
  
  return adminClient;
}

/**
 * Get search-only client for frontend operations
 */
export function getSearchClient(): Client {
  if (!searchClient) {
    const config = getConfig();
    
    searchClient = new Typesense.Client({
      nodes: [{
        host: config.host,
        port: config.port,
        protocol: config.protocol as 'http' | 'https',
      }],
      apiKey: config.searchKey,
      connectionTimeoutSeconds: 5,
      retryIntervalSeconds: 0.5,
      numRetries: 2,
      healthcheckIntervalSeconds: 60,
      logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
    });
  }
  
  return searchClient;
}

/**
 * Legacy function for backward compatibility
 */
export function getTypesenseClient(isAdmin: boolean = false): Client {
  return isAdmin ? getAdminClient() : getSearchClient();
}

/**
 * Advanced Search Functions
 */

/**
 * Perform multi-collection federated search
 */
export async function federatedSearch(
  searches: MultiSearchParams['searches']
): Promise<MultiSearchResponse> {
  const client = getSearchClient();
  return client.multiSearch({
    searches: searches,
  }) as Promise<MultiSearchResponse>;
}

/**
 * Perform semantic search with natural language query
 */
export async function semanticSearch(
  collection: string,
  query: string,
  options: Partial<SearchParams> = {}
): Promise<SearchResponse> {
  const client = getSearchClient();
  
  const searchParams: SearchParams = {
    q: query,
    query_by: options.query_by || 'title,description,content',
    query_by_weights: options.query_by_weights || '3,2,1',
    // Enable vector search if embeddings are available
    vector_query: options.vector_query,
    // Semantic search enhancements
    prefix: false,
    num_typos: 2,
    typo_tokens_threshold: 1,
    drop_tokens_threshold: 1,
    enable_synonyms: true,
    synonym_prefix: true,
    // Advanced features
    enable_overrides: true,
    enable_highlight_v1: false,
    highlight_fields: options.highlight_fields || 'title,description',
    highlight_full_fields: options.highlight_full_fields || 'content',
    snippet_threshold: 30,
    max_extra_prefix: 2,
    max_extra_suffix: 2,
    // Personalization
    user_id: options.user_id,
    // Faceting
    facet_by: options.facet_by,
    max_facet_values: 10,
    facet_query: options.facet_query,
    // Filtering
    filter_by: options.filter_by,
    // Sorting
    sort_by: options.sort_by,
    // Pagination
    page: options.page || 1,
    per_page: options.per_page || 20,
    // Grouping
    group_by: options.group_by,
    group_limit: options.group_limit || 3,
    ...options,
  };
  
  return client.collections(collection).documents().search(searchParams) as Promise<SearchResponse>;
}

/**
 * Perform vector search using embeddings
 */
export async function vectorSearch(
  collection: string,
  vector: number[],
  options: Partial<SearchParams> = {}
): Promise<SearchResponse> {
  const client = getSearchClient();
  
  const searchParams: SearchParams = {
    q: '*',
    vector_query: `embedding:(${vector.join(', ')}, k:${options.per_page || 20})`,
    query_by: options.query_by || 'title',
    per_page: options.per_page || 20,
    page: options.page || 1,
    filter_by: options.filter_by,
    facet_by: options.facet_by,
    sort_by: options.sort_by,
    ...options,
  };
  
  return client.collections(collection).documents().search(searchParams) as Promise<SearchResponse>;
}

/**
 * Perform geosearch with location-based filtering
 */
export async function geoSearch(
  collection: string,
  query: string,
  lat: number,
  lng: number,
  radiusKm: number,
  options: Partial<SearchParams> = {}
): Promise<SearchResponse> {
  const client = getSearchClient();
  
  const geoFilter = `location:(${lat}, ${lng}, ${radiusKm} km)`;
  const existingFilter = options.filter_by;
  const combinedFilter = existingFilter 
    ? `${existingFilter} && ${geoFilter}`
    : geoFilter;
  
  const searchParams: SearchParams = {
    q: query,
    query_by: options.query_by || 'title,description',
    filter_by: combinedFilter,
    sort_by: options.sort_by || '_geo_distance(location):asc',
    per_page: options.per_page || 20,
    page: options.page || 1,
    facet_by: options.facet_by,
    ...options,
  };
  
  return client.collections(collection).documents().search(searchParams) as Promise<SearchResponse>;
}

/**
 * Get autocomplete suggestions with typo tolerance
 */
export async function getAutocompleteSuggestions(
  collection: string,
  query: string,
  field: string = 'title',
  limit: number = 5
): Promise<SearchResponse> {
  const client = getSearchClient();
  
  const searchParams: SearchParams = {
    q: query,
    query_by: field,
    prefix: true,
    num_typos: 1,
    per_page: limit,
    facet_by: '',
    sort_by: '_text_match:desc',
    include_fields: field,
  };
  
  return client.collections(collection).documents().search(searchParams) as Promise<SearchResponse>;
}

/**
 * Search with facet counts and filtering
 */
export async function facetedSearch(
  collection: string,
  query: string,
  facets: string[],
  filters: Record<string, string[]> = {},
  options: Partial<SearchParams> = {}
): Promise<SearchResponse> {
  const client = getSearchClient();
  
  // Build filter string from filter object
  const filterClauses = Object.entries(filters)
    .filter(([_, values]) => values.length > 0)
    .map(([field, values]) => {
      if (values.length === 1) {
        return `${field}:${values[0]}`;
      }
      return `${field}:[${values.join(', ')}]`;
    });
  
  const searchParams: SearchParams = {
    q: query,
    query_by: options.query_by || 'title,description',
    facet_by: facets.join(','),
    filter_by: filterClauses.length > 0 ? filterClauses.join(' && ') : undefined,
    max_facet_values: 20,
    per_page: options.per_page || 20,
    page: options.page || 1,
    sort_by: options.sort_by,
    ...options,
  };
  
  return client.collections(collection).documents().search(searchParams) as Promise<SearchResponse>;
}

/**
 * Get search suggestions based on query
 */
export async function getSearchSuggestions(
  query: string,
  collections: string[] = ['products', 'courses', 'documents'],
  limit: number = 3
): Promise<string[]> {
  try {
    const searches = collections.map(collection => ({
      collection,
      q: query,
      query_by: 'title,description',
      prefix: true,
      per_page: limit,
      include_fields: 'title',
    }));
    
    const results = await federatedSearch(searches);
    const suggestions = new Set<string>();
    
    results.results?.forEach(result => {
      result.hits?.forEach(hit => {
        if (hit.document.title) {
          suggestions.add(hit.document.title as string);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, limit * collections.length);
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return [];
  }
}

/**
 * Collection Management Functions
 */

/**
 * Create a collection with schema
 */
export async function createCollection(schema: CollectionSchema): Promise<void> {
  const client = getAdminClient();
  await client.collections().create(schema);
}

/**
 * Delete a collection
 */
export async function deleteCollection(name: string): Promise<void> {
  const client = getAdminClient();
  await client.collections(name).delete();
}

/**
 * Get collection info
 */
export async function getCollection(name: string) {
  const client = getAdminClient();
  return client.collections(name).retrieve();
}

/**
 * List all collections
 */
export async function listCollections() {
  const client = getAdminClient();
  return client.collections().retrieve();
}

/**
 * Analytics Functions
 */

/**
 * Track search analytics event
 */
export async function trackSearchAnalytics(
  event: SearchAnalyticsEventCreateRequest
): Promise<void> {
  try {
    const client = getAdminClient();
    await client.analytics().events().create(event);
  } catch (error) {
    console.error('Error tracking search analytics:', error);
  }
}

/**
 * Get search analytics data
 */
export async function getSearchAnalytics(
  params: {
    startDate?: string;
    endDate?: string;
    aggregation?: 'count' | 'sum' | 'avg';
  } = {}
) {
  try {
    const client = getAdminClient();
    return client.analytics().rules().retrieve(params);
  } catch (error) {
    console.error('Error fetching search analytics:', error);
    return null;
  }
}

/**
 * Utility Functions
 */

/**
 * Health check for Typesense cluster
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const client = getSearchClient();
    await client.health.retrieve();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get cluster metrics
 */
export async function getClusterMetrics() {
  try {
    const client = getAdminClient();
    return client.metrics.retrieve();
  } catch (error) {
    console.error('Error fetching cluster metrics:', error);
    return null;
  }
}