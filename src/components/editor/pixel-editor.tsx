'use client';

import Input from '@/components/ui/input';

interface PixelEditorProps {
  pixelId: string | null;
  enabled: boolean;
  onChange: (data: { pixelId: string | null; enabled: boolean }) => void;
}

export default function PixelEditor({ pixelId, enabled, onChange }: PixelEditorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">📊 Facebook Pixel 追踪</h3>

      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onChange({ pixelId, enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
        <span className="text-sm text-gray-300">{enabled ? '已启用' : '已禁用'}</span>
      </div>

      {enabled && (
        <Input
          label="Facebook Pixel ID"
          value={pixelId || ''}
          onChange={(e) => onChange({ pixelId: e.target.value || null, enabled })}
          placeholder="1234567890123456"
          helperText="请输入您从 Facebook 广告管理后台获取的 16 位 Pixel ID"
        />
      )}
    </div>
  );
}
