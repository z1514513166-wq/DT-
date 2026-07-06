import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPageBySlug } from '@/lib/pages-repo';
import FloatingWhatsApp from '@/components/landing/floating-whatsapp';

interface PageProps {
  params: Promise<{ slug: string; index: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug, index } = await params;
  const page = getPageBySlug(slug);

  if (!page) notFound();

  // 在所有 features 来源中查找产品（支持多实例板块）
  const allFeatures = [...page.content.features];
  const sd = page.content.sectionData || {};
  for (const key of Object.keys(sd)) {
    const inst = sd[key];
    if (inst?.items && Array.isArray(inst.items)) {
      allFeatures.push(...inst.items);
    }
  }

  // 按 ID 或旧版索引查找
  let product = allFeatures.find((f) => f.id === index);
  if (!product) {
    const i = parseInt(index, 10);
    if (!isNaN(i) && i >= 0 && i < page.content.features.length) {
      product = page.content.features[i];
    }
  }

  if (!product) notFound();

  const branding = page.content.branding;

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-28" style={{ fontFamily: branding.fontFamily }}>
      <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/lp/${slug}`} className="text-sm text-gray-400 hover:text-white transition-colors">← Back to Home</Link>
          <span className="text-sm text-gray-500">{page.title}</span>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 pt-8 pb-4">
        <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-gray-900 border border-gray-800">
          {product.image ? (
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl text-gray-700">📷</div>
          )}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>
        <p className="text-lg text-gray-400 mb-8">{product.description}</p>

        {product.detail && (
          <div className="prose prose-invert max-w-none">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-4" style={{ color: branding.primaryColor }}>Product Details</h2>
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">{product.detail}</div>
            </div>
          </div>
        )}
      </section>

      <FloatingWhatsApp link={page.content.whatsapp.link} enabled={page.content.whatsapp.enabled} />
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, index } = await params;
  const page = getPageBySlug(slug);
  if (!page) return { title: 'Not Found' };

  const product = page.content.features.find((f) => f.id === index);
  if (!product) return { title: 'Not Found' };

  return { title: `${product.title} — ${page.title}`, description: product.description };
}
