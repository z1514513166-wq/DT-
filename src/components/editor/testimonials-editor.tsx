'use client';

import { useState } from 'react';
import { Testimonial, TextStyle } from '@/types';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import TextStylePicker from './text-style-picker';
import ThumbnailPreview from './thumbnail-preview';

interface TestimonialsEditorProps {
  testimonials: Testimonial[];
  testimonialsTitle?: string;
  testimonialsTitleStyle?: TextStyle;
  onChange: (testimonials: Testimonial[]) => void;
  onTitleChange: (title: string) => void;
  onTitleStyleChange?: (style: TextStyle) => void;
}

export default function TestimonialsEditor({
  testimonials, testimonialsTitle, testimonialsTitleStyle,
  onChange, onTitleChange, onTitleStyleChange,
}: TestimonialsEditorProps) {
  const [uploading, setUploading] = useState(false);

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    const newItems: Testimonial[] = [...testimonials];
    for (const file of Array.from(files)) {
      try {
        const fd = new FormData(); fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        if (res.ok) {
          const data = await res.json();
          newItems.push({ id: crypto.randomUUID(), image: data.url, caption: '' });
        }
      } catch { /* skip */ }
    }
    onChange(newItems);
    setUploading(false);
    if (e.target) e.target.value = '';
  };

  const remove = (id: string) => onChange(testimonials.filter(t => t.id !== id));
  const updateCaption = (id: string, caption: string) =>
    onChange(testimonials.map(t => t.id === id ? { ...t, caption } : t));
  const move = (id: string, dir: 'up' | 'down') => {
    const idx = testimonials.findIndex(t => t.id === id);
    if (idx === -1) return;
    const newIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= testimonials.length) return;
    const arr = [...testimonials];
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    onChange(arr);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">💬 用户评价</h3>
        <span className="text-xs text-gray-500">{testimonials.length} 张图片</span>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <label className="text-sm font-medium text-gray-300">区块标题</label>
          <TextStylePicker value={testimonialsTitleStyle} onChange={(v) => onTitleStyleChange?.(v)} />
        </div>
        <input className="w-full rounded-lg border bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-600"
          value={testimonialsTitle ?? ''} onChange={(e) => onTitleChange(e.target.value)} placeholder="客户评价" />
      </div>

      {/* 批量上传 */}
      <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-pink-500/50 transition-colors">
        <input type="file" accept="image/*" multiple onChange={handleBulkUpload} className="hidden" id="bulk-upload" />
        <label htmlFor="bulk-upload" className="cursor-pointer">
          <div className="text-3xl mb-2">📁</div>
          <p className="text-sm text-gray-300 font-medium">批量上传图片</p>
          <p className="text-xs text-gray-500 mt-1">{uploading ? '上传中...' : '支持一次选择多张图片'}</p>
        </label>
      </div>

      {/* 图片列表 */}
      {testimonials.length === 0 && <p className="text-gray-500 text-sm text-center">暂无图片，请上传</p>}

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {testimonials.map((t, idx) => (
          <div key={t.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <ThumbnailPreview src={t.image} alt="" onRemove={() => remove(t.id)} className="w-full [&_img]:w-full [&_img]:h-24 [&_img]:rounded-none [&_img]:object-cover" />
            <div className="p-2 space-y-1.5">
              <Input value={t.caption} onChange={(e) => updateCaption(t.id, e.target.value)} placeholder="文字" className="text-xs" />
              <div className="flex gap-1">
                <button onClick={() => move(t.id, 'up')} disabled={idx === 0}
                  className="flex-1 text-[10px] text-gray-500 hover:text-white disabled:opacity-25 py-0.5 bg-gray-700 rounded">↑</button>
                <button onClick={() => move(t.id, 'down')} disabled={idx === testimonials.length - 1}
                  className="flex-1 text-[10px] text-gray-500 hover:text-white disabled:opacity-25 py-0.5 bg-gray-700 rounded">↓</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
