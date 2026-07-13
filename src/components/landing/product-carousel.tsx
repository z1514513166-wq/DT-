'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Feature, TextStyle } from '@/types';
import { applyTextStyle } from '@/lib/text-styles';

export default function ProductCarousel({
  features, title, titleStyle, primaryColor, slug,
}: {
  features: Feature[]; title?: string; titleStyle?: TextStyle; primaryColor: string; slug: string;
}) {
  const [current, setCurrent] = useState(0);
  const pauseUntilRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = features.length;

  const touchStartX = useRef(0); const touchCurrentX = useRef(0); const swiping = useRef(false);

  const pause = useCallback((seconds: number) => { pauseUntilRef.current = Date.now() + seconds * 1000; }, []);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (total <= 1) return;
    intervalRef.current = setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return;
      setCurrent((prev) => (prev + 1) % total);
    }, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [total]);

  const prev = useCallback(() => { pause(5); setCurrent((c) => ((c - 1) % total + total) % total); }, [total, pause]);
  const next = useCallback(() => { pause(5); setCurrent((c) => (c + 1) % total); }, [total, pause]);
  const jump = useCallback((i: number) => { pause(5); setCurrent(i); }, [pause]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; touchCurrentX.current = e.touches[0].clientX; swiping.current = true; }, []);
  const handleTouchMove = useCallback((e: React.TouchEvent) => { if (!swiping.current) return; touchCurrentX.current = e.touches[0].clientX; }, []);
  const handleTouchEnd = useCallback(() => {
    if (!swiping.current) return; swiping.current = false;
    const dx = touchStartX.current - touchCurrentX.current;
    if (Math.abs(dx) > 50) { dx > 0 ? next() : prev(); }
  }, [next, prev]);

  if (total === 0) return null;

  return (
    <section className="py-8 md:py-16 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className={`text-gray-900 mb-3 ${applyTextStyle(titleStyle) || 'text-2xl md:text-4xl font-bold'}`}>
            {title || 'Core Features'}
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: primaryColor }} />
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 select-none shadow-sm"
          onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
          style={{ WebkitUserSelect: 'none', userSelect: 'none', touchAction: 'pan-y' }}>
          <div className="relative aspect-[4/5]">
            {features.map((f, i) => (
              <div key={f.id} className={`absolute inset-0 transition-opacity duration-500 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                {f.image ? (
                  <img src={f.image} alt={f.title} className="w-full h-full object-cover" draggable={false} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-100 text-gray-400">📷</div>
                )}
              </div>
            ))}
          </div>

          {total > 1 && (
            <>
              <button onClick={prev} className="absolute left-0 top-0 w-[40%] md:w-1/2 h-full z-20" style={{ background: 'transparent', border: 'none', WebkitTapHighlightColor: 'transparent' }}>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/10 flex items-center justify-center text-gray-500 text-lg md:text-xl font-bold" style={{ pointerEvents: 'none' }}>‹</span>
              </button>
              <button onClick={next} className="absolute right-0 top-0 w-[40%] md:w-1/2 h-full z-20" style={{ background: 'transparent', border: 'none', WebkitTapHighlightColor: 'transparent' }}>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/10 flex items-center justify-center text-gray-500 text-lg md:text-xl font-bold" style={{ pointerEvents: 'none' }}>›</span>
              </button>
            </>
          )}

          {total > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 md:gap-2">
              {features.map((_, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); jump(i); }} className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center" style={{ background: 'transparent', border: 'none', WebkitTapHighlightColor: 'transparent' }}>
                  <span className={`block rounded-full transition-all ${i === current ? 'bg-gray-600 w-3 md:w-4 h-1.5 md:h-2' : 'bg-gray-300 w-1.5 md:w-2 h-1.5 md:h-2'}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {total > 0 && (
          <div className="mt-4 text-center">
            <h3 className="text-lg md:text-2xl font-bold text-gray-900">{features[current]?.title || '(No title)'}</h3>
            <p className="text-gray-500 text-sm md:text-base mt-1 max-w-xl mx-auto">{features[current]?.description || '(No description)'}</p>
          </div>
        )}

        {total > 0 && features[current]?.detail && (
          <div className="flex justify-center mt-4">
            <Link href={`/lp/${slug}/product/${features[current]?.id}`}
              className="inline-block text-base md:text-lg font-semibold px-8 py-3 rounded-lg transition-all hover:scale-105 active:scale-95 text-white"
              style={{ backgroundColor: primaryColor }}>
              View Details →
            </Link>
          </div>
        )}

        {total > 1 && total <= 6 && (
          <div className="flex justify-center gap-2 mt-3 flex-wrap">
            {features.map((f, i) => (
              <button key={f.id} onClick={() => jump(i)}
                className={`w-14 h-9 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${i === current ? 'border-gray-800' : 'border-transparent opacity-50'}`}>
                {f.image ? <img src={f.image} alt="" className="w-full h-full object-cover" draggable={false} />
                  : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-400">No img</div>}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
