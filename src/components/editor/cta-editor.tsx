'use client';

import Input from '@/components/ui/input';
import { Textarea } from '@/components/ui/input';
import { LandingPageContent } from '@/types';
import TextStylePicker from './text-style-picker';

interface CtaEditorProps {
  cta: LandingPageContent['cta'];
  onChange: (cta: LandingPageContent['cta']) => void;
}

export default function CtaEditor({ cta, onChange }: CtaEditorProps) {
  const update = (field: string, value: any) => { onChange({ ...cta, [field]: value }); };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">📢 行动号召区域</h3>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <label className="text-sm font-medium text-gray-300">标题</label>
          <TextStylePicker value={cta.headlineStyle} onChange={(v) => update('headlineStyle', v)} />
        </div>
        <input className="w-full rounded-lg border bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-600"
          value={cta.headline} onChange={(e) => update('headline', e.target.value)} placeholder="准备好开始了吗？" />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <label className="text-sm font-medium text-gray-300">副标题</label>
          <TextStylePicker value={cta.subheadlineStyle} onChange={(v) => update('subheadlineStyle', v)} />
        </div>
        <textarea className="w-full rounded-lg border bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-600"
          value={cta.subheadline} onChange={(e) => update('subheadline', e.target.value)} placeholder="加入数千家满意客户的行列..." rows={2} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="按钮文字" value={cta.buttonText} onChange={(e) => update('buttonText', e.target.value)} />
        <Input label="按钮链接" value={cta.buttonLink} onChange={(e) => update('buttonLink', e.target.value)} placeholder="#" />
      </div>
      <Input label="背景颜色" type="color" value={cta.backgroundColor} onChange={(e) => update('backgroundColor', e.target.value)} />
    </div>
  );
}
