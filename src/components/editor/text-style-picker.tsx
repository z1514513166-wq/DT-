'use client';

import { TextStyle } from '@/types';
import { SIZE_OPTIONS } from '@/lib/text-styles';

interface TextStylePickerProps {
  value?: TextStyle;
  onChange: (style: TextStyle) => void;
}

export default function TextStylePicker({ value, onChange }: TextStylePickerProps) {
  const current = value || {};

  return (
    <div className="flex items-center gap-2">
      <select
        value={current.size || ''}
        onChange={(e) => onChange({ ...current, size: e.target.value || undefined })}
        className="rounded border border-gray-600 bg-gray-700 px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {SIZE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <button
        onClick={() => onChange({ ...current, bold: !current.bold })}
        className={`text-xs font-bold px-2 py-1 rounded border transition-colors ${
          current.bold
            ? 'bg-blue-600 border-blue-500 text-white'
            : 'border-gray-600 bg-gray-700 text-gray-400 hover:text-white'
        }`}
        title="粗体"
      >
        B
      </button>
    </div>
  );
}
