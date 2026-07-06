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
          <div
            className="w-20 h-1 mx-auto rounded-full"
            style={{ backgroundColor: primaryColor }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  {t.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-gray-400">{t.role}</p>
                </div>
              </div>
              <blockquote className="text-gray-300 italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
