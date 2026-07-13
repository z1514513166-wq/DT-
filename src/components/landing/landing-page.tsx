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
import ScrollHint from './scroll-hint';
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
    : [];

  const sectionData = content.sectionData || {};

  // 根据 key 获取主数据（单实例时使用）
  const getMainData = (key: string) => {
    const mainMap: Record<string, any> = {
      hero, features, testimonials, about, cta, footer,
    };
    return mainMap[key] || null;
  };

  // 根据 instance 获取实际数据
  const getData = (inst: SectionInstance) => {
    const sd = sectionData[inst.id];
    if (sd) {
      // 列表类型返回 items 数组
      if (inst.key === 'features' || inst.key === 'testimonials') return sd.items || [];
      return sd;
    }
    return getMainData(inst.key);
  };

  // 获取实例标题
  const getInstanceTitle = (inst: SectionInstance): string | undefined => {
    const sd = sectionData[inst.id];
    if (sd?.title !== undefined) return sd.title;
    return undefined;
  };

  // 获取实例标题样式
  const getInstanceTitleStyle = (inst: SectionInstance) => {
    const sd = sectionData[inst.id];
    if (sd?.titleStyle) return sd.titleStyle;
    if (inst.key === 'features') return content.featuresTitleStyle;
    if (inst.key === 'testimonials') return content.testimonialsTitleStyle;
    return undefined;
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
            title={getInstanceTitle(inst) ?? content.featuresTitle}
            titleStyle={getInstanceTitleStyle(inst)}
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
            title={getInstanceTitle(inst) ?? content.testimonialsTitle}
            titleStyle={getInstanceTitleStyle(inst)}
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
    <div className="min-h-screen bg-white" style={{ fontFamily: branding.fontFamily }}>
      {order.map((inst, i) => (
        <div key={inst.id}>
          {renderSection(inst)}
          {/* 板块之间的柔和过渡线 */}
          {i < order.length - 1 && (
            <div className="relative z-10 -mt-px">
              <div className="h-px mx-auto max-w-lg opacity-30"
                style={{
                  background: `linear-gradient(90deg, transparent, ${branding.primaryColor}44, transparent)`,
                }}
              />
            </div>
          )}
        </div>
      ))}

      <ScrollHint />

      <FloatingWhatsApp link={whatsapp.link} enabled={whatsapp.enabled} />
      <FacebookPixel pixelId={facebookPixel.pixelId} enabled={facebookPixel.enabled} />
      <VisitTracker slug={slug} />
    </div>
  );
}
