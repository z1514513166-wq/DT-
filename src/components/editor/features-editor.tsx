'use client';

import { useState, useRef } from 'react';
import { Feature } from '@/types';
import Input from '@/components/ui/input';
import { Textarea } from '@/components/ui/input';
import Button from '@/components/ui/button';
import { TextStyle } from '@/types';
import TextStylePicker from './text-style-picker';

interface FeaturesEditorProps {
  features: Feature[];
  featuresTitle?: string;
  featuresTitleStyle?: TextStyle;
  onChange: (features: Feature[]) => void;
  onTitleChange: (title: string) => void;
  onTitleStyleChange?: (style: TextStyle) => void;
}

export default function FeaturesEditor({
  features,
  featuresTitle,
  featuresTitleStyle,
  onChange,
  onTitleChange,
  onTitleStyleChange,
}: FeaturesEditorProps) {
  const addFeature = () => {
    const newFeature: Feature = {
      id: crypto.randomUUID(),
      image: '',
      title: '',
      description: '',
      detail: '',
    };
    onChange([...features, newFeature]);
  };

  const removeFeature = (id: string) => {
    onChange(features.filter((f) => f.id !== id));
  };

  const updateFeature = (id: string, field: keyof Feature, value: string) => {
    onChange(
      features.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const moveFeature = (index: number, direction: 'up' | 'down') => {
    const newFeatures = [...features];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFeatures.length) return;
    [newFeatures[index], newFeatures[targetIndex]] = [
      newFeatures[targetIndex],
      newFeatures[index],
    ];
    onChange(newFeatures);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">✨ 产品展示</h3>
        <Button variant="secondary" size="sm" onClick={addFeature}>
          + 添加产品
        </Button>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <label className="text-sm font-medium text-gray-300">区块标题</label>
          <TextStylePicker value={featuresTitleStyle} onChange={(v) => onTitleStyleChange?.(v)} />
        </div>
        <input className="w-full rounded-lg border bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-600"
          value={featuresTitle ?? '核心特性'} onChange={(e) => onTitleChange(e.target.value)} placeholder="核心特性" />
      </div>

      {features.length === 0 && (
        <p className="text-gray-500 text-sm">暂无产品，点击上方按钮添加。</p>
      )}

      {features.map((feature, index) => (
        <ProductEditor
          key={feature.id}
          feature={feature}
          index={index}
          total={features.length}
          onUpdate={(f) => {
            onChange(features.map((x) => (x.id === feature.id ? f : x)));
          }}
          onRemove={() => removeFeature(feature.id)}
          onMoveUp={() => moveFeature(index, 'up')}
          onMoveDown={() => moveFeature(index, 'down')}
        />
      ))}
    </div>
  );
}

function ProductEditor({
  feature,
  index,
  total,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  feature: Feature;
  index: number;
  total: number;
  onUpdate: (f: Feature) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof Feature, value: string) => {
    onUpdate({ ...feature, [field]: value });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const data = await res.json();
        set('image', data.url);
      }
    } catch { /* ignore */ }
    finally { setUploading(false); }
  };

  return (
    <div className="border border-gray-700 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">产品 #{index + 1}</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onMoveUp} disabled={index === 0}>↑</Button>
          <Button variant="ghost" size="sm" onClick={onMoveDown} disabled={index === total - 1}>↓</Button>
          <Button variant="ghost" size="sm" onClick={onRemove}>🗑️</Button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">产品图片</label>
        {feature.image && (
          <div className="relative rounded-lg overflow-hidden border border-gray-600 h-32 mb-2">
            <img src={feature.image} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => set('image', '')}
              className="absolute top-1 right-1 bg-red-600/80 text-white text-xs px-1.5 py-0.5 rounded"
            >移除</button>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? '上传中...' : feature.image ? '更换图片' : '📷 上传图片'}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="产品名称" value={feature.title} onChange={(e) => set('title', e.target.value)} placeholder="产品名称" />
        <Input label="简短描述" value={feature.description} onChange={(e) => set('description', e.target.value)} placeholder="一句话简介" />
      </div>

      <Textarea
        label="产品详情"
        value={feature.detail}
        onChange={(e) => set('detail', e.target.value)}
        placeholder="产品的详细介绍..."
        rows={4}
      />
    </div>
  );
}
