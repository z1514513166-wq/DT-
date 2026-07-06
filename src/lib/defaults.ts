import { LandingPageContent } from '@/types';

let idCounter = 0;
function nextId(): string {
  idCounter++;
  return `default_${Date.now()}_${idCounter}`;
}

export function getDefaultContent(): LandingPageContent {
  return {
    hero: {
      headline: '',
      subheadline: '',
      ctaText: '',
      ctaLink: '',
      backgroundImage: null,
      backgroundColor: '#1a1a2e',
    },
    features: [],
    featuresTitle: '',
    testimonials: [],
    testimonialsTitle: '',
    cta: {
      headline: '',
      subheadline: '',
      buttonText: '',
      buttonLink: '',
      backgroundColor: '#16213e',
    },
    footer: {
      companyName: '',
      copyrightText: '',
      links: [],
      backgroundColor: '#0f0f23',
    },
    whatsapp: {
      link: '',
      enabled: true,
    },
    facebookPixel: {
      pixelId: null,
      enabled: false,
    },
    about: {
      avatarUrl: null,
      companyName: '',
      description: '',
      backgroundColor: '#0a0a0a',
      backgroundImage: null,
    },
    branding: {
      primaryColor: '#3b82f6',
      secondaryColor: '#1e40af',
      fontFamily: 'Inter',
      logoUrl: null,
    },
    sectionOrder: [],
    sectionData: {},
  };
}

let _idCounter = 0;
export function genSectionId(): string {
  _idCounter++;
  return `sec_${Date.now()}_${_idCounter}`;
}
