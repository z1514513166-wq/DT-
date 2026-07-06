'use client';

import { LandingPageContent } from '@/types';

interface FooterSectionProps {
  data: LandingPageContent['footer'];
}

export default function FooterSection({ data }: FooterSectionProps) {
  return (
    <footer
      className="py-10 px-4 border-t border-gray-800"
      style={{ backgroundColor: data.backgroundColor }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-white font-semibold">{data.companyName}</p>
          <p className="text-gray-500 text-sm mt-1">{data.copyrightText}</p>
        </div>
        <div className="flex items-center gap-6">
          {data.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              {link.text}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
