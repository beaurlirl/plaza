'use client';

import { useState } from 'react';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: 'clothing' | 'art' | 'accessories';
  aiMatch: number;
  authenticity: number;
  trending: boolean;
  views: number;
  likes: number;
}

export default function ProductCard({
  title,
  price,
  imageUrl,
  category,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDescription = () => {
    const descriptions: Record<string, string> = {
      'Minimalist Tee': 'Clean, comfortable cotton tee with minimalist design',
      'Abstract Print': 'Limited edition abstract art print on premium paper',
      'Design Notebook': 'Premium notebook for creatives and designers',
      'Classic Tote': 'Timeless leather tote for everyday use',
      'Wool Sweater': 'Soft merino wool sweater in classic fit',
      'Ceramic Vase': 'Handcrafted ceramic vase with organic form',
    };
    return descriptions[title] || 'Premium quality item';
  };

  return (
    <div className="group cursor-pointer">
      <div className="bg-white transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 mb-4 rounded-lg">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium text-black">
            {title}
          </h3>
          <p className="text-black/60 text-sm">
            {getDescription()}
          </p>
          <div className="text-lg font-medium text-black">
            {formatPrice(price)}
          </div>
          <div className="text-sm text-black/50 uppercase tracking-wide">
            {category}
          </div>
        </div>
      </div>
    </div>
  );
} 