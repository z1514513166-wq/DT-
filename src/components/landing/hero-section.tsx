'use client';

import { LandingPageContent } from '@/types';
import { applyTextStyle } from '@/lib/text-styles';
interface HeroSectionProps {
  data: LandingPageContent['hero'];
  primaryColor: string;
}

export default function HeroSection({ data, primaryColor }: HeroSectionProps) {
  const headlineCls = applyTextStyle(data.headlineStyle) || 'text-4xl md:text-6xl font-bold';
  const subCls = applyTextStyle(data.subheadlineStyle) || 'text-lg md:text-xl';

  return (
    <section
      className="relative flex items-center justify-center min-h-[70vh] px-4 py-20"
      style={{ backgroundColor: data.backgroundColor }}
    >
      {data.backgroundImage && (
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${data.backgroundImage})` }} />
      )}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className={`text-white mb-6 leading-tight ${headlineCls}`}>
          {data.headline}
        </h1>
        <p className={`text-gray-300 max-w-2xl mx-auto ${subCls}`}>
          {data.subheadline}
        </p>
      </div>
    </section>
  );
}
