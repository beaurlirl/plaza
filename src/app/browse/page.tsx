'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, List, SlidersHorizontal, Sparkles } from 'lucide-react';

import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';

// Extended mock data for browse page
const allProducts = [
  {
    id: '1',
    title: 'MINIMALIST LEATHER JACKET',
    price: 1200,
    originalPrice: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    category: 'fashion' as const,
    aiMatch: 94,
    authenticity: 98,
    trending: true,
    views: 1247,
    likes: 89,
  },
  {
    id: '2',
    title: 'ABSTRACT CONTEMPORARY PIECE',
    price: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
    category: 'art' as const,
    aiMatch: 87,
    authenticity: 96,
    trending: false,
    views: 892,
    likes: 156,
  },
  {
    id: '3',
    title: 'GEOMETRIC SCULPTURE',
    price: 8900,
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    category: 'art' as const,
    aiMatch: 91,
    authenticity: 99,
    trending: true,
    views: 2341,
    likes: 287,
  },
  {
    id: '4',
    title: 'STRUCTURED BLAZER',
    price: 890,
    imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop',
    category: 'fashion' as const,
    aiMatch: 89,
    authenticity: 97,
    trending: false,
    views: 634,
    likes: 45,
  },
  {
    id: '5',
    title: 'VINTAGE WATCH COLLECTION',
    price: 2400,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: 'fashion' as const,
    aiMatch: 92,
    authenticity: 95,
    trending: true,
    views: 1567,
    likes: 234,
  },
  {
    id: '6',
    title: 'MODERN DIGITAL ART',
    price: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=400&fit=crop',
    category: 'art' as const,
    aiMatch: 88,
    authenticity: 94,
    trending: false,
    views: 743,
    likes: 67,
  },
];

export default function Browse() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'fashion' | 'art'>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'price' | 'trending' | 'newest'>('relevance');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = allProducts.filter(product => 
    selectedCategory === 'all' || product.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="heading-xl text-black mb-4">BROWSE</h1>
          <p className="body-text text-lg text-black/70 max-w-2xl">
            Explore our stylist-curated collection of premium fashion and fine art pieces.
          </p>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-panel rounded-3xl p-6 mb-12"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Category Filters */}
            <div className="flex items-center space-x-4">
              <span className="mono-text text-sm text-black/60">CATEGORY:</span>
              <div className="flex items-center space-x-2">
                {['all', 'fashion', 'art'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category as any)}
                    className={`px-4 py-2 rounded-2xl transition-colors ${
                      selectedCategory === category
                        ? 'bg-black text-white'
                        : 'hover:bg-black/5 text-black'
                    }`}
                  >
                    <span className="mono-text text-xs uppercase tracking-wide">
                      {category}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="mono-text text-sm text-black/60">SORT:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white/60 border-brutal border-black rounded-2xl px-4 py-2 mono-text text-xs uppercase tracking-wide outline-none"
                >
                                     <option value="relevance">RELEVANCE</option>
                  <option value="price">PRICE</option>
                  <option value="trending">TRENDING</option>
                  <option value="newest">NEWEST</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-2xl transition-colors ${
                    viewMode === 'grid' ? 'bg-black text-white' : 'hover:bg-black/5'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-2xl transition-colors ${
                    viewMode === 'list' ? 'bg-black text-white' : 'hover:bg-black/5'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Advanced Filters */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-brutal-outline flex items-center space-x-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>FILTERS</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t-brutal border-black"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div>
                  <label className="mono-text text-sm text-black/60 mb-2 block">PRICE RANGE</label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      className="w-full"
                    />
                    <div className="flex justify-between mono-text text-xs text-black/60">
                      <span>$0</span>
                      <span>$10K+</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="mono-text text-sm text-black/60 mb-2 block">AI MATCH</label>
                  <select className="w-full bg-white/60 border-brutal border-black rounded-2xl px-3 py-2 mono-text text-xs">
                    <option>ALL MATCHES</option>
                    <option>90%+ MATCH</option>
                    <option>95%+ MATCH</option>
                  </select>
                </div>
                
                <div>
                  <label className="mono-text text-sm text-black/60 mb-2 block">AUTHENTICITY</label>
                  <select className="w-full bg-white/60 border-brutal border-black rounded-2xl px-3 py-2 mono-text text-xs">
                    <option>ALL VERIFIED</option>
                    <option>98%+ AUTHENTIC</option>
                    <option>99%+ AUTHENTIC</option>
                  </select>
                </div>
                
                <div>
                  <label className="mono-text text-sm text-black/60 mb-2 block">TRENDING</label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="mono-text text-xs">TRENDING ONLY</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <span className="heading-md text-black">
              {filteredProducts.length} ITEMS
            </span>
                         <div className="ai-badge flex items-center space-x-2">
               <Sparkles className="w-3 h-3" />
               <span>CURATED</span>
             </div>
          </div>
          
          <div className="mono-text text-sm text-black/60">
            UPDATED 2 MINUTES AGO
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}
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

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button className="btn-brutal-outline flex items-center space-x-3 mx-auto">
            <Sparkles className="w-5 h-5" />
            <span>LOAD MORE AI RECOMMENDATIONS</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
} 