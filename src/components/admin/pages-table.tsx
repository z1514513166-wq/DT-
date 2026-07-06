'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/modal';

interface PageItem {
  id: number;
  title: string;
  slug: string;
  visitor_count: number;
  is_template: number;
  is_published: number;
  updated_at: string;
}

export default function PagesTable() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<PageItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPages = useCallback(async () => {
    try {
      const res = await fetch('/api/pages');
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch (err) {
      console.error('获取页面列表失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/pages/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        setPages((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error('删除页面失败:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleSetTemplate = async (id: number) => {
    try {
      const res = await fetch(`/api/pages/${id}/set-template`, { method: 'POST' });
      if (res.ok) fetchPages();
    } catch (err) {
      console.error('设置模板失败:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">加载中...</div>;
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg mb-4">暂无落地页</p>
        <Link href="/admin/pages/new">
          <Button variant="primary" size="lg">➕ 创建第一个页面</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">页面标题</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Slug</th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">访问量</th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">模板</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">更新时间</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{page.title}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">/{page.slug}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-gray-300">👥 {page.visitor_count}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {page.is_template ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-yellow-600/20 text-yellow-400 px-2 py-0.5 rounded-full">⭐ 当前模板</span>
                    ) : (
                      <button onClick={() => handleSetTemplate(page.id)} className="text-xs text-gray-500 hover:text-yellow-400 transition-colors">设为模板</button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(page.updated_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/lp/${page.slug}`} target="_blank" className="text-gray-500 hover:text-blue-400 text-xs transition-colors">查看</Link>
                      <Link href={`/admin/pages/${page.id}/edit`}><Button variant="ghost" size="sm">✏️</Button></Link>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(page)}>🗑️</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="删除落地页"
        message={`确定要删除「${deleteTarget?.title}」吗？该页面的所有访问记录也将被一并删除。此操作不可撤销。`}
        confirmText="确认删除"
        loading={deleting}
      />
    </>
  );
}
