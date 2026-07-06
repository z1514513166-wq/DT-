'use client';

import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { FooterLink, TextStyle } from '@/types';
import TextStylePicker from './text-style-picker';

interface FooterEditorProps {
  companyName: string;
  copyrightText: string;
  links: FooterLink[];
  backgroundColor: string;
  companyNameStyle?: TextStyle;
  onChange: (data: {
    companyName: string; copyrightText: string; links: FooterLink[];
    backgroundColor: string; companyNameStyle?: TextStyle;
  }) => void;
}

export default function FooterEditor({
  companyName, copyrightText, links, backgroundColor, companyNameStyle, onChange,
}: FooterEditorProps) {
  const set = (field: string, value: any) => onChange({ companyName, copyrightText, links, backgroundColor, companyNameStyle, [field]: value });

  const addLink = () => onChange({ companyName, copyrightText, links: [...links, { text: '', url: '' }], backgroundColor, companyNameStyle });
  const removeLink = (index: number) => onChange({ companyName, copyrightText, links: links.filter((_, i) => i !== index), backgroundColor, companyNameStyle });
  const updateLink = (index: number, field: keyof FooterLink, value: string) => {
    onChange({ companyName, copyrightText, links: links.map((l, i) => i === index ? { ...l, [field]: value } : l), backgroundColor, companyNameStyle });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-white">📋 页脚信息</h3></div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="text-sm font-medium text-gray-300">公司名称</label>
            <TextStylePicker value={companyNameStyle} onChange={(v) => set('companyNameStyle', v)} />
          </div>
          <input className="w-full rounded-lg border bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-600"
            value={companyName} onChange={(e) => set('companyName', e.target.value)} placeholder="您的公司" />
        </div>
        <Input label="版权信息" value={copyrightText} onChange={(e) => set('copyrightText', e.target.value)} placeholder="版权所有" />
      </div>
      <Input label="背景颜色" type="color" value={backgroundColor} onChange={(e) => set('backgroundColor', e.target.value)} />

      <div className="flex items-center justify-between pt-2">
        <h4 className="text-sm font-medium text-gray-400">链接列表</h4>
        <Button variant="secondary" size="sm" onClick={addLink}>+ 添加链接</Button>
      </div>
      {links.map((link, index) => (
        <div key={index} className="flex items-end gap-2">
          <Input label="链接文字" value={link.text} onChange={(e) => updateLink(index, 'text', e.target.value)} placeholder="隐私政策" />
          <Input label="链接地址" value={link.url} onChange={(e) => updateLink(index, 'url', e.target.value)} placeholder="#" />
          <Button variant="ghost" size="sm" onClick={() => removeLink(index)}>🗑️</Button>
        </div>
      ))}
    </div>
  );
}
