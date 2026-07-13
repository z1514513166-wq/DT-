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

  const touchStartX = useRef(0); const touchCurX = useRef(0); const swiping = useRef(false);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX; touchCurX.current = e.touches[0].clientX; swiping.current = true;
  }, []);
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!swiping.current) return; touchCurX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback(() => {
    if (!swiping.current) return; swiping.current = false;
    if (Math.abs(touchStartX.current - touchCurX.current) > 50) { touchStartX.current > touchCurX.current ? next() : prev(); }
  }, [next, prev]);

  if (total === 0) return null;

  const prevIdx = (current - 1 + total) % total;
  const nextIdx = (current + 1) % total;
  const ease = 'cubic-bezier(0.4, 0, 0.2, 1)';

  return (
    <>
      <section className="py-10 md:py-20 px-4 bg-gray-50">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h2 className={`text-gray-900 mb-4 ${applyTextStyle(titleStyle) || 'text-3xl md:text-4xl font-bold'}`}>
              {title || 'What Our Customers Say'}
            </h2>
            <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: primaryColor }} />
          </div>

          {/* 叠放轮播 */}
          <div className="relative" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
            style={{ WebkitUserSelect: 'none', userSelect: 'none', touchAction: 'pan-y' }}>
            <div className="relative aspect-[4/5] select-none">

              {/* 左虚影 - 叠在下方 */}
              {total > 1 && (
                <div className="absolute inset-0 transition-all duration-600 rounded-xl overflow-hidden bg-gray-100"
                  style={{
                    zIndex: 0,
                    opacity: 0.25,
                    transform: 'scale(0.7) translateX(-30%)',
                    transitionTimingFunction: ease,
                  }}>
                  {testimonials[prevIdx].image ? (
                    <img src={testimonials[prevIdx].image} alt="" className="w-full h-full object-contain" draggable={false} />
                  ) : <div className="w-full h-full flex items-center justify-center text-gray-500">📷</div>}
                </div>
              )}

              {/* 右虚影 - 叠在下方 */}
              {total > 1 && (
                <div className="absolute inset-0 transition-all duration-600 rounded-xl overflow-hidden bg-gray-100"
                  style={{
                    zIndex: 0,
                    opacity: 0.25,
                    transform: 'scale(0.7) translateX(30%)',
                    transitionTimingFunction: ease,
                  }}>
                  {testimonials[nextIdx].image ? (
                    <img src={testimonials[nextIdx].image} alt="" className="w-full h-full object-contain" draggable={false} />
                  ) : <div className="w-full h-full flex items-center justify-center text-gray-500">📷</div>}
                </div>
              )}

              {/* 中间主图 - 在最上层 */}
              <div className="absolute inset-0 transition-all duration-600 rounded-xl overflow-hidden bg-white border border-gray-200 shadow-lg cursor-zoom-in"
                style={{
                  zIndex: 10,
                  transform: 'scale(0.85)',
                  transitionTimingFunction: ease,
                }}
                onClick={() => testimonials[current].image && setLightbox(testimonials[current].image)}>
                {testimonials[current].image ? (
                  <img src={testimonials[current].image} alt="" className="w-full h-full object-contain" draggable={false} />
                ) : <div className="w-full h-full flex items-center justify-center text-5xl text-gray-500">📷</div>}
                {testimonials[current].caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent pt-10 pb-4 px-4">
                    <p className="text-white text-sm text-center font-medium">{testimonials[current].caption}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 点击区 */}
            {total > 1 && (
              <>
                <button onClick={prev} className="absolute left-0 top-0 w-1/3 h-full z-20"
                  style={{ background: 'transparent', border: 'none', WebkitTapHighlightColor: 'transparent' }} />
                <button onClick={next} className="absolute right-0 top-0 w-1/3 h-full z-20"
                  style={{ background: 'transparent', border: 'none', WebkitTapHighlightColor: 'transparent' }} />
              </>
            )}
          </div>

          {/* Dots */}
          {total > 1 && (
            <div className="flex justify-center items-center gap-1.5 mt-6">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => jump(i)}
                  style={{ background: 'transparent', border: 'none', WebkitTapHighlightColor: 'transparent' }}>
                  <div className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-gray-600 scale-125' : 'bg-gray-300'}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white text-3xl z-10" onClick={() => setLightbox(null)}>✕</button>
          <img src={lightbox} alt="" className="max-w-full max-h-[95vh] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
