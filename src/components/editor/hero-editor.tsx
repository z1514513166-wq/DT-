'use client';

import { useState, useRef } from 'react';
import Input from '@/components/ui/input';
import { Textarea } from '@/components/ui/input';
import Button from '@/components/ui/button';
import { LandingPageContent } from '@/types';

interface HeroEditorProps {
  hero: LandingPageContent['hero'];
  onChange: (hero: LandingPageContent['hero']) => void;
}

export default function HeroEditor({ hero, onChange }: HeroEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (field: string, value: string) => {
    onChange({ ...hero, [field]: value });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        update('backgroundImage', data.url);
      } else {
        const data = await res.json();
        setUploadError(data.error || '上传失败');
      }
    } catch {
      setUploadError('上传失败，请检查网络');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    update('backgroundImage', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">🦸 首屏区域</h3>
      <Input
        label="主标题"
        value={hero.headline}
        onChange={(e) => update('headline', e.target.value)}
        placeholder="提升业务增长的终极解决方案"
      />
      <Textarea
        label="副标题"
        value={hero.subheadline}
        onChange={(e) => update('subheadline', e.target.value)}
        placeholder="帮助您提高效率、增加收入的领先工具..."
        rows={3}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="按钮文字"
          value={hero.ctaText}
          onChange={(e) => update('ctaText', e.target.value)}
          placeholder="立即免费开始"
        />
        <Input
          label="按钮链接"
          value={hero.ctaLink}
          onChange={(e) => update('ctaLink', e.target.value)}
          placeholder="#cta"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          背景设置
        </label>

        <Input
          label="背景颜色"
          type="color"
          value={hero.backgroundColor}
          onChange={(e) => update('backgroundColor', e.target.value)}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            背景图片
          </label>

          {hero.backgroundImage && (
            <div className="relative rounded-lg overflow-hidden border border-gray-600 h-32">
              <img
                src={hero.backgroundImage}
                alt="背景预览"
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white text-xs px-2 py-1 rounded transition-colors"
              >
                移除
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              id="bg-image-upload"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? '上传中...' : hero.backgroundImage ? '更换图片' : '📷 上传背景图片'}
            </Button>
            {hero.backgroundImage && (
              <span className="text-xs text-gray-500 truncate max-w-[200px]">
                {hero.backgroundImage}
              </span>
            )}
          </div>

          {uploadError && (
            <p className="text-xs text-red-400">{uploadError}</p>
          )}
          <p className="text-xs text-gray-500">
            支持 JPG、PNG、GIF、WebP，最大 5MB。推荐尺寸 1920×1080。
          </p>
        </div>
      </div>
    </div>
  );
}
