'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Testimonial, TextStyle } from '@/types';
import { applyTextStyle } from '@/lib/text-styles';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  title?: string;
  titleStyle?: TextStyle;
  primaryColor: string;
}

export default function TestimonialsSection({
  testimonials, title, titleStyle, primaryColor,
}: TestimonialsSectionProps) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const pauseUntilRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = testimonials.length;

  const touchStartX = useRef(0);
  const touchCurX = useRef(0);
  const swiping = useRef(false);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (total <= 1) return;
    intervalRef.current = setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return;
      setCurrent((prev) => (prev + 1) % total);
    }, 3500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [total]);

  const pause = useCallback(() => { pauseUntilRef.current = Date.now() + 5000; }, []);
  const prev = useCallback(() => { pause(); setCurrent((c) => ((c - 1) % total + total) % total); }, [total, pause]);
  const next = useCallback(() => { pause(); setCurrent((c) => (c + 1) % total); }, [total, pause]);
  const jump = useCallback((i: number) => { pause(); setCurrent(i); }, [pause]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX; touchCurX.current = e.touches[0].clientX; swiping.current = true;
  }, []);
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!swiping.current) return; touchCurX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback(() => {
    if (!swiping.current) return; swiping.current = false;
    const dx = touchStartX.current - touchCurX.current;
    if (Math.abs(dx) > 50) { dx > 0 ? next() : prev(); }
  }, [next, prev]);

  if (total === 0) return null;

  const item = testimonials[current];

  return (
    <>
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className={`text-white mb-4 ${applyTextStyle(titleStyle) || 'text-3xl md:text-4xl font-bold'}`}>
              {title || 'What Our Customers Say'}
            </h2>
            <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: primaryColor }} />
          </div>

          {/* Carousel */}
          <div
            className="relative overflow-hidden rounded-2xl bg-gray-800 border border-gray-700 select-none"
            onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
            style={{ WebkitUserSelect: 'none', userSelect: 'none', touchAction: 'pan-y' }}
          >
            <div className="relative aspect-[4/5] md:aspect-[16/10]">
              {item.image ? (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <img src={item.image} alt="" className="w-full h-full object-contain cursor-zoom-in" onClick={() => setLightbox(item.image)} draggable={false} />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl text-gray-600 bg-gray-700">📷</div>
              )}

              {/* Caption bottom */}
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-12 pb-5 px-6">
                  <p className="text-white text-sm md:text-base text-center font-medium">{item.caption}</p>
                </div>
              )}
            </div>

            {/* Arrows */}
            {total > 1 && (
              <>
                <button onClick={prev} className="absolute left-0 top-0 w-[40%] md:w-1/4 h-full z-20" style={{ background: 'transparent', border: 'none', WebkitTapHighlightColor: 'transparent' }} aria-label="上一个">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-lg md:text-xl font-bold shadow-lg" style={{ pointerEvents: 'none' }}>‹</span>
                </button>
                <button onClick={next} className="absolute right-0 top-0 w-[40%] md:w-1/4 h-full z-20" style={{ background: 'transparent', border: 'none', WebkitTapHighlightColor: 'transparent' }} aria-label="下一个">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-lg md:text-xl font-bold shadow-lg" style={{ pointerEvents: 'none' }}>›</span>
                </button>
              </>
            )}

            {/* Dots */}
            {total > 1 && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={(e) => { e.stopPropagation(); jump(i); }}
                    className="w-6 h-6 flex items-center justify-center" style={{ background: 'transparent', border: 'none', WebkitTapHighlightColor: 'transparent' }}>
                    <span className={`block rounded-full transition-all ${i === current ? 'bg-white w-3 h-1.5' : 'bg-white/40 w-1.5 h-1.5'}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10 w-10 h-10 flex items-center justify-center" onClick={() => setLightbox(null)}>✕</button>
          <img src={lightbox} alt="" className="max-w-full max-h-[95vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
