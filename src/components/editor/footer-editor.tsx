'use client';

import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { FooterLink } from '@/types';

interface FooterEditorProps {
  companyName: string;
  copyrightText: string;
  links: FooterLink[];
  backgroundColor: string;
  onChange: (data: {
    companyName: string;
    copyrightText: string;
    links: FooterLink[];
    backgroundColor: string;
  }) => void;
}

export default function FooterEditor({
  companyName,
  copyrightText,
  links,
  backgroundColor,
  onChange,
}: FooterEditorProps) {
  const addLink = () => {
    onChange({
      companyName,
      copyrightText,
      links: [...links, { text: '', url: '' }],
      backgroundColor,
    });
  };

  const removeLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    onChange({ companyName, copyrightText, links: newLinks, backgroundColor });
  };

  const updateLink = (index: number, field: keyof FooterLink, value: string) => {
    const newLinks = links.map((l, i) =>
      i === index ? { ...l, [field]: value } : l
    );
    onChange({ companyName, copyrightText, links: newLinks, backgroundColor });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">📋 页脚信息</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="公司名称"
          value={companyName}
          onChange={(e) =>
            onChange({
              companyName: e.target.value,
              copyrightText,
              links,
              backgroundColor,
            })
          }
          placeholder="您的公司"
        />
        <Input
          label="版权信息"
          value={copyrightText}
          onChange={(e) =>
            onChange({
              companyName,
              copyrightText: e.target.value,
              links,
              backgroundColor,
            })
          }
          placeholder="版权所有"
        />
      </div>
      <Input
        label="背景颜色"
        type="color"
        value={backgroundColor}
        onChange={(e) =>
          onChange({
            companyName,
            copyrightText,
            links,
            backgroundColor: e.target.value,
          })
        }
      />

      <div className="flex items-center justify-between pt-2">
        <h4 className="text-sm font-medium text-gray-400">链接列表</h4>
        <Button variant="secondary" size="sm" onClick={addLink}>
          + 添加链接
        </Button>
      </div>
      {links.map((link, index) => (
        <div key={index} className="flex items-end gap-2">
          <Input
            label="链接文字"
            value={link.text}
            onChange={(e) => updateLink(index, 'text', e.target.value)}
            placeholder="隐私政策"
          />
          <Input
            label="链接地址"
            value={link.url}
            onChange={(e) => updateLink(index, 'url', e.target.value)}
            placeholder="#"
          />
          <Button variant="ghost" size="sm" onClick={() => removeLink(index)}>
            🗑️
          </Button>
        </div>
      ))}
    </div>
  );
}
