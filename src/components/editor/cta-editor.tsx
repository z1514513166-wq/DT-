'use client';

import Input from '@/components/ui/input';
import { Textarea } from '@/components/ui/input';
import { LandingPageContent } from '@/types';

interface CtaEditorProps {
  cta: LandingPageContent['cta'];
  onChange: (cta: LandingPageContent['cta']) => void;
}

export default function CtaEditor({ cta, onChange }: CtaEditorProps) {
  const update = (field: string, value: string) => {
    onChange({ ...cta, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">📢 行动号召区域</h3>
      <Input
        label="标题"
        value={cta.headline}
        onChange={(e) => update('headline', e.target.value)}
        placeholder="准备好开始了吗？"
      />
      <Textarea
        label="副标题"
        value={cta.subheadline}
        onChange={(e) => update('subheadline', e.target.value)}
        placeholder="加入数千家满意客户的行列。无需信用卡。"
        rows={2}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="按钮文字"
          value={cta.buttonText}
          onChange={(e) => update('buttonText', e.target.value)}
          placeholder="立即免费试用"
        />
        <Input
          label="按钮链接"
          value={cta.buttonLink}
          onChange={(e) => update('buttonLink', e.target.value)}
          placeholder="#"
        />
      </div>
      <Input
        label="背景颜色"
        type="color"
        value={cta.backgroundColor}
        onChange={(e) => update('backgroundColor', e.target.value)}
      />
    </div>
  );
}
