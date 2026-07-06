'use client';

import { ReactNode } from 'react';
import { LandingPageContent, SectionInstance } from '@/types';
import HeroSection from './hero-section';
import ProductCarousel from './product-carousel';
import TestimonialsSection from './testimonials-section';
import AboutSection from './about-section';
import CtaSection from './cta-section';
import FooterSection from './footer-section';
import FloatingWhatsApp from './floating-whatsapp';
import FacebookPixel from './facebook-pixel';
import VisitTracker from './visit-tracker';

interface LandingPageProps {
  content: LandingPageContent;
  slug: string;
}

export default function LandingPage({ content, slug }: LandingPageProps) {
  const { branding, hero, features, testimonials, about, cta, footer, whatsapp, facebookPixel } =
    content;

  // 兼容旧数据：旧格式 sectionOrder 是 string[]，新格式是 SectionInstance[]
  const order: SectionInstance[] = content.sectionOrder?.length
    ? (typeof content.sectionOrder[0] === 'string'
        ? (content.sectionOrder as unknown as string[]).map((k, i) => ({ id: `old_${i}`, key: k }))
        : content.sectionOrder as SectionInstance[])
    : [
        { id: 's1', key: 'hero' },
        { id: 's2', key: 'features' },
        { id: 's3', key: 'about' },
        { id: 's4', key: 'testimonials' },
        { id: 's5', key: 'cta' },
        { id: 's6', key: 'footer' },
      ];

  const sectionData = content.sectionData || {};

  // 根据 key 获取主数据（单实例时使用）
  const getMainData = (key: string) => {
    const mainMap: Record<string, any> = {
      hero, features, testimonials, about, cta, footer,
    };
    return mainMap[key] || null;
  };

  // 根据 instance 获取实际数据：优先取 sectionData，否则取主数据
  const getData = (inst: SectionInstance) => {
    if (sectionData[inst.id]) return sectionData[inst.id];
    return getMainData(inst.key);
  };

  const aboutDefaults = {
    avatarUrl: null, companyName: '', description: '',
    backgroundColor: '#0a0a0a', backgroundImage: null,
  };

  const renderSection = (inst: SectionInstance): ReactNode => {
    const data = getData(inst);
    if (!data) return null;

    switch (inst.key) {
      case 'hero':
        return <HeroSection key={inst.id} data={data} primaryColor={branding.primaryColor} />;
      case 'features':
        return (
          <ProductCarousel
            key={inst.id}
            features={data}
            title={sectionData[inst.id]?.featuresTitle ?? content.featuresTitle}
            primaryColor={branding.primaryColor}
            slug={slug}
          />
        );
      case 'about':
        return <AboutSection key={inst.id} data={{ ...aboutDefaults, ...data }} primaryColor={branding.primaryColor} />;
      case 'testimonials':
        return (
          <TestimonialsSection
            key={inst.id}
            testimonials={data}
            title={sectionData[inst.id]?.testimonialsTitle ?? content.testimonialsTitle}
            primaryColor={branding.primaryColor}
          />
        );
      case 'cta':
        return <CtaSection key={inst.id} data={data} primaryColor={branding.primaryColor} />;
      case 'footer':
        return <FooterSection key={inst.id} data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: branding.fontFamily }}>
      {order.map(renderSection)}

      <FloatingWhatsApp link={whatsapp.link} enabled={whatsapp.enabled} />
      <FacebookPixel pixelId={facebookPixel.pixelId} enabled={facebookPixel.enabled} />
      <VisitTracker slug={slug} />
    </div>
  );
}
