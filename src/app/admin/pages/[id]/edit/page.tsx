'use client';

import { useState, useEffect, use } from 'react';
import PageEditor from '@/components/editor/page-editor';
import { LandingPageContent } from '@/types';

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initialData, setInitialData] = useState<{
    id: number; title: string; slug: string; description: string; content: LandingPageContent;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/pages/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('页面未找到');
        return res.json();
      })
      .then((data) => setInitialData({ id: data.id, title: data.title, slug: data.slug, description: data.description, content: data.content }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12 text-gray-400">加载页面数据中...</div>;
  if (error) return <div className="text-center py-12"><p className="text-red-400 text-lg">{error}</p></div>;
  if (!initialData) return null;

  return <PageEditor initialData={initialData} isNew={false} />;
}
