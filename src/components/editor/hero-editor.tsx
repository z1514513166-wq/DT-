'use client';

import { useState, useRef } from 'react';
import Input from '@/components/ui/input';
import { Textarea } from '@/components/ui/input';
import Button from '@/components/ui/button';
import { LandingPageContent, TextStyle } from '@/types';
import TextStylePicker from './text-style-picker';
import ThumbnailPreview from './thumbnail-preview';

interface HeroEditorProps {
  hero: LandingPageContent['hero'];
  onChange: (hero: LandingPageContent['hero']) => void;
}

export default function HeroEditor({ hero, onChange }: HeroEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (field: string, value: string | TextStyle | undefined) => {
    onChange({ ...hero, [field]: value });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadError('');
    try {
      const formData = new FormData(); formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) { const data = await res.json(); update('backgroundImage', data.url); }
      else { const data = await res.json(); setUploadError(data.error || '上传失败'); }
    } catch { setUploadError('上传失败，请检查网络'); }
    finally { setUploading(false); }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">🦸 首屏区域</h3>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <label className="text-sm font-medium text-gray-300">主标题</label>
          <TextStylePicker value={hero.headlineStyle} onChange={(v) => update('headlineStyle', v)} />
        </div>
        <input className="w-full rounded-lg border bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-600"
          value={hero.headline} onChange={(e) => update('headline', e.target.value)} placeholder="提升业务增长的终极解决方案" />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <label className="text-sm font-medium text-gray-300">副标题</label>
          <TextStylePicker value={hero.subheadlineStyle} onChange={(v) => update('subheadlineStyle', v)} />
        </div>
        <textarea className="w-full rounded-lg border bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-600"
          value={hero.subheadline} onChange={(e) => update('subheadline', e.target.value)} placeholder="帮助您提高效率、增加收入的领先工具..." rows={3} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="按钮文字" value={hero.ctaText} onChange={(e) => update('ctaText', e.target.value)} />
        <Input label="按钮链接" value={hero.ctaLink} onChange={(e) => update('ctaLink', e.target.value)} placeholder="#cta" />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">背景设置</label>
        <Input label="背景颜色" type="color" value={hero.backgroundColor} onChange={(e) => update('backgroundColor', e.target.value)} />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">背景图片</label>
          {hero.backgroundImage && (
            <ThumbnailPreview src={hero.backgroundImage} alt="背景预览" onRemove={() => update('backgroundImage', '')} className="mb-2" />
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" id="bg-image-upload" />
          <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? '上传中...' : hero.backgroundImage ? '更换图片' : '📷 上传背景图片'}
          </Button>
          {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
        </div>
      </div>
    </div>
  );
}
