'use client';

import { User, ShoppingBag, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b-brutal border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="hover:opacity-70 transition-opacity">
              <h1 className="text-2xl font-light text-black lowercase nav-text">plaza</h1>
            </a>
          </div>


          {/* Tablet Navigation (md to lg) */}
          <nav className="hidden md:flex lg:hidden items-center space-x-2">
            <a href="/browse" className="nav-text-medium uppercase tracking-wide hover:text-black/60 transition-colors text-xs px-2 py-1">
              BROWSE
            </a>
            <a href="/sell" className="nav-text-medium uppercase tracking-wide hover:text-black/60 transition-colors text-xs px-2 py-1">
              SELL
            </a>
            <a href="/tools" className="nav-text-medium uppercase tracking-wide hover:text-black/60 transition-colors text-xs px-2 py-1">
              TOOLS
            </a>
            <button className="p-2 hover:bg-black/5 rounded-2xl transition-colors">
              <ShoppingBag className="w-5 h-5 text-black" />
            </button>
            <button className="p-2 hover:bg-black/5 rounded-2xl transition-colors">
              <User className="w-5 h-5 text-black" />
            </button>
          </nav>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <a href="/browse" className="nav-text-medium uppercase tracking-wide hover:text-black/60 transition-colors text-sm">
              BROWSE
            </a>
            <a href="/sell" className="nav-text-medium uppercase tracking-wide hover:text-black/60 transition-colors text-sm">
              SELL
            </a>
            <a href="/tools" className="nav-text-medium uppercase tracking-wide hover:text-black/60 transition-colors text-sm">
              TOOLS
            </a>
            <a href="/calendar" className="nav-text-medium uppercase tracking-wide hover:text-black/60 transition-colors text-sm">
              CALENDAR
            </a>
            <button className="p-3 hover:bg-black/5 rounded-2xl transition-colors">
              <ShoppingBag className="w-6 h-6 text-black" />
            </button>
            <button className="p-3 hover:bg-black/5 rounded-2xl transition-colors">
              <User className="w-6 h-6 text-black" />
            </button>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-1 sm:space-x-2">
            <button className="p-2 sm:p-3 hover:bg-black/5 rounded-2xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-black" />
            </button>
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 sm:p-3 hover:bg-black/5 rounded-2xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Menu className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
        

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t-brutal border-black max-h-[calc(100vh-80px)] overflow-y-auto">
            <nav className="p-3 sm:p-4 space-y-2 sm:space-y-4">
              <a href="/browse" className="block nav-text-medium uppercase tracking-wide hover:text-black/60 transition-colors text-sm py-2 sm:py-3 min-h-[44px] flex items-center">
                BROWSE
              </a>
              <a href="/sell" className="block nav-text-medium uppercase tracking-wide hover:text-black/60 transition-colors text-sm py-2 sm:py-3 min-h-[44px] flex items-center">
                SELL
              </a>
              <a href="/tools" className="block nav-text-medium uppercase tracking-wide hover:text-black/60 transition-colors text-sm py-2 sm:py-3 min-h-[44px] flex items-center">
                TOOLS
              </a>
              <a href="/calendar" className="block nav-text-medium uppercase tracking-wide hover:text-black/60 transition-colors text-sm py-2 sm:py-3 min-h-[44px] flex items-center">
                CALENDAR
              </a>
              <div className="pt-2 sm:pt-4 border-t border-black/20">
                <button className="flex items-center space-x-3 nav-text-medium uppercase tracking-wide text-sm py-2 sm:py-3 min-h-[44px] w-full">
                  <User className="w-5 h-5 text-black" />
                  <span>PROFILE</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 