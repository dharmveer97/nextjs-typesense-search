import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import type { Product, Course, Document } from '../../types/typesense';

/**
 * Collection Schemas with Advanced Features
 */

// Enhanced Products Collection (simplified without vector search)
export const productsSchema: CollectionCreateSchema = {
  name: 'products',
  enable_nested_fields: true,
  fields: [
    // Core fields
    { name: 'id', type: 'string', facet: false, index: false },
    { name: 'name', type: 'string', facet: false, index: true, infix: true },
    { name: 'title', type: 'string', facet: false, index: true, infix: true }, // Search compatibility
    {
      name: 'description',
      type: 'string',
      facet: false,
      index: true,
      stem: true,
    },
    {
      name: 'content',
      type: 'string',
      facet: false,
      index: true,
      stem: true,
      optional: true,
    },

    // Category and taxonomy
    { name: 'category', type: 'string', facet: true, index: true },
    {
      name: 'subcategory',
      type: 'string',
      facet: true,
      index: true,
      optional: true,
    },
    { name: 'brand', type: 'string', facet: true, index: true },
    { name: 'tags', type: 'string[]', facet: true, index: true },

    // Pricing and ratings
    {
      name: 'price',
      type: 'float',
      facet: true,
      sort: true,
      range_index: true,
    },
    { name: 'currency', type: 'string', facet: true, optional: true },
    {
      name: 'rating',
      type: 'float',
      facet: true,
      sort: true,
      range_index: true,
    },
    { name: 'reviews_count', type: 'int32', facet: false, sort: true },
    { name: 'popularity_score', type: 'float', facet: false, sort: true },

    // Inventory
    { name: 'in_stock', type: 'bool', facet: true },
    { name: 'stock_quantity', type: 'int32', facet: false, optional: true },
    { name: 'sku', type: 'string', facet: false, index: true, optional: true },

    // Media and attributes
    { name: 'image_url', type: 'string', facet: false, optional: true },
    { name: 'image_urls', type: 'string[]', facet: false, optional: true },
    { name: 'attributes', type: 'object', facet: false, optional: true },

    // Physical properties
    { name: 'weight', type: 'float', facet: false, optional: true },
    { name: 'dimensions', type: 'object', facet: false, optional: true },

    // Discounts and promotions
    {
      name: 'discount_percentage',
      type: 'float',
      facet: true,
      optional: true,
      range_index: true,
    },

    // Geo-location for local search
    { name: 'location', type: 'geopoint', facet: false, optional: true },

    // Timestamps
    { name: 'created_at', type: 'int64', facet: false, sort: true },
    { name: 'updated_at', type: 'int64', facet: false, sort: true },
  ],
  default_sorting_field: 'popularity_score',
  token_separators: ['-', '/', '(', ')', '[', ']'],
  symbols_to_index: ['+', '&'],
};

// Courses Collection for LMS
export const coursesSchema: CollectionCreateSchema = {
  name: 'courses',
  enable_nested_fields: true,
  fields: [
    // Core fields
    { name: 'id', type: 'string', facet: false, index: false },
    { name: 'title', type: 'string', facet: false, index: true, infix: true },
    {
      name: 'description',
      type: 'string',
      facet: false,
      index: true,
      stem: true,
    },
    { name: 'content', type: 'string', facet: false, index: true, stem: true },

    // Instructor information
    { name: 'instructor', type: 'string', facet: true, index: true },
    { name: 'instructor_id', type: 'string', facet: false, index: true },

    // Category and taxonomy
    { name: 'category', type: 'string', facet: true, index: true },
    {
      name: 'subcategory',
      type: 'string',
      facet: true,
      index: true,
      optional: true,
    },
    { name: 'difficulty', type: 'string', facet: true, index: true },
    { name: 'language', type: 'string', facet: true, index: true },
    { name: 'tags', type: 'string[]', facet: true, index: true },
    { name: 'skills', type: 'string[]', facet: true, index: true },
    { name: 'prerequisites', type: 'string[]', facet: false, optional: true },

    // Course metrics
    {
      name: 'duration_hours',
      type: 'float',
      facet: true,
      sort: true,
      range_index: true,
    },
    {
      name: 'price',
      type: 'float',
      facet: true,
      sort: true,
      range_index: true,
    },
    { name: 'currency', type: 'string', facet: true, optional: true },
    {
      name: 'rating',
      type: 'float',
      facet: true,
      sort: true,
      range_index: true,
    },
    { name: 'reviews_count', type: 'int32', facet: false, sort: true },
    { name: 'enrolled_count', type: 'int32', facet: false, sort: true },
    {
      name: 'completion_rate',
      type: 'float',
      facet: false,
      sort: true,
      optional: true,
    },

    // Course features
    {
      name: 'certificate_available',
      type: 'bool',
      facet: true,
      optional: true,
    },
    { name: 'thumbnail_url', type: 'string', facet: false, optional: true },
    { name: 'video_url', type: 'string', facet: false, optional: true },
    { name: 'chapters', type: 'object[]', facet: false, optional: true },

    // Timestamps
    { name: 'created_at', type: 'int64', facet: false, sort: true },
    { name: 'updated_at', type: 'int64', facet: false, sort: true },
    { name: 'last_updated', type: 'int64', facet: false, sort: true },
  ],
  default_sorting_field: 'rating',
  token_separators: ['-', '/', '(', ')', '[', ']'],
  symbols_to_index: ['+', '&', '#'],
};

// Documents Collection for Knowledge Base
export const documentsSchema: CollectionCreateSchema = {
  name: 'documents',
  enable_nested_fields: true,
  fields: [
    // Core fields
    { name: 'id', type: 'string', facet: false, index: false },
    { name: 'title', type: 'string', facet: false, index: true, infix: true },
    { name: 'content', type: 'string', facet: false, index: true, stem: true },
    {
      name: 'summary',
      type: 'string',
      facet: false,
      index: true,
      stem: true,
      optional: true,
    },

    // Author and metadata
    { name: 'author', type: 'string', facet: true, index: true },
    { name: 'category', type: 'string', facet: true, index: true },
    {
      name: 'subcategory',
      type: 'string',
      facet: true,
      index: true,
      optional: true,
    },
    { name: 'type', type: 'string', facet: true, index: true },
    { name: 'status', type: 'string', facet: true, index: true },
    { name: 'tags', type: 'string[]', facet: true, index: true },
    { name: 'language', type: 'string', facet: true, index: true },
    {
      name: 'difficulty',
      type: 'string',
      facet: true,
      index: true,
      optional: true,
    },

    // Content metrics
    { name: 'word_count', type: 'int32', facet: false, sort: true },
    {
      name: 'reading_time_minutes',
      type: 'int32',
      facet: true,
      range_index: true,
    },
    {
      name: 'views_count',
      type: 'int32',
      facet: false,
      sort: true,
      optional: true,
    },
    {
      name: 'likes_count',
      type: 'int32',
      facet: false,
      sort: true,
      optional: true,
    },

    // Media
    { name: 'featured_image', type: 'string', facet: false, optional: true },

    // Versioning
    { name: 'version', type: 'string', facet: true, optional: true },
    {
      name: 'last_reviewed',
      type: 'int64',
      facet: false,
      sort: true,
      optional: true,
    },

    // Timestamps
    { name: 'created_at', type: 'int64', facet: false, sort: true },
    { name: 'updated_at', type: 'int64', facet: false, sort: true },
  ],
  default_sorting_field: 'views_count',
  token_separators: ['-', '/', '(', ')', '[', ']', '|'],
  symbols_to_index: ['+', '&', '#', '@'],
};

// Analytics Collection for Search Metrics
export const analyticsSchema: CollectionCreateSchema = {
  name: 'search_analytics',
  enable_nested_fields: true,
  fields: [
    { name: 'id', type: 'string', facet: false, index: false },
    { name: 'query', type: 'string', facet: false, index: true },
    { name: 'collection', type: 'string', facet: true },
    {
      name: 'user_id',
      type: 'string',
      facet: false,
      index: true,
      optional: true,
    },
    {
      name: 'session_id',
      type: 'string',
      facet: false,
      index: true,
      optional: true,
    },
    { name: 'response_time_ms', type: 'int32', facet: false, sort: true },
    { name: 'result_count', type: 'int32', facet: false, sort: true },
    { name: 'clicked_position', type: 'int32', facet: false, optional: true },
    {
      name: 'clicked_document_id',
      type: 'string',
      facet: false,
      optional: true,
    },
    { name: 'filters_applied', type: 'object', facet: false, optional: true },
    { name: 'sort_by', type: 'string', facet: true, optional: true },
    { name: 'page', type: 'int32', facet: false },
    { name: 'per_page', type: 'int32', facet: false },
    { name: 'cache_hit', type: 'bool', facet: true, optional: true },
    { name: 'error', type: 'string', facet: false, optional: true },
    { name: 'timestamp', type: 'int64', facet: false, sort: true },
  ],
  default_sorting_field: 'timestamp',
};

// User Preferences Collection
export const userPreferencesSchema: CollectionCreateSchema = {
  name: 'user_preferences',
  enable_nested_fields: true,
  fields: [
    { name: 'user_id', type: 'string', facet: false, index: true },
    { name: 'categories', type: 'string[]', facet: true, optional: true },
    { name: 'brands', type: 'string[]', facet: true, optional: true },
    { name: 'price_range', type: 'object', facet: false, optional: true },
    { name: 'difficulty_level', type: 'string[]', facet: true, optional: true },
    { name: 'language', type: 'string', facet: true, optional: true },
    { name: 'location', type: 'object', facet: false, optional: true },
    { name: 'interests', type: 'string[]', facet: true, optional: true },
    { name: 'search_history', type: 'string[]', facet: false, optional: true },
    {
      name: 'interaction_weights',
      type: 'object',
      facet: false,
      optional: true,
    },
    { name: 'created_at', type: 'int64', facet: false, sort: true },
    { name: 'updated_at', type: 'int64', facet: false, sort: true },
  ],
  default_sorting_field: 'updated_at',
};

// Export all schemas
export const allSchemas = {
  products: productsSchema,
  courses: coursesSchema,
  documents: documentsSchema,
  search_analytics: analyticsSchema,
  user_preferences: userPreferencesSchema,
};

// Legacy export for backward compatibility
export const productSchema = productsSchema;

/**
 * Sample Data for Testing and Seeding
 */

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    title: 'Premium Wireless Headphones',
    description:
      'High-quality wireless headphones with active noise cancellation and 30-hour battery life.',
    content:
      'Experience premium audio with these professional-grade wireless headphones featuring advanced active noise cancellation technology, premium drivers, and an exceptional 30-hour battery life. Perfect for audiophiles, professionals, and anyone who demands the best in audio quality.',
    category: 'Electronics',
    subcategory: 'Audio',
    price: 299.99,
    currency: 'USD',
    rating: 4.5,
    reviews_count: 1250,
    in_stock: true,
    stock_quantity: 150,
    brand: 'AudioTech',
    tags: ['wireless', 'noise-cancellation', 'premium', 'bluetooth', 'audio'],
    sku: 'AT-WH-001',
    weight: 0.75,
    popularity_score: 8.7,
    discount_percentage: 10,
    location: [37.7749, -122.4194], // San Francisco [lat, lng]
    created_at: Date.now(),
    updated_at: Date.now(),
    image_url:
      'https://via.placeholder.com/300x300/4F46E5/ffffff?text=Headphones',
    image_urls: [
      'https://via.placeholder.com/300x300/4F46E5/ffffff?text=Headphones',
      'https://via.placeholder.com/300x300/4F46E5/ffffff?text=Side+View',
      'https://via.placeholder.com/300x300/4F46E5/ffffff?text=Case',
    ],
    attributes: {
      battery_life: '30 hours',
      wireless_range: '10 meters',
      frequency_response: '20Hz - 20kHz',
      driver_size: '40mm',
    },
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    title: 'Smart Watch Pro',
    description:
      'Advanced fitness tracking, heart rate monitoring, and smartphone integration.',
    content:
      'Stay connected and healthy with this advanced smartwatch featuring comprehensive fitness tracking, continuous heart rate monitoring, GPS, water resistance, and seamless smartphone integration. Track your workouts, monitor your health, and stay connected on the go.',
    category: 'Electronics',
    subcategory: 'Wearables',
    price: 399.99,
    currency: 'USD',
    rating: 4.3,
    reviews_count: 890,
    in_stock: true,
    stock_quantity: 75,
    brand: 'TechWear',
    tags: ['fitness', 'health', 'smart', 'wearable', 'gps'],
    sku: 'TW-SW-002',
    weight: 0.05,
    popularity_score: 7.8,
    discount_percentage: 5,
    created_at: Date.now(),
    updated_at: Date.now(),
    image_url:
      'https://via.placeholder.com/300x300/10B981/ffffff?text=Smart+Watch',
    attributes: {
      display_size: '1.4 inch',
      battery_life: '7 days',
      water_resistance: '50m',
      sensors: ['heart rate', 'gps', 'accelerometer', 'gyroscope'],
    },
  },
  {
    id: '3',
    name: 'Professional Camera Lens',
    title: 'Professional Camera Lens 50mm f/1.8',
    description:
      '50mm f/1.8 prime lens perfect for portrait photography with beautiful bokeh.',
    content:
      'Capture stunning portraits with this professional-grade 50mm f/1.8 prime lens. Features exceptional optical quality, beautiful bokeh, fast and accurate autofocus, and weather sealing. Ideal for portrait photographers, wedding photographers, and enthusiasts who demand professional results.',
    category: 'Photography',
    subcategory: 'Lenses',
    price: 599.99,
    currency: 'USD',
    rating: 4.8,
    reviews_count: 456,
    in_stock: true,
    stock_quantity: 25,
    brand: 'PhotoPro',
    tags: ['prime-lens', 'portrait', 'professional', 'dslr', 'photography'],
    sku: 'PP-50-003',
    weight: 0.6,
    popularity_score: 9.2,
    created_at: Date.now(),
    updated_at: Date.now(),
    image_url:
      'https://via.placeholder.com/300x300/EF4444/ffffff?text=Camera+Lens',
    attributes: {
      focal_length: '50mm',
      maximum_aperture: 'f/1.8',
      minimum_aperture: 'f/22',
      filter_diameter: '58mm',
      weather_sealed: true,
    },
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    title: 'Ergonomic Office Chair with Lumbar Support',
    description:
      'Adjustable lumbar support, breathable mesh back, and premium cushioning for all-day comfort.',
    content:
      'Work comfortably all day with this premium ergonomic office chair. Features adjustable lumbar support, breathable mesh backing, memory foam cushioning, and multiple adjustment points. Designed by ergonomic specialists to reduce back strain and improve posture during long work sessions.',
    category: 'Furniture',
    subcategory: 'Office',
    price: 449.99,
    currency: 'USD',
    rating: 4.6,
    reviews_count: 2100,
    in_stock: true,
    stock_quantity: 40,
    brand: 'ComfortSeating',
    tags: ['ergonomic', 'office', 'adjustable', 'mesh', 'lumbar-support'],
    sku: 'CS-OC-004',
    weight: 22.5,
    popularity_score: 8.1,
    discount_percentage: 15,
    created_at: Date.now(),
    updated_at: Date.now(),
    image_url:
      'https://via.placeholder.com/300x300/F59E0B/ffffff?text=Office+Chair',
    dimensions: {
      length: 65,
      width: 65,
      height: 120,
    },
    attributes: {
      material: 'mesh and fabric',
      weight_capacity: '120kg',
      warranty: '5 years',
      certifications: ['GREENGUARD', 'BIFMA'],
    },
  },
  {
    id: '5',
    name: 'Mechanical Gaming Keyboard',
    title: 'RGB Mechanical Gaming Keyboard',
    description:
      'RGB backlit mechanical keyboard with Cherry MX switches and programmable keys.',
    content:
      'Dominate your games with this premium mechanical gaming keyboard featuring Cherry MX Blue switches, customizable RGB backlighting, programmable macro keys, and dedicated gaming mode. Built for competitive gaming with ultra-responsive keys and anti-ghosting technology.',
    category: 'Electronics',
    subcategory: 'Gaming',
    price: 149.99,
    currency: 'USD',
    rating: 4.7,
    reviews_count: 3456,
    in_stock: false,
    stock_quantity: 0,
    brand: 'GameGear',
    tags: ['gaming', 'mechanical', 'rgb', 'cherry-mx', 'programmable'],
    sku: 'GG-MK-005',
    weight: 1.2,
    popularity_score: 9.5,
    discount_percentage: 20,
    created_at: Date.now(),
    updated_at: Date.now(),
    image_url:
      'https://via.placeholder.com/300x300/8B5CF6/ffffff?text=Keyboard',
    attributes: {
      switch_type: 'Cherry MX Blue',
      key_layout: 'Full-size',
      backlighting: 'RGB',
      connection: 'USB-C',
      anti_ghosting: true,
    },
  },
];

export const sampleCourses: Course[] = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    description:
      'Learn full-stack web development from beginner to advanced with HTML, CSS, JavaScript, React, Node.js, and databases.',
    content:
      'Master modern web development with this comprehensive bootcamp covering frontend and backend technologies. Build real-world projects and gain the skills needed for a career in web development.',
    instructor: 'Angela Yu',
    instructor_id: 'instructor_001',
    category: 'Technology',
    subcategory: 'Web Development',
    difficulty: 'beginner',
    duration_hours: 65,
    language: 'English',
    price: 199.99,
    currency: 'USD',
    rating: 4.7,
    reviews_count: 285000,
    enrolled_count: 850000,
    tags: ['web-development', 'javascript', 'react', 'nodejs', 'html', 'css'],
    skills: [
      'HTML5',
      'CSS3',
      'JavaScript',
      'React',
      'Node.js',
      'MongoDB',
      'Express',
    ],
    prerequisites: [
      'Basic computer skills',
      'No programming experience required',
    ],
    thumbnail_url:
      'https://via.placeholder.com/400x300/3B82F6/ffffff?text=Web+Dev',
    video_url: 'https://example.com/preview-video.mp4',
    certificate_available: true,
    completion_rate: 78.5,
    chapters: [
      { id: 'ch1', title: 'Introduction to Web Development', duration: 3 },
      { id: 'ch2', title: 'HTML Fundamentals', duration: 8 },
      { id: 'ch3', title: 'CSS and Styling', duration: 12 },
      { id: 'ch4', title: 'JavaScript Basics', duration: 15 },
      { id: 'ch5', title: 'React Framework', duration: 20 },
      { id: 'ch6', title: 'Backend with Node.js', duration: 7 },
    ],
    created_at: Date.now() - 365 * 24 * 60 * 60 * 1000, // 1 year ago
    updated_at: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    last_updated: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
  },
  {
    id: '2',
    title: 'Machine Learning with Python',
    description:
      'Master machine learning algorithms and techniques using Python, scikit-learn, and TensorFlow.',
    content:
      'Dive deep into machine learning with Python. Learn supervised and unsupervised learning, neural networks, deep learning, and how to build predictive models for real-world applications.',
    instructor: 'Jose Marcial Portilla',
    instructor_id: 'instructor_002',
    category: 'Technology',
    subcategory: 'Data Science',
    difficulty: 'intermediate',
    duration_hours: 45,
    language: 'English',
    price: 149.99,
    currency: 'USD',
    rating: 4.6,
    reviews_count: 45000,
    enrolled_count: 125000,
    tags: ['machine-learning', 'python', 'data-science', 'tensorflow', 'ai'],
    skills: [
      'Python',
      'Machine Learning',
      'Data Analysis',
      'TensorFlow',
      'scikit-learn',
    ],
    prerequisites: ['Python programming basics', 'Statistics fundamentals'],
    thumbnail_url:
      'https://via.placeholder.com/400x300/10B981/ffffff?text=ML+Python',
    certificate_available: true,
    completion_rate: 65.2,
    created_at: Date.now() - 200 * 24 * 60 * 60 * 1000,
    updated_at: Date.now() - 15 * 24 * 60 * 60 * 1000,
    last_updated: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
  {
    id: '3',
    title: 'Digital Marketing Masterclass',
    description:
      'Complete guide to digital marketing including SEO, social media, email marketing, and paid advertising.',
    content:
      'Become a digital marketing expert with this comprehensive course covering all aspects of online marketing. Learn to create effective campaigns, measure ROI, and grow businesses online.',
    instructor: 'Phil Ebiner',
    instructor_id: 'instructor_003',
    category: 'Marketing',
    subcategory: 'Digital Marketing',
    difficulty: 'beginner',
    duration_hours: 35,
    language: 'English',
    price: 99.99,
    currency: 'USD',
    rating: 4.5,
    reviews_count: 78000,
    enrolled_count: 245000,
    tags: [
      'digital-marketing',
      'seo',
      'social-media',
      'email-marketing',
      'ppc',
    ],
    skills: [
      'SEO',
      'Google Ads',
      'Facebook Marketing',
      'Email Marketing',
      'Analytics',
    ],
    prerequisites: ['Basic computer skills'],
    thumbnail_url:
      'https://via.placeholder.com/400x300/F59E0B/ffffff?text=Digital+Marketing',
    certificate_available: false,
    completion_rate: 72.8,
    created_at: Date.now() - 180 * 24 * 60 * 60 * 1000,
    updated_at: Date.now() - 20 * 24 * 60 * 60 * 1000,
    last_updated: Date.now() - 20 * 24 * 60 * 60 * 1000,
  },
];

export const sampleDocuments: Document[] = [
  {
    id: '1',
    title: 'Getting Started with Typesense',
    content:
      'Typesense is an open-source search engine that is built from the ground up to be simple to use, run, and scale. This comprehensive guide will help you get started with Typesense, from installation to advanced search features.',
    summary:
      'A comprehensive guide to getting started with Typesense search engine.',
    author: 'Typesense Team',
    category: 'Documentation',
    subcategory: 'Setup',
    type: 'guide',
    status: 'published',
    tags: ['typesense', 'search', 'setup', 'installation', 'guide'],
    language: 'English',
    word_count: 2500,
    reading_time_minutes: 10,
    featured_image:
      'https://via.placeholder.com/600x400/4F46E5/ffffff?text=Typesense+Guide',
    views_count: 15000,
    likes_count: 450,
    difficulty: 'beginner',
    version: '1.0',
    last_reviewed: Date.now() - 30 * 24 * 60 * 60 * 1000,
    created_at: Date.now() - 90 * 24 * 60 * 60 * 1000,
    updated_at: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: '2',
    title: 'Advanced Search Techniques in Typesense',
    content:
      'Learn advanced search techniques in Typesense including faceted search, vector search, federated search, and query rules. This tutorial covers best practices and optimization strategies for complex search scenarios.',
    summary:
      'Advanced techniques for implementing sophisticated search with Typesense.',
    author: 'Jason Bosco',
    category: 'Documentation',
    subcategory: 'Advanced',
    type: 'tutorial',
    status: 'published',
    tags: [
      'typesense',
      'advanced',
      'faceted-search',
      'vector-search',
      'optimization',
    ],
    language: 'English',
    word_count: 4500,
    reading_time_minutes: 18,
    views_count: 8500,
    likes_count: 320,
    difficulty: 'advanced',
    version: '2.1',
    last_reviewed: Date.now() - 15 * 24 * 60 * 60 * 1000,
    created_at: Date.now() - 60 * 24 * 60 * 60 * 1000,
    updated_at: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: '3',
    title: 'Next.js Integration with Typesense',
    content:
      'Step-by-step guide to integrating Typesense with Next.js applications. Covers client setup, API routes, server-side rendering, and best practices for production deployments.',
    summary:
      'Complete integration guide for using Typesense with Next.js applications.',
    author: 'Sarah Johnson',
    category: 'Tutorials',
    subcategory: 'Frameworks',
    type: 'tutorial',
    status: 'published',
    tags: ['nextjs', 'typesense', 'integration', 'react', 'ssr'],
    language: 'English',
    word_count: 3200,
    reading_time_minutes: 13,
    views_count: 12000,
    likes_count: 680,
    difficulty: 'intermediate',
    version: '1.2',
    last_reviewed: Date.now() - 10 * 24 * 60 * 60 * 1000,
    created_at: Date.now() - 45 * 24 * 60 * 60 * 1000,
    updated_at: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
];

// Export sample data collections
export const sampleData = {
  products: sampleProducts,
  courses: sampleCourses,
  documents: sampleDocuments,
};

// Helper function to get schema by name
export function getSchemaByName(name: string): CollectionCreateSchema | null {
  return allSchemas[name as keyof typeof allSchemas] || null;
}

// Helper function to get sample data by collection name
export function getSampleData(collectionName: string) {
  return sampleData[collectionName as keyof typeof sampleData] || [];
}
