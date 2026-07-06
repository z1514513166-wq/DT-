import { LandingPageContent } from '@/types';

let idCounter = 0;
function nextId(): string {
  idCounter++;
  return `default_${Date.now()}_${idCounter}`;
}

export function getDefaultContent(): LandingPageContent {
  return {
    hero: {
      headline: 'Boost Your Business Growth Today',
      subheadline:
        'An all-in-one solution to improve efficiency and increase revenue. Start your journey now.',
      ctaText: 'Get Started Free',
      ctaLink: '#cta',
      backgroundImage: null,
      backgroundColor: '#1a1a2e',
    },
    features: [
      {
        id: nextId(),
        image: '',
        title: 'Lightning Fast',
        description: 'Our platform is deeply optimized so your team never waits. Pages load in a flash.',
        detail: 'Powered by global CDN acceleration and server optimization, average page load time is under 0.5 seconds. Smooth browsing on both mobile and desktop.\n\n**Key Advantages:**\n• 200+ global edge nodes\n• Smart caching strategy\n• Automatic image compression\n• 99.9% uptime guarantee',
      },
      {
        id: nextId(),
        image: '',
        title: 'Secure & Reliable',
        description: 'Enterprise-grade security across every layer, protecting your data 24/7.',
        detail: 'Bank-level SSL encryption, two-factor authentication, and real-time intrusion detection ensure your business data stays safe.\n\n**Security:**\n• 256-bit SSL encryption\n• Real-time DDoS protection\n• Automatic backup & recovery\n• GDPR compliant',
      },
      {
        id: nextId(),
        image: '',
        title: 'Advanced Analytics',
        description: 'Deep insights into business performance with real-time dashboards. Data-driven decisions.',
        detail: 'Built-in powerful analytics engine automatically collects key metrics and generates visual reports. From traffic sources to conversion funnels, everything at a glance.\n\n**Capabilities:**\n• Real-time visitor monitoring\n• User behavior analysis\n• Conversion rate tracking\n• Custom report export',
      },
    ],
    featuresTitle: 'Core Features',
    testimonials: [
      {
        id: nextId(),
        name: 'James Wilson',
        role: 'CEO at TechVentures',
        quote:
          'This product completely transformed our workflow. Team efficiency improved by 40% in the first month.',
        avatarUrl: null,
        image: '',
      },
      {
        id: nextId(),
        name: 'Sarah Chen',
        role: 'Marketing Director',
        quote:
          'The analytics alone is worth the price. We can now confidently make data-driven decisions.',
        avatarUrl: null,
        image: '',
      },
      {
        id: nextId(),
        name: 'Mike Rodriguez',
        role: 'Freelance Designer',
        quote:
          'Simple, powerful, and affordable. I recommend it to all my clients.',
        avatarUrl: null,
        image: '',
      },
    ],
    testimonialsTitle: 'What Our Customers Say',
    cta: {
      headline: 'Ready to Get Started?',
      subheadline:
        'Join thousands of satisfied customers. No credit card required.',
      buttonText: 'Start Free Trial',
      buttonLink: '#',
      backgroundColor: '#16213e',
    },
    footer: {
      companyName: 'Your Company',
      copyrightText: 'All rights reserved.',
      links: [
        { text: 'Privacy Policy', url: '#' },
        { text: 'Terms of Service', url: '#' },
        { text: 'Contact Us', url: '#' },
      ],
      backgroundColor: '#0f0f23',
    },
    whatsapp: {
      link: 'https://wa.me/8613800138000?text=Hi, I am interested in your product and would like to learn more.',
      enabled: true,
    },
    facebookPixel: {
      pixelId: null,
      enabled: false,
    },
    about: {
      avatarUrl: null,
      companyName: 'About Us',
      description: 'We are a passionate team dedicated to delivering exceptional solutions for our clients. With years of industry experience, we have built a reputation for excellence.',
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
