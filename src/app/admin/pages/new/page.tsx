'use client';

import { useState, useEffect } from 'react';
import PageEditor from '@/components/editor/page-editor';
import { LandingPageContent } from '@/types';
import { getDefaultContent } from '@/lib/defaults';

export default function NewPage() {
  const [initialData, setInitialData] = useState<{
    title: string; slug: string; description: string; content: LandingPageContent;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldClone = params.get('clone');

    if (shouldClone === 'true') {
      fetch('/api/template')
        .then((res) => res.json())
        .then((template) => {
          setInitialData({
            title: '', slug: '', description: '',
            content: template.content || getDefaultContent(),
          });
        })
        .catch(() => setInitialData({ title: '', slug: '', description: '', content: getDefaultContent() }))
        .finally(() => setLoading(false));
    } else {
      setInitialData({ title: '', slug: '', description: '', content: getDefaultContent() });
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-400">加载编辑器中...</div>;
  if (!initialData) return null;

  return <PageEditor initialData={initialData} isNew={true} />;
}
