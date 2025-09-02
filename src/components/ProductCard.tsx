'use client';

import { Heart, Eye, TrendingUp, Shield } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: 'fashion' | 'art';
  aiMatch: number;
  authenticity: number;
  trending: boolean;
  views: number;
  likes: number;
}

export default function ProductCard({
  title,
  price,
  originalPrice,
  imageUrl,
  category,
  aiMatch,
  authenticity,
  trending,
  views,
  likes
}: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div 
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`glass-panel rounded-3xl overflow-hidden transition-all duration-300 ${isHovered ? 'transform -translate-y-2 shadow-brutal-hover' : ''}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* AI Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {trending && (
              <div className="ai-badge bg-black flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>TRENDING</span>
              </div>
            )}
          </div>



          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute bottom-4 right-4 p-3 glass-panel-strong rounded-2xl hover:bg-black/10 transition-colors"
          >
            <Heart 
              className={`w-5 h-5 ${isLiked ? 'fill-black text-black' : 'text-black'}`} 
            />
          </button>

          {/* Quick Stats */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-4">
            <div className="flex items-center space-x-1 glass-panel-strong rounded-2xl px-3 py-1">
              <Eye className="w-4 h-4 text-black" />
              <span className="mono-text text-xs text-black">{views}</span>
            </div>
            <div className="flex items-center space-x-1 glass-panel-strong rounded-2xl px-3 py-1">
              <Heart className="w-4 h-4 text-black" />
              <span className="mono-text text-xs text-black">{likes}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <span className="mono-text text-xs text-black/60 uppercase tracking-wider">
                {category}
              </span>
              <h3 className="heading-md text-black mt-1 line-clamp-2">
                {title}
              </h3>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="heading-md text-black">
                {formatPrice(price)}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="mono-text text-sm text-black/50 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 