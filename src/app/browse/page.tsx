'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';

// Enhanced mock data with seller and country information
const allProducts = [
  {
    id: '1',
    title: 'Minimalist Tee',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: 'clothing' as const,
    seller: 'STUDIO_MINIMAL',
    country: 'Japan',
    aiMatch: 94,
    authenticity: 98,
    trending: true,
    views: 1247,
    likes: 89,
  },
  {
    id: '2',
    title: 'Abstract Print',
    price: 85,
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
    category: 'art' as const,
    seller: 'BERLIN_COLLECTIVE',
    country: 'Germany',
    aiMatch: 87,
    authenticity: 96,
    trending: false,
    views: 892,
    likes: 156,
  },
  {
    id: '3',
    title: 'Design Notebook',
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
    category: 'accessories' as const,
    seller: 'CRAFT_STUDIO',
    country: 'Italy',
    aiMatch: 91,
    authenticity: 99,
    trending: true,
    views: 2341,
    likes: 287,
  },
  {
    id: '4',
    title: 'Classic Tote',
    price: 120,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: 'accessories' as const,
    seller: 'LUXURY_CURATOR',
    country: 'France',
    aiMatch: 89,
    authenticity: 97,
    trending: false,
    views: 634,
    likes: 45,
  },
  {
    id: '5',
    title: 'Wool Sweater',
    price: 95,
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop',
    category: 'clothing' as const,
    seller: 'NORDIC_THREADS',
    country: 'Sweden',
    aiMatch: 92,
    authenticity: 95,
    trending: true,
    views: 1567,
    likes: 234,
  },
  {
    id: '6',
    title: 'Ceramic Vase',
    price: 65,
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=400&fit=crop',
    category: 'art' as const,
    seller: 'ATELIER_CLAY',
    country: 'Portugal',
    aiMatch: 88,
    authenticity: 94,
    trending: false,
    views: 743,
    likes: 67,
  },
  {
    id: '7',
    title: 'Vintage Denim',
    price: 75,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
    category: 'clothing' as const,
    seller: 'STUDIO_MINIMAL',
    country: 'Japan',
    aiMatch: 90,
    authenticity: 96,
    trending: true,
    views: 1124,
    likes: 156,
  },
  {
    id: '8',
    title: 'Modern Sculpture',
    price: 320,
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop',
    category: 'art' as const,
    seller: 'BERLIN_COLLECTIVE',
    country: 'Germany',
    aiMatch: 93,
    authenticity: 99,
    trending: false,
    views: 567,
    likes: 78,
  },
];

export default function Browse() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'clothing' | 'art' | 'accessories'>('all');
  const [selectedSeller, setSelectedSeller] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  // Get unique sellers and countries for filter options
  const uniqueSellers = Array.from(new Set(allProducts.map(p => p.seller))).sort();
  const uniqueCountries = Array.from(new Set(allProducts.map(p => p.country))).sort();

  const filteredProducts = allProducts.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const sellerMatch = selectedSeller === 'all' || product.seller === selectedSeller;
    const countryMatch = selectedCountry === 'all' || product.country === selectedCountry;
    
    return categoryMatch && sellerMatch && countryMatch;
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-16">
        {/* Minimal Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="heading-lg text-black mb-8">market</h1>
        </motion.div>

        {/* Enhanced Filter Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16 space-y-8"
        >
          {/* Category Filter */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-8">
              {[
                { key: 'all', label: 'All' },
                { key: 'clothing', label: 'Clothing' },
                { key: 'art', label: 'Art' },
                { key: 'accessories', label: 'Accessories' }
              ].map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key as any)}
                  className={`text-lg font-medium transition-colors ${
                    selectedCategory === category.key
                      ? 'text-black border-b-2 border-black pb-2'
                      : 'text-black/50 hover:text-black/80'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Seller and Country Filters */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-12">
              {/* Seller Filter */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium text-black/70 mb-2">Artist/Seller</label>
                <select
                  value={selectedSeller}
                  onChange={(e) => setSelectedSeller(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 bg-white text-sm min-w-[160px]"
                >
                  <option value="all">All Sellers</option>
                  {uniqueSellers.map((seller) => (
                    <option key={seller} value={seller}>
                      {seller.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country Filter */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium text-black/70 mb-2">Country</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 bg-white text-sm min-w-[160px]"
                >
                  <option value="all">All Countries</option>
                  {uniqueCountries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedSeller !== 'all' || selectedCountry !== 'all') && (
            <div className="flex justify-center">
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-black/50">Active filters:</span>
                {selectedSeller !== 'all' && (
                  <span className="px-3 py-1 bg-black/5 rounded-full text-black">
                    {selectedSeller.replace(/_/g, ' ')}
                    <button
                      onClick={() => setSelectedSeller('all')}
                      className="ml-2 text-black/40 hover:text-black"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedCountry !== 'all' && (
                  <span className="px-3 py-1 bg-black/5 rounded-full text-black">
                    {selectedCountry}
                    <button
                      onClick={() => setSelectedCountry('all')}
                      className="ml-2 text-black/40 hover:text-black"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
} 