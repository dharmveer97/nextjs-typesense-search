// Base document interfaces
export interface BaseDocument {
  id: string;
  created_at: number;
  updated_at: number;
}

export interface Product extends BaseDocument {
  name: string;
  title: string; // For search compatibility
  description: string;
  content?: string; // For vector search
  category: string;
  subcategory?: string;
  price: number;
  currency?: string;
  rating: number;
  reviews_count: number;
  in_stock: boolean;
  stock_quantity?: number;
  brand: string;
  tags: string[];
  image_url?: string;
  image_urls?: string[];
  attributes?: Record<string, any>;
  location?: {
    lat: number;
    lng: number;
  };
  embedding?: number[]; // For vector search
  popularity_score?: number;
  discount_percentage?: number;
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface Course extends BaseDocument {
  title: string;
  description: string;
  content: string;
  instructor: string;
  instructor_id: string;
  category: string;
  subcategory?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_hours: number;
  language: string;
  price: number;
  currency?: string;
  rating: number;
  reviews_count: number;
  enrolled_count: number;
  tags: string[];
  skills: string[];
  prerequisites?: string[];
  thumbnail_url?: string;
  video_url?: string;
  chapters?: {
    id: string;
    title: string;
    duration: number;
  }[];
  embedding?: number[];
  completion_rate?: number;
  certificate_available?: boolean;
  last_updated: number;
}

export interface Document extends BaseDocument {
  title: string;
  content: string;
  summary?: string;
  author: string;
  category: string;
  subcategory?: string;
  type: 'article' | 'tutorial' | 'documentation' | 'guide' | 'faq';
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  language: string;
  word_count: number;
  reading_time_minutes: number;
  featured_image?: string;
  embedding?: number[];
  views_count?: number;
  likes_count?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  last_reviewed?: number;
  version?: string;
}

// Enhanced search interfaces
export interface SearchParams {
  q: string;
  query_by?: string;
  query_by_weights?: string;
  filter_by?: string;
  sort_by?: string;
  max_facet_values?: number;
  facet_by?: string;
  facet_query?: string;
  per_page?: number;
  page?: number;
  // Advanced search parameters
  prefix?: boolean;
  num_typos?: number;
  typo_tokens_threshold?: number;
  drop_tokens_threshold?: number;
  enable_synonyms?: boolean;
  synonym_prefix?: boolean;
  enable_overrides?: boolean;
  enable_highlight_v1?: boolean;
  highlight_fields?: string;
  highlight_full_fields?: string;
  snippet_threshold?: number;
  max_extra_prefix?: number;
  max_extra_suffix?: number;
  // Vector search
  vector_query?: string;
  // Personalization
  user_id?: string;
  // Grouping
  group_by?: string;
  group_limit?: number;
  // Additional options
  include_fields?: string;
  exclude_fields?: string;
  limit_hits?: number;
  offset?: number;
  search_cutoff_ms?: number;
  prioritize_exact_match?: boolean;
  prioritize_token_position?: boolean;
  exhaustive_search?: boolean;
  use_cache?: boolean;
}

export interface FacetValue {
  value: string;
  count: number;
  highlighted?: string;
}

export interface Facet {
  field_name: string;
  counts: FacetValue[];
  stats?: {
    min?: number;
    max?: number;
    avg?: number;
    sum?: number;
  };
}

// Enhanced search result interfaces
export interface SearchHit<T = any> {
  document: T;
  highlights?: Array<{
    field: string;
    snippet: string;
    snippets?: string[];
    matched_tokens: string[];
    indices?: number[];
  }>;
  text_match: number;
  text_match_info?: {
    best_field_score: string;
    best_field_weight: number;
    fields_matched: number;
    score: string;
    tokens_matched: number;
  };
  geo_distance_meters?: {
    [field: string]: number;
  };
  vector_distance?: number;
}

export interface SearchResponse<T = any> {
  facet_counts?: Facet[];
  found: number;
  found_docs?: number;
  hits: SearchHit<T>[];
  out_of: number;
  page: number;
  request_params: {
    collection_name: string;
    per_page: number;
    q: string;
  };
  search_cutoff?: boolean;
  search_time_ms: number;
  grouped_hits?: Array<{
    group_key: string[];
    hits: SearchHit<T>[];
  }>;
}

export interface MultiSearchResponse {
  results: SearchResponse[];
}

export interface FacetSearchResponse {
  facet_hits: Array<{
    count: number;
    highlighted: string;
    value: string;
  }>;
}

// Collection schema interfaces
export interface FieldSchema {
  name: string;
  type:
    | 'string'
    | 'string[]'
    | 'int32'
    | 'int64'
    | 'float'
    | 'bool'
    | 'geopoint'
    | 'object'
    | 'object[]'
    | 'auto';
  facet?: boolean;
  optional?: boolean;
  index?: boolean;
  sort?: boolean;
  infix?: boolean;
  locale?: string;
  stem?: boolean;
  drop?: boolean;
  reference?: string;
  range_index?: boolean;
  embed?: {
    from: string[];
    model_config: {
      model_name: string;
      api_key?: string;
      indexing_prefix?: string;
      query_prefix?: string;
    };
  };
}

export interface CollectionSchema {
  name: string;
  fields: FieldSchema[];
  default_sorting_field?: string;
  token_separators?: string[];
  symbols_to_index?: string[];
  enable_nested_fields?: boolean;
  metadata?: Record<string, any>;
}

// Analytics interfaces
export interface SearchAnalyticsEventCreateRequest {
  type: 'search' | 'click' | 'conversion' | 'visit';
  name: string;
  user_id?: string;
  timestamp?: number;
  data: {
    q?: string;
    collections?: string[];
    search_time_ms?: number;
    user_id?: string;
    document_id?: string;
    position?: number;
    object_id?: string;
  };
}

export interface AnalyticsRule {
  name: string;
  type: 'popular_queries' | 'nohits_queries' | 'counter';
  params: {
    source: {
      collections?: string[];
      events?: Array<{
        type: string;
        name: string;
      }>;
    };
    destination: {
      collection: string;
      counter_field?: string;
    };
    limit?: number;
  };
}

// Synonym interfaces
export interface SynonymSchema {
  id?: string;
  synonyms: string[];
  root?: string;
  locale?: string;
}

// Override interfaces
export interface SearchOverride {
  id?: string;
  rule: {
    query: string;
    match: 'exact' | 'contains';
  };
  includes?: Array<{
    id: string;
    position: number;
  }>;
  excludes?: Array<{
    id: string;
  }>;
  filter_by?: string;
  sort_by?: string;
  remove_matched_tokens?: boolean;
  replace_query?: string;
  effective_from_ts?: number;
  effective_to_ts?: number;
  stop_processing?: boolean;
  metadata?: Record<string, any>;
}

// Curation interfaces
export interface CurationSchema {
  id?: string;
  rule: {
    query: string;
    match: 'exact' | 'contains';
  };
  includes?: Array<{
    id: string;
    position: number;
  }>;
  excludes?: Array<{
    id: string;
  }>;
  filter_by?: string;
  sort_by?: string;
  effective_from_ts?: number;
  effective_to_ts?: number;
  stop_processing?: boolean;
  metadata?: Record<string, any>;
}

// API Key interfaces
export interface APIKeySchema {
  id?: number;
  description: string;
  actions: string[];
  collections: string[];
  value?: string;
  value_prefix?: string;
  expires_at?: number;
  autodelete?: boolean;
}

// Search suggestion interfaces
export interface SearchSuggestion {
  text: string;
  collection?: string;
  type?: 'query' | 'document' | 'category';
  score?: number;
  metadata?: Record<string, any>;
}

// User preference interfaces
export interface UserPreferences {
  user_id: string;
  categories?: string[];
  brands?: string[];
  price_range?: {
    min?: number;
    max?: number;
  };
  difficulty_level?: string[];
  language?: string;
  location?: {
    lat: number;
    lng: number;
    radius_km?: number;
  };
  interests?: string[];
  search_history?: string[];
  interaction_weights?: Record<string, number>;
  created_at: number;
  updated_at: number;
}

// Embedding provider interfaces
export interface EmbeddingConfig {
  provider: 'openai' | 'azure-openai' | 'google' | 'cohere' | 'huggingface';
  model: string;
  api_key?: string;
  endpoint?: string;
  dimensions?: number;
  max_tokens?: number;
}

// Utility type for search results with specific document types
export type ProductSearchResult = SearchResponse<Product>;
export type CourseSearchResult = SearchResponse<Course>;
export type DocumentSearchResult = SearchResponse<Document>;

// Union type for all possible search results
export type AnySearchResult =
  | ProductSearchResult
  | CourseSearchResult
  | DocumentSearchResult;
export type AnyDocument = Product | Course | Document;
export type SearchResult = SearchResponse; // Legacy compatibility

// Filter builder helper types
export interface FilterBuilder {
  field: string;
  operator: '=' | '!=' | '>' | '>=' | '<' | '<=' | 'in' | 'not in';
  value: string | number | boolean | (string | number)[];
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
  missing_values?: 'first' | 'last';
}

// Search context for analytics and personalization
export interface SearchContext {
  user_id?: string;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
    lat?: number;
    lng?: number;
  };
  device?: {
    type: 'mobile' | 'tablet' | 'desktop';
    os?: string;
    browser?: string;
  };
  referrer?: string;
  timestamp: number;
  experiment_id?: string;
  variant?: string;
}

// A/B testing interfaces
export interface ExperimentConfig {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  traffic_percentage: number;
  variants: Array<{
    id: string;
    name: string;
    weight: number;
    search_params?: Partial<SearchParams>;
    ui_config?: Record<string, any>;
  }>;
  metrics: string[];
  start_date: string;
  end_date?: string;
  created_at: number;
  updated_at: number;
}

// Performance monitoring interfaces
export interface SearchMetrics {
  query: string;
  collection: string;
  response_time_ms: number;
  result_count: number;
  user_id?: string;
  timestamp: number;
  cache_hit?: boolean;
  error?: string;
  filters?: Record<string, any>;
  sort_by?: string;
  page: number;
  per_page: number;
}

// Cache interfaces
export interface CacheConfig {
  ttl?: number; // Time to live in seconds
  max_size?: number; // Maximum cache size
  strategy?: 'lru' | 'lfu' | 'fifo';
  prefix?: string;
  enabled?: boolean;
}

// Rate limiting interfaces
export interface RateLimit {
  requests_per_minute?: number;
  requests_per_hour?: number;
  requests_per_day?: number;
  burst_capacity?: number;
}

// Webhook interfaces
export interface WebhookConfig {
  id?: string;
  name: string;
  url: string;
  events: string[];
  secret?: string;
  enabled: boolean;
  retry_config?: {
    max_attempts: number;
    backoff_multiplier: number;
    initial_delay_ms: number;
  };
  headers?: Record<string, string>;
  created_at?: number;
  updated_at?: number;
}
