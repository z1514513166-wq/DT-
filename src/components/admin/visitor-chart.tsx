'use client';

interface VisitorChartProps {
  pagesWithCounts: { id: number; title: string; slug: string; visitor_count: number }[];
}

export default function VisitorChart({ pagesWithCounts }: VisitorChartProps) {
  const maxVisitors = Math.max(...pagesWithCounts.map((p) => p.visitor_count), 1);

  if (pagesWithCounts.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">各页面访问量</h3>
        <p className="text-gray-500 text-sm text-center py-8">
          暂无落地页，创建第一个页面后即可看到统计数据。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">各页面访问量</h3>
      <div className="space-y-4">
        {pagesWithCounts.map((page) => {
          const barWidth = maxVisitors > 0 ? Math.max((page.visitor_count / maxVisitors) * 100, 2) : 0;
          return (
            <div key={page.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-300 truncate max-w-[200px]">{page.title}</span>
                <span className="text-sm text-gray-500 font-mono">{page.visitor_count} 次</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-500" style={{ width: `${barWidth}%` }} />
              </div>
              <p className="text-xs text-gray-600 mt-0.5">/{page.slug}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
