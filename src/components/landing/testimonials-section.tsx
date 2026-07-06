'use client';

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
  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-white mb-4 ${applyTextStyle(titleStyle) || 'text-3xl md:text-4xl font-bold'}`}>
            {title || 'What Our Customers Say'}
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: primaryColor }} />
        </div>

        {/* 图片网格 - 自适应尺寸 */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((t) => (
            <div key={t.id} className="break-inside-avoid bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
              {/* 展示图片 - 自适应宽度，保持原始比例 */}
              {t.image ? (
                <img
                  src={t.image}
                  alt={t.name || 'Testimonial'}
                  className="w-full h-auto object-contain"
                />
              ) : (
                <div className="w-full aspect-[4/3] bg-gray-700 flex items-center justify-center text-4xl text-gray-500">
                  📷
                </div>
              )}

              {/* 底部信息 */}
              {(t.name || t.role || t.quote) && (
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {t.name ? t.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      {t.name && <p className="font-semibold text-white text-sm">{t.name}</p>}
                      {t.role && <p className="text-xs text-gray-400">{t.role}</p>}
                    </div>
                  </div>
                  {t.quote && (
                    <p className="text-gray-300 text-sm italic mt-2">&ldquo;{t.quote}&rdquo;</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
