const Typesense = require('typesense');
require('dotenv').config({ path: '.env.local' });

const client = new Typesense.Client({
  nodes: [{
    host: process.env.NEXT_PUBLIC_TYPESENSE_HOST,
    port: parseInt(process.env.NEXT_PUBLIC_TYPESENSE_PORT),
    protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
  }],
  apiKey: process.env.TYPESENSE_ADMIN_API_KEY,
  connectionTimeoutSeconds: 2,
});

const productSchema = {
  name: 'products',
  enable_nested_fields: true,
  fields: [
    { name: 'id', type: 'string', facet: false },
    { name: 'name', type: 'string', facet: false },
    { name: 'description', type: 'string', facet: false },
    { name: 'category', type: 'string', facet: true },
    { name: 'subcategory', type: 'string', facet: true },
    { name: 'price', type: 'float', facet: true },
    { name: 'rating', type: 'float', facet: true },
    { name: 'reviews_count', type: 'int32', facet: false },
    { name: 'in_stock', type: 'bool', facet: true },
    { name: 'brand', type: 'string', facet: true },
    { name: 'tags', type: 'string[]', facet: true },
    { name: 'created_at', type: 'int64', facet: false },
    { name: 'updated_at', type: 'int64', facet: false },
    { name: 'image_url', type: 'string', facet: false, optional: true },
  ],
  default_sorting_field: 'rating',
};

const generateProducts = (count = 100) => {
  const categories = {
    'Electronics': ['Audio', 'Wearables', 'Gaming', 'Computer Accessories', 'Storage', 'Mobile', 'TV & Video'],
    'Photography': ['Lenses', 'Cameras', 'Accessories', 'Lighting', 'Tripods'],
    'Furniture': ['Office', 'Home', 'Outdoor', 'Bedroom', 'Living Room'],
    'Sports': ['Fitness', 'Outdoor', 'Team Sports', 'Water Sports', 'Winter Sports'],
    'Clothing': ['Men', 'Women', 'Kids', 'Shoes', 'Accessories'],
    'Books': ['Fiction', 'Non-Fiction', 'Educational', 'Comics', 'Magazines'],
    'Home & Garden': ['Kitchen', 'Bathroom', 'Garden', 'Decor', 'Tools'],
  };

  const brands = ['TechPro', 'SportMax', 'HomeStyle', 'BookWorld', 'FashionHub', 'PhotoGear', 'OfficeWorks', 'GardenLife'];
  const adjectives = ['Premium', 'Professional', 'Advanced', 'Smart', 'Ultra', 'Pro', 'Elite', 'Essential'];
  const productTypes = ['Device', 'Tool', 'Equipment', 'Accessory', 'System', 'Kit', 'Set', 'Collection'];

  const products = [];
  
  for (let i = 1; i <= count; i++) {
    const categoryKeys = Object.keys(categories);
    const category = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const subcategories = categories[category];
    const subcategory = subcategories[Math.floor(Math.random() * subcategories.length)];
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const productType = productTypes[Math.floor(Math.random() * productTypes.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    
    const name = `${adjective} ${subcategory} ${productType}`;
    const price = Math.round((Math.random() * 1000 + 10) * 100) / 100;
    const rating = Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0 to 5.0
    const reviews_count = Math.floor(Math.random() * 5000);
    
    const tags = [];
    if (price < 100) tags.push('budget');
    if (price > 500) tags.push('premium');
    if (rating >= 4.5) tags.push('top-rated');
    if (reviews_count > 1000) tags.push('popular');
    tags.push(category.toLowerCase());
    tags.push(subcategory.toLowerCase());
    
    products.push({
      id: `prod_${i}`,
      name,
      description: `High-quality ${name.toLowerCase()} from ${brand}. Perfect for ${subcategory.toLowerCase()} enthusiasts and professionals alike. Features advanced technology and durable construction.`,
      category,
      subcategory,
      price,
      rating,
      reviews_count,
      in_stock: Math.random() > 0.2,
      brand,
      tags,
      created_at: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      updated_at: Date.now(),
      image_url: `https://via.placeholder.com/300x300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=${encodeURIComponent(name)}`,
    });
  }
  
  return products;
};

async function seed() {
  try {
    console.log('Connecting to Typesense...');
    
    // Check if collection exists and delete it
    try {
      await client.collections('products').retrieve();
      console.log('Deleting existing collection...');
      await client.collections('products').delete();
    } catch (error) {
      console.log('Collection does not exist, creating new one...');
    }
    
    // Create collection
    console.log('Creating products collection...');
    await client.collections().create(productSchema);
    
    // Generate and import products
    const products = generateProducts(100);
    console.log(`Importing ${products.length} products...`);
    
    const importResult = await client
      .collections('products')
      .documents()
      .import(products, { action: 'create' });
    
    const successCount = importResult.filter(r => r.success).length;
    const failureCount = importResult.filter(r => !r.success).length;
    
    console.log(`Import complete!`);
    console.log(`✓ Successfully imported: ${successCount} products`);
    if (failureCount > 0) {
      console.log(`✗ Failed to import: ${failureCount} products`);
    }
    
    // Verify collection
    const collection = await client.collections('products').retrieve();
    console.log(`Total documents in collection: ${collection.num_documents}`);
    
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();