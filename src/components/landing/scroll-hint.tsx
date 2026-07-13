'use client';

import { useEffect, useState } from 'react';

export default function ScrollHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 60) setVisible(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9998] pointer-events-none">
      <div className="flex flex-col items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-gray-200">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          style={{ animation: 'sba 1.8s ease-in-out infinite' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        <span className="text-gray-400 text-[10px] tracking-widest font-medium">SCROLL</span>
      </div>
      <style>{`
        @keyframes sba {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
