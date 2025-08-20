# 🔍 Next.js Typesense Search

A modern e-commerce search application built with **Next.js 14**, **Typesense**, and **Tailwind CSS**. Server-side rendered with advanced search features.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Typesense](https://img.shields.io/badge/Typesense-Latest-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

- 🔍 **Fast Search** - Powered by Typesense for instant results
- 🎯 **Smart Filters** - Category, brand, price, rating filters
- 📱 **Mobile Responsive** - Works on all device sizes
- ⚡ **Server-Side Rendering** - Fast page loads and SEO friendly
- 🎨 **Modern UI** - Clean design with Tailwind CSS
- 💾 **Mock Data Fallback** - Works offline with sample data
- 🔧 **Easy Setup** - Simple configuration and deployment

## 🚀 Quick Start

### 1️⃣ Prerequisites

Before starting, make sure you have:

```bash
# Check if you have these installed
node --version    # Should be 18+ 
npm --version     # Should be 8+
docker --version  # Should be 20+
```

If you don't have these, install:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 2️⃣ Clone Repository

```bash
# Download the code
git clone https://github.com/YOUR_USERNAME/nextjs-typesense-search
cd nextjs-typesense-search
```

### 3️⃣ Install Dependencies

```bash
# Install all required packages
npm install
```

### 4️⃣ Start Typesense (Choose One Option)

#### Option A: Using Docker (Recommended)

```bash
# Start Typesense server
docker run -p 8108:8108 -v/tmp/data:/data typesense/typesense:27.0 \
  --data-dir /data --api-key=xyz --listen-port 8108 --enable-cors
```

#### Option B: Using Typesense Cloud

1. Go to [Typesense Cloud](https://cloud.typesense.org/)
2. Create a free account
3. Create a new cluster
4. Get your API details

### 5️⃣ Configure Environment

Create `.env.local` file:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local`:

```env
# For Local Docker (Option A)
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=xyz

# For Typesense Cloud (Option B)
# TYPESENSE_HOST=your-cluster.typesense.net
# TYPESENSE_PORT=443
# TYPESENSE_PROTOCOL=https
# TYPESENSE_API_KEY=your-api-key
```

### 6️⃣ Start Development Server

```bash
# Start the app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser! 🎉

## 📁 Project Structure

```
nextjs-typesense-search/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Home page (redirects to search)
│   ├── search/server/page.tsx   # Main search page
│   └── globals.css              # Global styles
├── components/
│   └── ui/
│       ├── skeleton.tsx         # Loading animations
│       └── empty-state.tsx      # Empty search states
├── lib/
│   ├── typesense/
│   │   ├── server.ts           # Server-side Typesense logic
│   │   └── mock-data.ts        # Sample products for testing
│   └── utils.ts                # Helper functions
├── types/
│   └── typesense.ts            # TypeScript definitions
├── .env.example                # Environment variables template
└── README.md                   # This file
```

## 🛠️ How It Works

### 1. Search Flow

```
User enters search → Next.js Server → Typesense → Results displayed
```

### 2. Filter Flow

```
User clicks filter → URL updates → Server re-renders → New results shown
```

### 3. Data Flow

- **First Load**: App checks if Typesense is available
- **With Typesense**: Uses real search engine for fast results
- **Without Typesense**: Falls back to mock data automatically
- **Search**: Server-side rendering for fast page loads

## 🔧 Configuration

### Typesense Schema

The app uses this product schema:

```javascript
{
  name: 'products',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'description', type: 'string' },
    { name: 'category', type: 'string', facet: true },
    { name: 'brand', type: 'string', facet: true },
    { name: 'price', type: 'float', facet: true },
    { name: 'rating', type: 'float' },
    { name: 'in_stock', type: 'bool', facet: true },
    // ... more fields
  ]
}
```

### Sample Product Data

The app includes sample products like:
- Premium Wireless Headphones
- Smart Watch Pro  
- Professional Camera Lens
- Ergonomic Office Chair
- Mechanical Gaming Keyboard

## 🐛 Troubleshooting

### Problem: "Connection failed"
**Solution**: Make sure Typesense is running
```bash
# Check if Typesense is running
curl http://localhost:8108/health
```

### Problem: "No results found"
**Solution**: Data might not be loaded
```bash
# Restart the dev server
npm run dev
```

### Problem: "Styles not working"
**Solution**: Clear Next.js cache
```bash
rm -rf .next
npm run dev
```

### Problem: "Docker not starting"
**Solution**: Make sure Docker Desktop is running

## 📱 Usage Examples

### Basic Search
1. Go to [http://localhost:3000](http://localhost:3000)
2. Type "headphones" in search box
3. Press Enter
4. See instant results!

### Using Filters
1. Search for products
2. Click category filters (Electronics, Furniture, etc.)
3. Select price ranges
4. Choose availability (In Stock/Out of Stock)
5. Results update automatically

### Sorting
1. Use sort dropdown
2. Options: Relevance, Price (Low/High), Rating, Newest
3. Results re-order instantly

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

### Deploy to Netlify

1. Push code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Import your repository
4. Add environment variables
5. Deploy!

## 🤝 Contributing

Want to help improve this project?

1. Fork the repository
2. Create your branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

Need help? Here's how to get support:

- 🐛 **Bug Reports**: [Open an issue](https://github.com/YOUR_USERNAME/nextjs-typesense-search/issues)
- 💡 **Feature Requests**: [Open an issue](https://github.com/YOUR_USERNAME/nextjs-typesense-search/issues)
- 💬 **Questions**: [Start a discussion](https://github.com/YOUR_USERNAME/nextjs-typesense-search/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Typesense](https://typesense.org/) - Amazing search engine
- [Next.js](https://nextjs.org/) - Fantastic React framework
- [Tailwind CSS](https://tailwindcss.com/) - Beautiful styling
- [Heroicons](https://heroicons.com/) - Great icons

---

**Made with ❤️ for developers who love great search experiences**