'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LandingPageContent, SectionInstance } from '@/types';
import { getDefaultContent, genSectionId } from '@/lib/defaults';
import Input from '@/components/ui/input';
import { Textarea } from '@/components/ui/input';
import Button from '@/components/ui/button';
import HeroEditor from './hero-editor';
import FeaturesEditor from './features-editor';
import TestimonialsEditor from './testimonials-editor';
import CtaEditor from './cta-editor';
import FooterEditor from './footer-editor';
import WhatsAppEditor from './whatsapp-editor';
import PixelEditor from './pixel-editor';
import AboutEditor from './about-editor';
import BrandingEditor from './branding-editor';

interface PageEditorProps {
  initialData?: {
    id?: number;
    title: string;
    slug: string;
    description: string;
    content: LandingPageContent;
  };
  isNew?: boolean;
}

type SectionKey = 'hero' | 'features' | 'testimonials' | 'about' | 'cta' | 'footer' | 'whatsapp' | 'pixel' | 'branding';

// 可添加多个实例的板块类型
const MULTI_SECTION_TYPES: string[] = ['about', 'features', 'testimonials', 'cta'];

export default function PageEditor({ initialData, isNew = true }: PageEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [content, setContent] = useState<LandingPageContent>(() => {
    const base = getDefaultContent();
    if (initialData?.content) {
      // 迁移旧格式 sectionOrder
      let order = initialData.content.sectionOrder || base.sectionOrder;
      if (order.length > 0 && typeof order[0] === 'string') {
        order = (order as unknown as string[]).map((k, i) => ({ id: `old_${i}`, key: k }));
      }
      return {
        ...base,
        ...initialData.content,
        hero: { ...base.hero, ...initialData.content.hero },
        cta: { ...base.cta, ...initialData.content.cta },
        footer: { ...base.footer, ...initialData.content.footer },
        whatsapp: { ...base.whatsapp, ...initialData.content.whatsapp },
        facebookPixel: { ...base.facebookPixel, ...initialData.content.facebookPixel },
        branding: { ...base.branding, ...initialData.content.branding },
        about: { ...base.about, ...(initialData.content as any).about },
        sectionOrder: order as SectionInstance[],
        sectionData: initialData.content.sectionData || {},
      };
    }
    return base;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [cloning, setCloning] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const order: SectionInstance[] = content.sectionOrder?.length
    ? content.sectionOrder
    : getDefaultContent().sectionOrder;

  const sectionData = content.sectionData || {};

  // ---- 获取某实例的数据（列表类型返回 items 数组）----
  const getInstanceData = (inst: SectionInstance): any => {
    const sd = sectionData[inst.id];
    if (sd) {
      // 列表类型：sectionData 存的是 { items, title }，返回 items
      if (inst.key === 'features' || inst.key === 'testimonials') {
        return sd.items || [];
      }
      return sd;
    }
    const mainMap: Record<string, any> = {
      hero: content.hero, features: content.features, about: content.about,
      testimonials: content.testimonials, cta: content.cta, footer: content.footer,
    };
    return mainMap[inst.key] || {};
  };

  // ---- 获取某实例的标题 ----
  const getInstanceTitle = (inst: SectionInstance): string | undefined => {
    const sd = sectionData[inst.id];
    if (sd?.title !== undefined) return sd.title;
    if (inst.key === 'features') return content.featuresTitle;
    if (inst.key === 'testimonials') return content.testimonialsTitle;
    return undefined;
  };

  // ---- 更新某实例的数据（列表类型自动包装）----
  const updateInstanceData = (inst: SectionInstance, newData: any) => {
    if (inst.key === 'features' || inst.key === 'testimonials') {
      setContent({ ...content, sectionData: { ...sectionData, [inst.id]: newData } });
    } else {
      setContent({ ...content, sectionData: { ...sectionData, [inst.id]: newData } });
    }
  };

  // ---- 拖拽排序 ----
  const handleDragStart = (instId: string) => {
    setDragId(instId);
  };

  const handleDragOver = (e: React.DragEvent, instId: string) => {
    e.preventDefault();
    setDragOverId(instId);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) { setDragId(null); setDragOverId(null); return; }
    const fromIdx = order.findIndex((s) => s.id === dragId);
    const toIdx = order.findIndex((s) => s.id === targetId);
    if (fromIdx === -1 || toIdx === -1) { setDragId(null); setDragOverId(null); return; }
    const newOrder = [...order];
    const [item] = newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, item);
    setContent({ ...content, sectionOrder: newOrder });
    setDragId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDragId(null);
    setDragOverId(null);
  };

  // ---- 删除 ----
  const removeSection = (inst: SectionInstance) => {
    const newOrder = order.filter((s) => s.id !== inst.id);
    const newSD = { ...sectionData };
    delete newSD[inst.id];
    setContent({ ...content, sectionOrder: newOrder, sectionData: newSD });
  };

  // ---- 添加 ----
  const addSection = (key: string) => {
    const id = genSectionId();
    const newOrder = [...order, { id, key }];
    const defaults = getDefaultContent();
    let instanceData: any;
    if (key === 'features') {
      instanceData = { items: defaults.features, title: defaults.featuresTitle };
    } else if (key === 'testimonials') {
      instanceData = { items: defaults.testimonials, title: defaults.testimonialsTitle };
    } else {
      const dataMap: Record<string, any> = {
        hero: defaults.hero, about: defaults.about, cta: defaults.cta, footer: defaults.footer,
      };
      instanceData = dataMap[key] || {};
    }
    const newSD = { ...sectionData, [id]: instanceData };
    setContent({ ...content, sectionOrder: newOrder, sectionData: newSD });
  };

  // ---- 切换展开 ----
  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const handleCloneTemplate = async () => {
    setCloning(true);
    try {
      const res = await fetch('/api/template');
      if (res.ok) {
        const template = await res.json();
        setContent(template.content);
      } else { setContent(getDefaultContent()); }
    } catch { setContent(getDefaultContent()); }
    finally { setCloning(false); }
  };

  const handleSave = async () => {
    if (!title.trim()) { setError('请输入页面标题'); return; }
    if (!slug.trim()) { setError('请输入 URL Slug'); return; }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.trim())) { setError('Slug 只能包含小写字母、数字和连字符'); return; }
    setError('');
    setSaving(true);
    try {
      const body = { title: title.trim(), slug: slug.trim(), description: description.trim(), content };
      const url = isNew ? '/api/pages' : `/api/pages/${initialData?.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) { router.push('/admin/pages'); router.refresh(); }
      else { const data = await res.json(); setError(data.error || '保存失败，请重试'); }
    } catch { setError('网络错误，请检查网络连接后重试'); }
    finally { setSaving(false); }
  };

  const labelMap: Record<string, { label: string; icon: string }> = {
    hero: { label: '首屏区域', icon: '🦸' },
    features: { label: '产品展示', icon: '✨' },
    about: { label: '公司介绍', icon: '🏢' },
    testimonials: { label: '用户评价', icon: '💬' },
    cta: { label: '行动号召', icon: '📢' },
    footer: { label: '页脚信息', icon: '📋' },
  };

  const canAdd = (key: string) => MULTI_SECTION_TYPES.includes(key);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">{isNew ? '创建新落地页' : '编辑落地页'}</h2>
        <p className="text-gray-400 mt-1">{isNew ? '填写落地页的详细信息和内容' : '修改落地页的内容和设置'}</p>
      </div>

      {error && <div className="mb-4 p-3 bg-red-600/20 border border-red-600/40 rounded-lg text-red-400 text-sm">{error}</div>}

      {/* 基本信息 */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">📝 基本信息</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input label="页面标题" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="我的产品落地页" />
          <Input label="URL Slug" value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
            placeholder="my-product-page" helperText="例如：my-product，访问地址为 /lp/my-product" />
        </div>
        <Textarea label="Meta 描述（SEO）" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="一段简短的页面描述" rows={2} />
        <Input label="自定义域名（选填）" value={(content as any).customDomain || ''}
          onChange={(e) => setContent({ ...content, customDomain: e.target.value } as any)}
          placeholder="例如：promo.yourdomain.com"
          helperText="绑定独立域名后，配合 Nginx 配置即可直接访问该落地页" />
        {isNew && (
          <Button variant="secondary" size="sm" onClick={handleCloneTemplate} disabled={cloning}>
            {cloning ? '正在克隆...' : '📋 从模板克隆'}
          </Button>
        )}
      </div>

      {/* 内容编辑区 */}
      <div className="space-y-2 mb-8">
        <p className="text-xs text-gray-500 mb-1">📌 内容板块（拖拽 ⠿ 排序 / 点击 ＋ 添加 / 点击 ✕ 删除）</p>
        {order.map((inst) => {
          const meta = labelMap[inst.key] || { label: inst.key, icon: '📌' };
          const data = getInstanceData(inst);
          const isDragging = dragId === inst.id;
          const isOver = dragOverId === inst.id;
          return (
            <div key={inst.id}
              onDragOver={(e) => handleDragOver(e, inst.id)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(inst.id)}
              className={`bg-gray-900 border rounded-xl overflow-hidden transition-all
                ${isDragging ? 'opacity-40 scale-95' : ''}
                ${isOver ? 'border-blue-500 bg-blue-500/10' : 'border-gray-800'}`}
            >
              <div className="flex items-center">
                <div
                  draggable
                  onDragStart={() => handleDragStart(inst.id)}
                  onDragEnd={handleDragEnd}
                  className="ml-3 mr-1 cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-300 text-lg select-none px-0.5"
                  title="拖拽排序"
                >
                  ⠿
                </div>
                <button onClick={() => toggleSection(inst.id)}
                  className="flex-1 flex items-center justify-between px-3 py-4 text-left hover:bg-gray-800/50 transition-colors">
                  <span className="font-medium text-white flex items-center gap-2">
                    <span>{meta.icon}</span> {meta.label}
                    {sectionData[inst.id] && <span className="text-[10px] text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">自定义</span>}
                  </span>
                  <span className="text-gray-500 text-sm">{expandedSection === inst.id ? '▲ 收起' : '▼ 展开'}</span>
                </button>
                <div className="flex items-center mr-2 gap-0.5">
                  {canAdd(inst.key) && (
                    <button onClick={(e) => { e.stopPropagation(); addSection(inst.key); }}
                      className="text-gray-500 hover:text-green-400 text-sm px-1.5" title={`添加${meta.label}`}>＋</button>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); removeSection(inst); }}
                    className="text-gray-500 hover:text-red-400 text-sm px-1.5" title="删除">✕</button>
                </div>
              </div>

              {expandedSection === inst.id && (
                <div className="px-6 pb-6 border-t border-gray-800 pt-4">
                  {inst.key === 'hero' && <HeroEditor hero={data} onChange={(v) => updateInstanceData(inst, v)} />}
                  {inst.key === 'features' && (() => {
                    const items = Array.isArray(data) ? data : content.features;
                    const t = getInstanceTitle(inst);
                    const sd = sectionData[inst.id];
                    const titleStyle = sd?.titleStyle || content.featuresTitleStyle;
                    return (
                      <FeaturesEditor features={items}
                        featuresTitle={t}
                        featuresTitleStyle={titleStyle}
                        onChange={(v) => updateInstanceData(inst, { ...sd, items: v, title: t })}
                        onTitleChange={(title) => updateInstanceData(inst, { ...sd, items, title })}
                        onTitleStyleChange={(style) => updateInstanceData(inst, { ...sd, items, title: t, titleStyle: style })} />
                    );
                  })()}
                  {inst.key === 'about' && (
                    <AboutEditor avatarUrl={data.avatarUrl ?? null} companyName={data.companyName ?? ''}
                      description={data.description ?? ''} backgroundColor={data.backgroundColor ?? '#0a0a0a'}
                      backgroundImage={data.backgroundImage ?? null}
                      onChange={(v) => updateInstanceData(inst, v)} />
                  )}
                  {inst.key === 'testimonials' && (() => {
                    const items = Array.isArray(data) ? data : content.testimonials;
                    const t = getInstanceTitle(inst);
                    const sd = sectionData[inst.id];
                    const titleStyle = sd?.titleStyle || content.testimonialsTitleStyle;
                    return (
                      <TestimonialsEditor testimonials={items}
                        testimonialsTitle={t}
                        testimonialsTitleStyle={titleStyle}
                        onChange={(v) => updateInstanceData(inst, { ...sd, items: v, title: t })}
                        onTitleChange={(title) => updateInstanceData(inst, { ...sd, items, title })}
                        onTitleStyleChange={(style) => updateInstanceData(inst, { ...sd, items, title: t, titleStyle: style })} />
                    );
                  })()}
                  {inst.key === 'cta' && <CtaEditor cta={data} onChange={(v) => updateInstanceData(inst, v)} />}
                  {inst.key === 'footer' && (
                    <FooterEditor companyName={data.companyName ?? ''} copyrightText={data.copyrightText ?? ''}
                      links={data.links ?? []} backgroundColor={data.backgroundColor ?? '#0f0f23'}
                      onChange={(v) => updateInstanceData(inst, v)} />
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* 设置板块 */}
        <p className="text-xs text-gray-500 mt-6 mb-1">⚙ 设置项</p>
        {(['whatsapp', 'pixel', 'branding'] as SectionKey[]).map((key) => (
          <div key={key} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <button onClick={() => toggleSection(key)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-800/50 transition-colors">
              <span className="font-medium text-white flex items-center gap-2">
                <span>{key === 'whatsapp' ? '💬' : key === 'pixel' ? '📊' : '🎨'}</span>
                {key === 'whatsapp' ? 'WhatsApp 按钮' : key === 'pixel' ? 'Facebook Pixel' : '品牌样式'}
              </span>
              <span className="text-gray-500 text-sm">{expandedSection === key ? '▲ 收起' : '▼ 展开'}</span>
            </button>
            {expandedSection === key && (
              <div className="px-6 pb-6 border-t border-gray-800 pt-4">
                {key === 'whatsapp' && <WhatsAppEditor link={content.whatsapp.link} enabled={content.whatsapp.enabled} onChange={(v) => setContent({ ...content, whatsapp: v })} />}
                {key === 'pixel' && <PixelEditor pixelId={content.facebookPixel.pixelId} enabled={content.facebookPixel.enabled} onChange={(v) => setContent({ ...content, facebookPixel: v })} />}
                {key === 'branding' && <BrandingEditor primaryColor={content.branding.primaryColor} secondaryColor={content.branding.secondaryColor} fontFamily={content.branding.fontFamily} logoUrl={content.branding.logoUrl} onChange={(v) => setContent({ ...content, branding: v })} />}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 保存 */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-800 pt-6">
        <Button variant="ghost" onClick={() => router.push('/admin/pages')}>取消</Button>
        <Button variant="primary" size="lg" onClick={handleSave} disabled={saving}>
          {saving ? '保存中...' : isNew ? '✨ 创建页面' : '💾 保存修改'}
        </Button>
      </div>
    </div>
  );
}
