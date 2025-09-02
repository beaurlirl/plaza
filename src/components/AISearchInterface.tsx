'use client';

import { Upload, Camera, Mic, Sparkles, X, Search } from 'lucide-react';
import { useState, useRef } from 'react';

export default function AISearchInterface() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchMode, setSearchMode] = useState<'text' | 'image' | 'voice'>('text');
  const [query, setQuery] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setSearchMode('image');
        setIsProcessing(true);
        // Simulate AI processing
        setTimeout(() => setIsProcessing(false), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
    setSearchMode('text');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Interface */}
      <div className={`glass-panel-strong rounded-3xl transition-all duration-500 ${isExpanded ? 'p-6 md:p-8' : 'p-4 md:p-6'}`}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Sparkles className="w-8 h-8 text-black" />
              <div>
                <h2 className="heading-lg text-black">DISCOVERY</h2>
                <p className="mono-text text-sm text-black/60">
                  DESCRIBE • UPLOAD • DISCOVER
                </p>
              </div>
            </div>
            
            {/* Search Mode Toggles */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSearchMode('text')}
                className={`p-3 rounded-2xl transition-colors ${searchMode === 'text' ? 'bg-black text-white' : 'hover:bg-black/5'}`}
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`p-3 rounded-2xl transition-colors ${searchMode === 'image' ? 'bg-black text-white' : 'hover:bg-black/5'}`}
              >
                <Camera className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSearchMode('voice')}
                className={`p-3 rounded-2xl transition-colors ${searchMode === 'voice' ? 'bg-black text-white' : 'hover:bg-black/5'}`}
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Input Area */}
          <div className="space-y-4">
            {searchMode === 'text' && (
              <div className="relative">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="DESCRIBE WHAT YOU'RE LOOKING FOR..."
                  className="w-full h-24 bg-white/60 border-brutal border-black rounded-2xl p-4 resize-none outline-none focus:bg-white/80 transition-colors body-text placeholder-black/40"
                  onFocus={() => setIsExpanded(true)}
                />
                <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                  <span className="mono-text text-xs text-black/60">
                    INTELLIGENT
                  </span>
                  <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                </div>
              </div>
            )}

            {searchMode === 'image' && (
              <div className="space-y-4">
                {!uploadedImage ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-brutal border-black border-dashed rounded-2xl p-12 text-center cursor-pointer hover:bg-black/5 transition-colors"
                  >
                    <Upload className="w-12 h-12 text-black mx-auto mb-4" />
                    <h3 className="heading-md text-black mb-2">UPLOAD IMAGE</h3>
                    <p className="body-text text-black/60">
                      Drop an image or click to browse
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full h-64 object-cover rounded-2xl border-brutal border-black"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute top-4 right-4 p-2 glass-panel-strong rounded-2xl hover:bg-black/10 transition-colors"
                    >
                      <X className="w-5 h-5 text-black" />
                    </button>
                    
                    {isProcessing && (
                      <div className="absolute inset-0 glass-panel-strong rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-8 h-8 border-brutal border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                          <span className="mono-text text-sm text-black">
                            AI ANALYZING IMAGE...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {searchMode === 'voice' && (
              <div className="text-center p-12">
                <Mic className="w-16 h-16 text-black mx-auto mb-4 animate-pulse" />
                <h3 className="heading-md text-black mb-2">VOICE SEARCH</h3>
                <p className="body-text text-black/60">
                  Speak naturally to describe what you want
                </p>
                <button className="btn-brutal mt-6">
                  START LISTENING
                </button>
              </div>
            )}
          </div>

          {/* Search Button */}
          {(query || uploadedImage) && (
            <div className="flex justify-center">
              <button className="btn-brutal flex items-center space-x-3">
                <Sparkles className="w-5 h-5" />
                <span>SEARCH</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* AI Insights Panel */}
      {isExpanded && (
        <div className="mt-6 glass-panel rounded-3xl p-6 animate-slide-in">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-3 h-3 bg-black rounded-full animate-pulse" />
            <span className="mono-text text-sm text-black">EXPERT INSIGHTS</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/40 rounded-2xl">
              <span className="heading-md text-black">2.4K</span>
              <p className="mono-text text-xs text-black/60 mt-1">SIMILAR ITEMS</p>
            </div>
            <div className="text-center p-4 bg-white/40 rounded-2xl">
              <span className="heading-md text-black">94%</span>
              <p className="mono-text text-xs text-black/60 mt-1">MATCH ACCURACY</p>
            </div>
            <div className="text-center p-4 bg-white/40 rounded-2xl">
              <span className="heading-md text-black">$2.1K</span>
              <p className="mono-text text-xs text-black/60 mt-1">AVG PRICE RANGE</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 