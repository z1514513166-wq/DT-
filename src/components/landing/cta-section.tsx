'use client';

import { LandingPageContent } from '@/types';
import { applyTextStyle } from '@/lib/text-styles';

interface CtaSectionProps {
  data: LandingPageContent['cta'];
  primaryColor: string;
}

export default function CtaSection({ data, primaryColor }: CtaSectionProps) {
  const headlineCls = applyTextStyle(data.headlineStyle) || 'text-3xl md:text-4xl font-bold';
  const subCls = applyTextStyle(data.subheadlineStyle) || 'text-lg';

  return (
    <section className="py-10 md:py-20 px-4 text-center" style={{ backgroundColor: data.backgroundColor }}>
      <div className="max-w-3xl mx-auto">
        <h2 className={`text-gray-900 mb-4 ${headlineCls}`}>{data.headline}</h2>
        <p className={`text-gray-500 ${subCls}`}>{data.subheadline}</p>
      </div>
    </section>
  );
}
