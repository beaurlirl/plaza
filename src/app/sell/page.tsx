'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, Sparkles, TrendingUp, DollarSign, Shield, BarChart3 } from 'lucide-react';

import Header from '@/components/Header';

export default function Sell() {
  const [selectedCategory, setSelectedCategory] = useState<'fashion' | 'art'>('fashion');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImages(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
    
    if (files.length > 0) {
      setIsAnalyzing(true);
      setTimeout(() => setIsAnalyzing(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="heading-xl text-black mb-6">SELL WITH AI</h1>
          <p className="body-text text-xl text-black/80 max-w-3xl mx-auto">
            Upload your items and let artificial intelligence optimize pricing,
            descriptions, and market positioning for maximum returns.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Listing Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Category Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-panel rounded-3xl p-8"
            >
              <h2 className="heading-lg text-black mb-6">ITEM CATEGORY</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedCategory('fashion')}
                  className={`p-8 rounded-2xl border-brutal transition-all ${
                    selectedCategory === 'fashion'
                      ? 'border-black bg-black text-white'
                      : 'border-black/20 hover:border-black hover:bg-black/5'
                  }`}
                >
                  <div className="text-center">
                    <div className="heading-md mb-2">FASHION</div>
                    <div className="mono-text text-xs opacity-80">
                      CLOTHING • ACCESSORIES • LUXURY
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setSelectedCategory('art')}
                  className={`p-8 rounded-2xl border-brutal transition-all ${
                    selectedCategory === 'art'
                      ? 'border-black bg-black text-white'
                      : 'border-black/20 hover:border-black hover:bg-black/5'
                  }`}
                >
                  <div className="text-center">
                    <div className="heading-md mb-2">ART</div>
                    <div className="mono-text text-xs opacity-80">
                      PAINTINGS • SCULPTURES • DIGITAL
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Image Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-panel rounded-3xl p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Camera className="w-6 h-6 text-black" />
                <h2 className="heading-lg text-black">UPLOAD IMAGES</h2>
                <div className="ai-badge">AI ANALYSIS</div>
              </div>

              {uploadedImages.length === 0 ? (
                <label className="block">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="border-brutal border-black border-dashed rounded-2xl p-16 text-center cursor-pointer hover:bg-black/5 transition-colors">
                    <Upload className="w-16 h-16 text-black mx-auto mb-6" />
                    <h3 className="heading-md text-black mb-3">UPLOAD PRODUCT IMAGES</h3>
                    <p className="body-text text-black/60">
                      AI will analyze quality, authenticity markers, and optimize your listing
                    </p>
                  </div>
                </label>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover rounded-2xl border-brutal border-black"
                        />
                        {isAnalyzing && (
                          <div className="absolute inset-0 glass-panel-strong rounded-2xl flex items-center justify-center">
                            <div className="w-6 h-6 border-brutal border-black border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <label className="block">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="border-brutal border-black border-dashed rounded-2xl p-8 text-center cursor-pointer hover:bg-black/5 transition-colors">
                      <span className="mono-text text-sm text-black/60">+ ADD MORE IMAGES</span>
                    </div>
                  </label>
                </div>
              )}
            </motion.div>

            {/* Item Details Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-panel rounded-3xl p-8"
            >
              <h2 className="heading-lg text-black mb-6">ITEM DETAILS</h2>
              <div className="space-y-6">
                <div>
                  <label className="mono-text text-sm text-black/60 mb-2 block">TITLE</label>
                  <input
                    type="text"
                    placeholder="AI will suggest optimized titles"
                    className="w-full bg-white/60 border-brutal border-black rounded-2xl p-4 outline-none focus:bg-white/80 transition-colors body-text"
                  />
                </div>
                
                <div>
                  <label className="mono-text text-sm text-black/60 mb-2 block">DESCRIPTION</label>
                  <textarea
                    placeholder="Describe your item - AI will enhance and optimize"
                    rows={4}
                    className="w-full bg-white/60 border-brutal border-black rounded-2xl p-4 outline-none focus:bg-white/80 transition-colors body-text resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mono-text text-sm text-black/60 mb-2 block">YOUR PRICE</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full bg-white/60 border-brutal border-black rounded-2xl p-4 outline-none focus:bg-white/80 transition-colors body-text"
                    />
                  </div>
                  <div>
                    <label className="mono-text text-sm text-black/60 mb-2 block">CONDITION</label>
                    <select className="w-full bg-white/60 border-brutal border-black rounded-2xl p-4 outline-none mono-text text-sm">
                      <option>NEW</option>
                      <option>LIKE NEW</option>
                      <option>EXCELLENT</option>
                      <option>GOOD</option>
                      <option>FAIR</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="space-y-8">
            {/* AI Analysis Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-panel-strong rounded-3xl p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Sparkles className="w-6 h-6 text-black" />
                <h3 className="heading-md text-black">EXPERT INSIGHTS</h3>
              </div>

              {uploadedImages.length > 0 ? (
                <div className="space-y-6">
                  <div className="p-4 bg-white/40 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="mono-text text-xs text-black/60">AUTHENTICITY SCORE</span>
                      <span className="ai-badge">98%</span>
                    </div>
                    <div className="w-full h-2 bg-black/20 rounded-none">
                      <div className="confidence-bar w-[98%] rounded-none" />
                    </div>
                  </div>

                  <div className="p-4 bg-white/40 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="mono-text text-xs text-black/60">MARKET DEMAND</span>
                      <span className="ai-badge">HIGH</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-black" />
                      <span className="mono-text text-sm text-black">+24% THIS MONTH</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white/40 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="mono-text text-xs text-black/60">SUGGESTED PRICE</span>
                      <span className="ai-badge">$1,200-1,500</span>
                    </div>
                    <span className="mono-text text-xs text-black/60">
                      BASED ON 247 SIMILAR ITEMS
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-brutal border-black/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-6 h-6 text-black/40" />
                  </div>
                  <p className="mono-text text-sm text-black/60">
                    UPLOAD IMAGES FOR AI ANALYSIS
                  </p>
                </div>
              )}
            </motion.div>

            {/* Market Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-panel rounded-3xl p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <BarChart3 className="w-6 h-6 text-black" />
                <h3 className="heading-md text-black">MARKET DATA</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="mono-text text-sm text-black/60">AVG SALE TIME</span>
                  <span className="mono-text text-sm text-black font-bold">3.2 DAYS</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="mono-text text-sm text-black/60">SUCCESS RATE</span>
                  <span className="mono-text text-sm text-black font-bold">94%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="mono-text text-sm text-black/60">AVG MARKUP</span>
                  <span className="mono-text text-sm text-black font-bold">+18%</span>
                </div>
              </div>
            </motion.div>

            {/* Publish Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button className="btn-brutal w-full flex items-center justify-center space-x-3">
                <Sparkles className="w-5 h-5" />
                <span>PUBLISH WITH AI OPTIMIZATION</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 