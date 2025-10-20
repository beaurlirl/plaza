'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function BackToHome() {
  return (
    <div className="fixed bottom-4 left-4 z-40">
      <Link
        href="/home"
        className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-black rounded-lg hover:bg-white/90 transition-all duration-200 shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-light">plaza</span>
      </Link>
    </div>
  );
}
