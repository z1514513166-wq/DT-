// ============================================================
// Shared TypeScript interfaces for the Landing Page system
// ============================================================

export interface Feature {
  id: string;
  image: string;
  title: string;
  description: string;
  detail: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatarUrl: string | null;
  image: string;  // 评价展示图片
}

export interface FooterLink {
  text: string;
  url: string;
}

export interface SectionInstance {
  id: string;
  key: string; // 'hero' | 'features' | 'about' | 'testimonials' | 'cta' | 'footer'
}

// 文字样式
export interface TextStyle {
  size?: string;   // e.g. 'small' | 'base' | 'large' | 'xl' | '2xl'
  bold?: boolean;
}

export interface LandingPageContent {
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaLink: string;
    backgroundImage: string | null;
    backgroundColor: string;
    headlineStyle?: TextStyle;
    subheadlineStyle?: TextStyle;
  };
  features: Feature[];
  featuresTitle?: string;
  featuresTitleStyle?: TextStyle;
  testimonials: Testimonial[];
  testimonialsTitle?: string;
  testimonialsTitleStyle?: TextStyle;
  cta: {
    headline: string;
    subheadline: string;
    buttonText: string;
    buttonLink: string;
    backgroundColor: string;
    headlineStyle?: TextStyle;
    subheadlineStyle?: TextStyle;
  };
  footer: {
    companyName: string;
    copyrightText: string;
    links: FooterLink[];
    backgroundColor: string;
    companyNameStyle?: TextStyle;
  };
  whatsapp: {
    link: string;
    enabled: boolean;
  };
  facebookPixel: {
    pixelId: string | null;
    enabled: boolean;
  };
  about: {
    avatarUrl: string | null;
    companyName: string;
    description: string;
    backgroundColor: string;
    backgroundImage: string | null;
    titleStyle?: TextStyle;
    bodyStyle?: TextStyle;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    logoUrl: string | null;
  };
  sectionOrder: SectionInstance[];
  /** 多实例板块的自定义数据，key = instance.id */
  sectionData?: Record<string, any>;
}

export interface LandingPage {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: LandingPageContent;
  is_template: number;
  is_published: number;
  created_at: string;
  updated_at: string;
}

export interface LandingPageWithCount extends LandingPage {
  visitor_count: number;
}

export interface VisitorLog {
  id: number;
  landing_page_id: number;
  ip_address: string | null;
  user_agent: string | null;
  referer: string | null;
  visited_at: string;
}

export interface PageStats {
  total: number;
  today: number;
  last7Days: number[];
  last30Days: number;
}

export interface DashboardStats {
  totalPages: number;
  totalVisitors: number;
  todayVisitors: number;
  pagesWithCounts: { id: number; title: string; slug: string; visitor_count: number }[];
}
