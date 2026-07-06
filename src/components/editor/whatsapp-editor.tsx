'use client';

import Input from '@/components/ui/input';

interface WhatsAppEditorProps {
  link: string;
  enabled: boolean;
  onChange: (data: { link: string; enabled: boolean }) => void;
}

export default function WhatsAppEditor({ link, enabled, onChange }: WhatsAppEditorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">💬 WhatsApp 悬浮按钮</h3>

      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onChange({ link, enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
        </label>
        <span className="text-sm text-gray-300">{enabled ? '已启用' : '已禁用'}</span>
      </div>

      {enabled && (
        <Input
          label="WhatsApp 链接"
          value={link}
          onChange={(e) => onChange({ link: e.target.value, enabled })}
          placeholder="https://wa.me/8613800138000?text=您好，我想了解更多"
          helperText="填写完整的 WhatsApp 链接，可附带预设消息"
        />
      )}
    </div>
  );
}
