'use client';

import Input from '@/components/ui/input';

interface BrandingEditorProps {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoUrl: string | null;
  onChange: (data: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    logoUrl: string | null;
  }) => void;
}

const fontOptions = [
  { value: 'Inter', label: 'Inter（现代简洁）' },
  { value: 'system-ui', label: '系统默认' },
  { value: 'Georgia', label: 'Georgia（衬线体）' },
  { value: 'Arial', label: 'Arial（通用）' },
  { value: 'Helvetica', label: 'Helvetica（经典）' },
  { value: 'Verdana', label: 'Verdana（清晰）' },
];

export default function BrandingEditor({
  primaryColor,
  secondaryColor,
  fontFamily,
  logoUrl,
  onChange,
}: BrandingEditorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">🎨 品牌样式</h3>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="主色调"
          type="color"
          value={primaryColor}
          onChange={(e) =>
            onChange({ primaryColor: e.target.value, secondaryColor, fontFamily, logoUrl })
          }
        />
        <Input
          label="辅色调"
          type="color"
          value={secondaryColor}
          onChange={(e) =>
            onChange({ primaryColor, secondaryColor: e.target.value, fontFamily, logoUrl })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">字体</label>
        <select
          value={fontFamily}
          onChange={(e) =>
            onChange({ primaryColor, secondaryColor, fontFamily: e.target.value, logoUrl })
          }
          className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {fontOptions.map((font) => (
            <option key={font.value} value={font.value}>{font.label}</option>
          ))}
        </select>
      </div>

      <Input
        label="Logo 链接（选填）"
        value={logoUrl || ''}
        onChange={(e) =>
          onChange({ primaryColor, secondaryColor, fontFamily, logoUrl: e.target.value || null })
        }
        placeholder="https://example.com/logo.png"
      />
    </div>
  );
}
