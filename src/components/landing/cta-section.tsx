'use client';

import { LandingPageContent } from '@/types';

interface CtaSectionProps {
  data: LandingPageContent['cta'];
  primaryColor: string;
}

export default function CtaSection({ data, primaryColor }: CtaSectionProps) {
  return (
    <section
      className="py-20 px-4 text-center"
      style={{ backgroundColor: data.backgroundColor }}
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {data.headline}
        </h2>
        <p className="text-lg text-gray-300">{data.subheadline}</p>
      </div>
    </section>
  );
}
