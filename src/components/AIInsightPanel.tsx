'use client';

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Shield, BarChart3, Zap } from 'lucide-react';

interface AIInsightPanelProps {
  title: string;
  insights: {
    authenticity?: number;
    marketDemand?: 'LOW' | 'MEDIUM' | 'HIGH';
    priceConfidence?: number;
    trendDirection?: string;
    similarItems?: number;
    avgPrice?: number;
  };
  className?: string;
}

export default function AIInsightPanel({ title, insights, className = '' }: AIInsightPanelProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'HIGH': return 'bg-black text-white';
      case 'MEDIUM': return 'bg-black/60 text-white';
      case 'LOW': return 'bg-black/30 text-black';
      default: return 'bg-black/20 text-black';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`glass-panel-strong rounded-3xl p-8 ${className}`}
    >
      <div className="flex items-center space-x-3 mb-8">
        <Sparkles className="w-6 h-6 text-black" />
        <h3 className="heading-md text-black">{title}</h3>
        <div className="ai-badge">EXPERT VERIFIED</div>
      </div>

      <div className="space-y-6">
        {/* Authenticity Score */}
        {insights.authenticity && (
          <div className="p-6 bg-white/40 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-black" />
                <span className="mono-text text-sm text-black/60">AUTHENTICITY</span>
              </div>
              <span className="ai-badge">{insights.authenticity}%</span>
            </div>
            <div className="w-full h-3 bg-black/20 rounded-none">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${insights.authenticity}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="confidence-bar h-3 rounded-none"
              />
            </div>
          </div>
        )}

        {/* Market Demand */}
        {insights.marketDemand && (
          <div className="p-6 bg-white/40 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-black" />
                <span className="mono-text text-sm text-black/60">MARKET DEMAND</span>
              </div>
              <span className={`px-3 py-1 rounded-none mono-text text-xs font-bold ${getDemandColor(insights.marketDemand)}`}>
                {insights.marketDemand}
              </span>
            </div>
            {insights.trendDirection && (
              <div className="flex items-center space-x-2">
                <span className="mono-text text-sm text-black">
                  {insights.trendDirection} THIS MONTH
                </span>
              </div>
            )}
          </div>
        )}

        {/* Price Confidence */}
        {insights.priceConfidence && (
          <div className="p-6 bg-white/40 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-black" />
                <span className="mono-text text-sm text-black/60">PRICE ACCURACY</span>
              </div>
              <span className="ai-badge">{insights.priceConfidence}%</span>
            </div>
            <div className="w-full h-3 bg-black/20 rounded-none">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${insights.priceConfidence}%` }}
                transition={{ duration: 1, delay: 0.7 }}
                className="confidence-bar h-3 rounded-none"
              />
            </div>
          </div>
        )}

        {/* Market Data */}
        {(insights.similarItems || insights.avgPrice) && (
          <div className="grid grid-cols-2 gap-4">
            {insights.similarItems && (
              <div className="text-center p-4 bg-white/40 rounded-2xl">
                <div className="heading-md text-black mb-1">
                  {insights.similarItems.toLocaleString()}
                </div>
                <div className="mono-text text-xs text-black/60">SIMILAR ITEMS</div>
              </div>
            )}
            
            {insights.avgPrice && (
              <div className="text-center p-4 bg-white/40 rounded-2xl">
                <div className="heading-md text-black mb-1">
                  {formatPrice(insights.avgPrice)}
                </div>
                <div className="mono-text text-xs text-black/60">AVG MARKET PRICE</div>
              </div>
            )}
          </div>
        )}

        {/* AI Processing Indicator */}
        <div className="flex items-center justify-center space-x-3 pt-4 border-t-brutal border-black/20">
          <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
          <span className="mono-text text-xs text-black/60">
            REAL-TIME AI ANALYSIS
          </span>
          <div className="w-2 h-2 bg-black rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
    </motion.div>
  );
} 