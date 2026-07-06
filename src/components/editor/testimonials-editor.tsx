'use client';

import { Testimonial, TextStyle } from '@/types';
import Input from '@/components/ui/input';
import { Textarea } from '@/components/ui/input';
import Button from '@/components/ui/button';
import TextStylePicker from './text-style-picker';

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
  const add = () => onChange([...testimonials, { id: crypto.randomUUID(), name: '', role: '', quote: '', avatarUrl: null }]);
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
        <div key={t.id} className="border border-gray-700 rounded-lg p-4 space-y-3">
          <div className="flex justify-end"><Button variant="ghost" size="sm" onClick={() => remove(t.id)}>🗑️</Button></div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="姓名" value={t.name} onChange={(e) => update(t.id, 'name', e.target.value)} placeholder="张三" />
            <Input label="职位 / 头衔" value={t.role} onChange={(e) => update(t.id, 'role', e.target.value)} placeholder="XX公司 CEO" />
          </div>
          <Textarea label="评价内容" value={t.quote} onChange={(e) => update(t.id, 'quote', e.target.value)} placeholder="这个产品真的很棒..." rows={3} />
          <Input label="头像链接（选填）" value={t.avatarUrl || ''} onChange={(e) => update(t.id, 'avatarUrl', e.target.value)} placeholder="https://example.com/avatar.jpg" />
        </div>
      ))}
    </div>
  );
}
