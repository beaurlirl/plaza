'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Share2, 
  Shield, 
  TrendingUp, 
  Eye, 
  BarChart3, 
  Sparkles,
  ArrowLeft,
  ShoppingBag,
  Camera
} from 'lucide-react';

import Header from '@/components/Header';

// Mock product data
const productData = {
  id: '1',
  title: 'MINIMALIST LEATHER JACKET',
  price: 1200,
  originalPrice: 1500,
  description: 'Crafted from premium Italian leather with meticulous attention to detail. This minimalist jacket embodies contemporary luxury with clean lines and architectural silhouette.',
  images: [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1506629905057-bb0dd2a5b8e8?w=800&h=800&fit=crop',
  ],
  category: 'fashion',
  brand: 'STUDIO MINIMAL',
  condition: 'NEW',
  size: 'M',
  aiMatch: 94,
  authenticity: 98,
  trending: true,
  views: 1247,
  likes: 89,
  seller: {
    name: 'LUXURY_CURATOR',
    rating: 4.9,
    sales: 247,
    verified: true,
  },
  aiInsights: {
    priceAnalysis: {
      suggested: 1200,
      market: { min: 950, max: 1600 },
      confidence: 94,
    },
    authenticity: {
      score: 98,
      factors: ['Material Quality', 'Stitching Pattern', 'Hardware Details', 'Brand Markers'],
    },
    investment: {
      potential: 'HIGH',
      trend: '+24%',
      timeframe: '12 months',
    },
  },
};

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <button className="flex items-center space-x-3 hover:text-black/60 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="mono-text text-sm uppercase tracking-wide">BACK TO BROWSE</span>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Main Image */}
            <div className="glass-panel rounded-3xl overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={productData.images[selectedImage]}
                  alt={productData.title}
                  className="w-full h-full object-cover"
                />
                
                {/* AI Analysis Overlay */}
                <div className="absolute top-6 left-6 flex flex-col space-y-3">
                  <div className="ai-badge">
                    AI MATCH {productData.aiMatch}%
                  </div>
                  <div className="ai-badge bg-black flex items-center space-x-2">
                    <Shield className="w-3 h-3" />
                    <span>{productData.authenticity}% AUTH</span>
                  </div>
                  {productData.trending && (
                    <div className="ai-badge bg-black flex items-center space-x-2">
                      <TrendingUp className="w-3 h-3" />
                      <span>TRENDING</span>
                    </div>
                  )}
                </div>

                {/* 3D View Button */}
                <button className="absolute bottom-6 right-6 glass-panel-strong rounded-2xl p-3 hover:bg-black/10 transition-colors">
                  <Camera className="w-6 h-6 text-black" />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 gap-4">
              {productData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-2xl overflow-hidden border-brutal transition-all ${
                    selectedImage === index ? 'border-black' : 'border-black/20 hover:border-black/40'
                  }`}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Information */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Basic Info */}
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <span className="mono-text text-sm text-black/60 uppercase tracking-wider">
                  {productData.category}
                </span>
                <span className="mono-text text-sm text-black/60">•</span>
                <span className="mono-text text-sm text-black/60 uppercase">
                  {productData.brand}
                </span>
              </div>
              
              <h1 className="heading-xl text-black mb-6">
                {productData.title}
              </h1>

              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center space-x-3">
                  <span className="heading-lg text-black">
                    {formatPrice(productData.price)}
                  </span>
                  {productData.originalPrice && (
                    <span className="mono-text text-lg text-black/50 line-through">
                      {formatPrice(productData.originalPrice)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="p-3 glass-panel rounded-2xl hover:bg-black/5 transition-colors"
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-black text-black' : 'text-black'}`} />
                  </button>
                  <button className="p-3 glass-panel rounded-2xl hover:bg-black/5 transition-colors">
                    <Share2 className="w-6 h-6 text-black" />
                  </button>
                </div>
              </div>
            </div>

            {/* Size Selection */}
            {productData.category === 'fashion' && (
              <div className="glass-panel rounded-3xl p-6">
                <h3 className="heading-md text-black mb-4">SIZE</h3>
                <div className="grid grid-cols-4 gap-3">
                  {['XS', 'S', 'M', 'L'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`p-4 rounded-2xl border-brutal transition-all ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-black/20 hover:border-black'
                      }`}
                    >
                      <span className="mono-text text-sm font-bold">{size}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Purchase Actions */}
            <div className="space-y-4">
              <button className="btn-brutal w-full flex items-center justify-center space-x-3">
                <ShoppingBag className="w-5 h-5" />
                <span>ADD TO CART</span>
              </button>
              <button className="btn-brutal-outline w-full">
                BUY NOW
              </button>
            </div>

            {/* AI Insights */}
            <div className="glass-panel-strong rounded-3xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Sparkles className="w-6 h-6 text-black" />
                <h3 className="heading-md text-black">AI ANALYSIS</h3>
              </div>

              <div className="space-y-6">
                {/* Authenticity Analysis */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="mono-text text-sm text-black/60">AUTHENTICITY SCORE</span>
                    <span className="ai-badge">{productData.aiInsights.authenticity.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/20 rounded-none mb-3">
                    <div 
                      className="confidence-bar rounded-none"
                      style={{ width: `${productData.aiInsights.authenticity.score}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {productData.aiInsights.authenticity.factors.map((factor, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-black rounded-full" />
                        <span className="mono-text text-xs text-black/60">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Analysis */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="mono-text text-sm text-black/60">PRICE ANALYSIS</span>
                    <span className="ai-badge">{productData.aiInsights.priceAnalysis.confidence}% CONFIDENCE</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="mono-text text-xs text-black/60 mb-1">MARKET MIN</div>
                      <div className="mono-text text-sm font-bold text-black">
                        {formatPrice(productData.aiInsights.priceAnalysis.market.min)}
                      </div>
                    </div>
                    <div>
                      <div className="mono-text text-xs text-black/60 mb-1">SUGGESTED</div>
                      <div className="mono-text text-sm font-bold text-black">
                        {formatPrice(productData.aiInsights.priceAnalysis.suggested)}
                      </div>
                    </div>
                    <div>
                      <div className="mono-text text-xs text-black/60 mb-1">MARKET MAX</div>
                      <div className="mono-text text-sm font-bold text-black">
                        {formatPrice(productData.aiInsights.priceAnalysis.market.max)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Investment Potential */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="mono-text text-sm text-black/60">INVESTMENT POTENTIAL</span>
                    <span className="ai-badge">{productData.aiInsights.investment.potential}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <TrendingUp className="w-5 h-5 text-black" />
                    <span className="mono-text text-sm text-black">
                      {productData.aiInsights.investment.trend} over {productData.aiInsights.investment.timeframe}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="glass-panel rounded-3xl p-8">
              <h3 className="heading-md text-black mb-6">DETAILS</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="mono-text text-sm text-black/60">CONDITION</span>
                  <span className="mono-text text-sm font-bold text-black">{productData.condition}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="mono-text text-sm text-black/60">BRAND</span>
                  <span className="mono-text text-sm font-bold text-black">{productData.brand}</span>
                </div>
                {productData.size && (
                  <div className="flex items-center justify-between">
                    <span className="mono-text text-sm text-black/60">SIZE</span>
                    <span className="mono-text text-sm font-bold text-black">{productData.size}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="mono-text text-sm text-black/60">VIEWS</span>
                  <span className="mono-text text-sm font-bold text-black">{productData.views.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            <div className="glass-panel rounded-3xl p-8">
              <h3 className="heading-md text-black mb-6">SELLER</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {productData.seller.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="mono-text text-sm font-bold text-black">
                      {productData.seller.name}
                    </span>
                    {productData.seller.verified && (
                      <div className="ai-badge">VERIFIED</div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="mono-text text-xs text-black/60">
                      ⭐ {productData.seller.rating}
                    </span>
                    <span className="mono-text text-xs text-black/60">
                      {productData.seller.sales} SALES
                    </span>
                  </div>
                </div>
              </div>
              <button className="btn-brutal-outline w-full">
                VIEW SELLER PROFILE
              </button>
            </div>

            {/* Description */}
            <div className="glass-panel rounded-3xl p-8">
              <h3 className="heading-md text-black mb-6">DESCRIPTION</h3>
              <p className="body-text text-black/80 leading-relaxed">
                {productData.description}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <div className="text-center mb-16">
            <h2 className="heading-xl text-black mb-4">
              AI RECOMMENDATIONS
            </h2>
            <p className="body-text text-lg text-black/70">
              Similar items curated by artificial intelligence
            </p>
          </div>

          <div className="glass-panel-strong rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <Sparkles className="w-6 h-6 text-black" />
                <span className="heading-md text-black">SIMILAR ITEMS</span>
                <div className="ai-badge">92% MATCH CONFIDENCE</div>
              </div>
              <span className="mono-text text-sm text-black/60">
                BASED ON YOUR VIEWING HISTORY
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="glass-panel rounded-2xl p-4 hover:bg-black/5 transition-colors cursor-pointer">
                  <div className="aspect-square bg-black/10 rounded-2xl mb-4 flex items-center justify-center">
                    <span className="mono-text text-sm text-black/40">AI MATCH {90 + item}%</span>
                  </div>
                  <h4 className="heading-md text-black mb-2">SIMILAR ITEM {item}</h4>
                  <span className="mono-text text-sm text-black/60">$1,{100 + item * 50}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
} 