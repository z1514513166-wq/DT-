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
  const titleCls = applyTextStyle(data.titleStyle) || 'text-xl md:text-2xl font-bold';
  const bodyCls = applyTextStyle(data.bodyStyle) || 'text-xs md:text-sm';

  return (
    <section
      className="relative py-6 md:py-10 px-4 overflow-hidden"
      style={{ backgroundColor: data.backgroundColor }}
    >
      {data.backgroundImage && (
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${data.backgroundImage})` }} />
      )}

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 flex items-center justify-center"
              style={{ borderColor: primaryColor, backgroundColor: 'rgba(128,128,128,0.05)' }}
            >
              {data.avatarUrl ? (
                <img src={data.avatarUrl} alt={data.companyName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl opacity-30">🏢</span>
              )}
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className={`text-black mb-1 ${titleCls}`}>{data.companyName}</h2>
            <div className="w-8 h-0.5 mb-2 mx-auto sm:mx-0 rounded-full" style={{ backgroundColor: primaryColor }} />
            <p className={`text-gray-700 leading-relaxed whitespace-pre-wrap ${bodyCls}`}>{data.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
