'use client';

import { applyTextStyle } from '@/lib/text-styles';
import { TextStyle } from '@/types';

interface AboutData {
  avatarUrl: string | null;
  companyName: string;
  description: string;
  backgroundColor: string;
  backgroundImage: string | null;
  titleStyle?: TextStyle;
  bodyStyle?: TextStyle;
}

interface AboutSectionProps {
  data: AboutData;
  primaryColor: string;
}

export default function AboutSection({ data, primaryColor }: AboutSectionProps) {
  if (!data.companyName && !data.description) return null;
  const titleCls = applyTextStyle(data.titleStyle) || 'text-2xl md:text-3xl font-bold';
  const bodyCls = applyTextStyle(data.bodyStyle) || 'text-sm md:text-base';

  return (
    <section
      className="relative py-10 md:py-20 px-4 overflow-hidden"
      style={{ backgroundColor: data.backgroundColor }}
    >
      {/* Background image */}
      {data.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
        />
      )}

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Avatar / Logo */}
          <div className="flex-shrink-0">
            <div
              className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 flex items-center justify-center text-4xl"
              style={{ borderColor: primaryColor, backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              {data.avatarUrl ? (
                <img
                  src={data.avatarUrl}
                  alt={data.companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl md:text-5xl opacity-40">🏢</span>
              )}
            </div>
          </div>

          {/* Company Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className={`text-gray-900 mb-3 ${titleCls}`}>
              {data.companyName}
            </h2>
            <div
              className="w-12 h-0.5 mb-4 mx-auto md:mx-0 rounded-full"
              style={{ backgroundColor: primaryColor }}
            />
            <p className={`text-gray-600 leading-relaxed whitespace-pre-wrap ${bodyCls}`}>
              {data.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
