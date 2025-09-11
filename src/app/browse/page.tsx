'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';

// Simplified mock data for browse page
const allProducts = [
  {
    id: '1',
    title: 'Minimalist Tee',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: 'clothing' as const,
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
    aiMatch: 88,
    authenticity: 94,
    trending: false,
    views: 743,
    likes: 67,
  },
];

export default function Browse() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'clothing' | 'art' | 'accessories'>('all');

  const filteredProducts = allProducts.filter(product => 
    selectedCategory === 'all' || product.category === selectedCategory
  );

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
          <h1 className="heading-xl text-black mb-8">market</h1>
        </motion.div>

        {/* Simple Category Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-16"
        >
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