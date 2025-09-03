'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to landing page immediately
    router.replace('/landing');
  }, [router]);

  // Show minimal loading state while redirecting
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-normal lowercase text-black mb-4">plaza</h1>
        <div className="text-sm text-black/60">Loading...</div>
      </div>
    </div>
  );
}
