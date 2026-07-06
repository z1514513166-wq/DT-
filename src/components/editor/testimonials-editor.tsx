'use client';

import { useState, useRef } from 'react';
import { Testimonial, TextStyle } from '@/types';
import Input from '@/components/ui/input';
import { Textarea } from '@/components/ui/input';
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
  const add = () => onChange([...testimonials, { id: crypto.randomUUID(), name: '', role: '', quote: '', avatarUrl: null, image: '' }]);
  const remove = (id: string) => onChange(testimonials.filter((t) => t.id !== id));
  const update = (id: string, field: keyof Testimonial, value: string) => onChange(testimonials.map((t) => (t.id === id ? { ...t, [field]: value } : t)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">💬 用户评价</h3>
        <Button variant="secondary" size="sm" onClick={add}>+ 添加评价</Button>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <label className="text-sm font-medium text-gray-300">区块标题</label>
          <TextStylePicker value={testimonialsTitleStyle} onChange={(v) => onTitleStyleChange?.(v)} />
        </div>
        <input className="w-full rounded-lg border bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-600"
          value={testimonialsTitle ?? '客户评价'} onChange={(e) => onTitleChange(e.target.value)} placeholder="客户评价" />
      </div>

      {testimonials.length === 0 && <p className="text-gray-500 text-sm">暂无用户评价。</p>}

      {testimonials.map((t) => (
        <TestimonialItem key={t.id} item={t} onUpdate={(f) => update(t.id, f.field, f.value)} onRemove={() => remove(t.id)} />
      ))}
    </div>
  );
}

function TestimonialItem({ item, onUpdate, onRemove }: {
  item: Testimonial;
  onUpdate: (v: { field: keyof Testimonial; value: string }) => void;
  onRemove: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const data = await res.json();
        onUpdate({ field: 'image', value: data.url });
      }
    } catch { /* ignore */ }
    finally { setUploading(false); }
  };

  return (
    <div className="border border-gray-700 rounded-lg p-4 space-y-3">
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={onRemove}>🗑️</Button>
      </div>

      {/* 展示图片 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">展示图片</label>
        {item.image && (
          <ThumbnailPreview src={item.image} alt="" onRemove={() => onUpdate({ field: 'image', value: '' })} className="mb-2" />
        )}
        <input ref={fileRef} type="file" accept="image/*"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} className="hidden" />
        <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? '上传中...' : item.image ? '更换图片' : '📷 上传图片'}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="姓名" value={item.name} onChange={(e) => onUpdate({ field: 'name', value: e.target.value })} placeholder="张三" />
        <Input label="职位 / 头衔" value={item.role} onChange={(e) => onUpdate({ field: 'role', value: e.target.value })} placeholder="XX公司 CEO" />
      </div>
      <Textarea label="评语（可选）" value={item.quote} onChange={(e) => onUpdate({ field: 'quote', value: e.target.value })} rows={2} />
    </div>
  );
}
