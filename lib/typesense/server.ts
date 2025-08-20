import { Client as TypesenseClient } from 'typesense';
import { SearchParams } from 'typesense/lib/Typesense/Documents';

const client = new TypesenseClient({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || 'localhost',
      port: parseInt(process.env.TYPESENSE_PORT || '8108'),
      protocol: process.env.TYPESENSE_PROTOCOL || 'http',
    },
  ],
  apiKey: process.env.TYPESENSE_SEARCH_ONLY_API_KEY || 'xyz',
  connectionTimeoutSeconds: 10,
});

export interface TypesenseSearchResult {
  hits: any[];
  facet_counts: any[];
  found: number;
  search_time_ms: number;
  page: number;
}

export interface ServerSearchParams {
  q?: string;
  query_by?: string;
  filter_by?: string;
  sort_by?: string;
  facet_by?: string;
  max_facet_values?: number;
  page?: number;
  per_page?: number;
  group_by?: string;
  group_limit?: number;
  include_fields?: string;
  exclude_fields?: string;
  highlight_fields?: string;
  snippet_threshold?: number;
  num_typos?: string;
  prefix?: string;
  infix?: string;
  pre_segmented_query?: boolean;
  enable_overrides?: boolean;
  pinned_hits?: string;
  hidden_hits?: string;
}

export class TypesenseServerService {
  private static instance: TypesenseServerService;

  static getInstance(): TypesenseServerService {
    if (!TypesenseServerService.instance) {
      TypesenseServerService.instance = new TypesenseServerService();
    }
    return TypesenseServerService.instance;
  }

  async search(
    collection: string,
    searchParams: ServerSearchParams
  ): Promise<TypesenseSearchResult> {
    try {
      const searchParameters: SearchParams = {
        q: searchParams.q || '*',
        query_by: searchParams.query_by || 'name,description,content,category,tags',
        filter_by: searchParams.filter_by,
        sort_by: searchParams.sort_by || '_text_match:desc,rating:desc',
        facet_by: searchParams.facet_by || 'category,brand,in_stock',
        max_facet_values: searchParams.max_facet_values || 10,
        page: searchParams.page || 1,
        per_page: searchParams.per_page || 12,
        group_by: searchParams.group_by,
        group_limit: searchParams.group_limit,
        include_fields: searchParams.include_fields,
        exclude_fields: searchParams.exclude_fields,
        highlight_fields: searchParams.highlight_fields || 'name,description',
        snippet_threshold: searchParams.snippet_threshold || 30,
        num_typos: searchParams.num_typos || '1',
        prefix: searchParams.prefix !== undefined ? searchParams.prefix : true,
        infix: searchParams.infix,
        pre_segmented_query: searchParams.pre_segmented_query,
        enable_overrides: searchParams.enable_overrides !== false,
        pinned_hits: searchParams.pinned_hits,
        hidden_hits: searchParams.hidden_hits,
      };

      const result = await client.collections(collection).documents().search(searchParameters);
      
      return {
        hits: result.hits || [],
        facet_counts: result.facet_counts || [],
        found: result.found || 0,
        search_time_ms: result.search_time_ms || 0,
        page: result.page || 1,
      };
    } catch (error) {
      console.error('Typesense server search error:', error);
      throw new Error('Failed to perform server-side search');
    }
  }

  async getDocument(collection: string, id: string) {
    try {
      const document = await client.collections(collection).documents(id).retrieve();
      return document;
    } catch (error) {
      console.error('Typesense server get document error:', error);
      throw new Error('Failed to retrieve document');
    }
  }

  async getCollectionInfo(collection: string) {
    try {
      const info = await client.collections(collection).retrieve();
      return info;
    } catch (error) {
      console.error('Typesense server get collection error:', error);
      throw new Error('Failed to retrieve collection info');
    }
  }

  async getFacets(collection: string, facetBy: string[] = ['category', 'brand', 'in_stock']) {
    try {
      const result = await this.search(collection, {
        q: '*',
        facet_by: facetBy.join(','),
        per_page: 0, // Only get facets, no documents
      });
      
      return result.facet_counts;
    } catch (error) {
      console.error('Typesense server get facets error:', error);
      return [];
    }
  }

  async healthCheck() {
    try {
      await client.health.retrieve();
      return true;
    } catch (error) {
      console.error('Typesense health check failed:', error);
      return false;
    }
  }
}

export const typesenseServer = TypesenseServerService.getInstance();

// Mock data fallback for when Typesense is not available
const mockSearchData = {
  hits: [
    {
      document: {
        id: '1',
        name: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones with active noise cancellation.',
        content: 'Experience premium audio with these professional-grade wireless headphones.',
        category: 'Electronics',
        subcategory: 'Audio',
        price: 299.99,
        currency: 'USD',
        rating: 4.5,
        reviews_count: 1250,
        in_stock: true,
        brand: 'AudioTech',
        tags: ['wireless', 'noise-cancellation', 'premium'],
        image_url: 'https://via.placeholder.com/300x300/4F46E5/ffffff?text=Headphones',
      },
      highlights: [
        { field: 'name', snippet: '<mark>Premium</mark> Wireless Headphones' },
      ],
    },
    {
      document: {
        id: '2',
        name: 'Smart Watch Pro',
        description: 'Advanced fitness tracking and smartphone integration.',
        content: 'Stay connected and healthy with this advanced smartwatch.',
        category: 'Electronics',
        subcategory: 'Wearables',
        price: 399.99,
        currency: 'USD',
        rating: 4.3,
        reviews_count: 890,
        in_stock: true,
        brand: 'TechWear',
        tags: ['fitness', 'health', 'smart'],
        image_url: 'https://via.placeholder.com/300x300/10B981/ffffff?text=Smart+Watch',
      },
      highlights: [
        { field: 'name', snippet: '<mark>Smart</mark> Watch Pro' },
      ],
    },
  ],
  facet_counts: [
    {
      field_name: 'category',
      counts: [
        { count: 2, highlighted: 'Electronics', value: 'Electronics' },
      ],
    },
    {
      field_name: 'brand',
      counts: [
        { count: 1, highlighted: 'AudioTech', value: 'AudioTech' },
        { count: 1, highlighted: 'TechWear', value: 'TechWear' },
      ],
    },
    {
      field_name: 'in_stock',
      counts: [
        { count: 2, highlighted: 'true', value: 'true' },
      ],
    },
  ],
  found: 2,
  search_time_ms: 1,
  page: 1,
};

export async function searchWithFallback(
  collection: string,
  searchParams: ServerSearchParams
): Promise<TypesenseSearchResult> {
  try {
    return await typesenseServer.search(collection, searchParams);
  } catch (error) {
    console.warn('Falling back to mock data due to Typesense error:', error);
    // Filter mock data based on search query if provided
    const query = searchParams.q?.toLowerCase();
    if (query && query !== '*') {
      const filteredHits = mockSearchData.hits.filter(hit =>
        hit.document.name.toLowerCase().includes(query) ||
        hit.document.description.toLowerCase().includes(query) ||
        hit.document.category.toLowerCase().includes(query)
      );
      return {
        ...mockSearchData,
        hits: filteredHits,
        found: filteredHits.length,
      };
    }
    return mockSearchData;
  }
}