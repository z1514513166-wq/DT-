'use client';

import { useState, useRef } from 'react';
import Input from '@/components/ui/input';
import { Textarea } from '@/components/ui/input';
import Button from '@/components/ui/button';

interface AboutEditorProps {
  avatarUrl: string | null;
  companyName: string;
  description: string;
  backgroundColor: string;
  backgroundImage: string | null;
  onChange: (data: {
    avatarUrl: string | null;
    companyName: string;
    description: string;
    backgroundColor: string;
    backgroundImage: string | null;
  }) => void;
}

export default function AboutEditor({
  avatarUrl,
  companyName,
  description,
  backgroundColor,
  backgroundImage,
  onChange,
}: AboutEditorProps) {
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);
  const bgRef = useRef<HTMLInputElement>(null);

  const set = (field: string, value: string | null) => {
    onChange({ avatarUrl, companyName, description, backgroundColor, backgroundImage, [field]: value });
  };

  // 上传通用方法
  const uploadFile = async (file: File, field: string, setUploading: (v: boolean) => void) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const data = await res.json();
        set(field, data.url);
      }
    } catch { /* ignore */ }
    finally { setUploading(false); }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">🏢 公司介绍</h3>

      {/* 头像 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">头像 / Logo</label>
        {avatarUrl && (
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-600 mb-2">
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => set('avatarUrl', null)}
              className="absolute inset-0 bg-black/60 text-white text-xs flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            >
              移除
            </button>
          </div>
        )}
        <input ref={avatarRef} type="file" accept="image/*"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f, 'avatarUrl', setUploadingAvatar); }}
          className="hidden" />
        <Button variant="secondary" size="sm" onClick={() => avatarRef.current?.click()} disabled={uploadingAvatar}>
          {uploadingAvatar ? '上传中...' : avatarUrl ? '更换图片' : '📷 上传头像'}
        </Button>
      </div>

      {/* 背景图片 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">背景图片</label>
        {backgroundImage && (
          <div className="relative rounded-lg overflow-hidden border border-gray-600 h-24 mb-2">
            <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => set('backgroundImage', null)}
              className="absolute top-1 right-1 bg-red-600/80 text-white text-xs px-1.5 py-0.5 rounded"
            >
              移除
            </button>
          </div>
        )}
        <input ref={bgRef} type="file" accept="image/*"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f, 'backgroundImage', setUploadingBg); }}
          className="hidden" />
        <Button variant="secondary" size="sm" onClick={() => bgRef.current?.click()} disabled={uploadingBg}>
          {uploadingBg ? '上传中...' : backgroundImage ? '更换背景' : '🖼 上传背景图片'}
        </Button>
      </div>

      <Input
        label="公司名称"
        value={companyName}
        onChange={(e) => set('companyName', e.target.value)}
        placeholder="关于我们"
      />

      <Textarea
        label="公司简介"
        value={description}
        onChange={(e) => set('description', e.target.value)}
        placeholder="介绍一下您的公司和团队..."
        rows={4}
      />

      <Input
        label="背景颜色"
        type="color"
        value={backgroundColor}
        onChange={(e) => set('backgroundColor', e.target.value)}
      />
    </div>
  );
}
