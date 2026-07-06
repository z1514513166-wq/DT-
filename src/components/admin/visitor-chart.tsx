'use client';

interface VisitorChartProps {
  pagesWithCounts: { id: number; title: string; slug: string; visitor_count: number }[];
  dailyStats?: { date: string; count: number }[];
}

export default function VisitorChart({ pagesWithCounts, dailyStats }: VisitorChartProps) {
  const maxDaily = Math.max(...(dailyStats || []).map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      {/* 每日趋势图 */}
      {dailyStats && dailyStats.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">每日访问趋势</h3>
          <div className="flex items-end gap-1 h-32">
            {dailyStats.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <span className="text-[10px] text-gray-500">{d.count > 0 ? d.count : ''}</span>
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm transition-all min-h-[2px]"
                  style={{ height: `${Math.max((d.count / maxDaily) * 100, 2)}%` }}
                />
                <span className="text-[10px] text-gray-600 mt-1">{d.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 各页面访问量 */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">各页面访问量</h3>
        {pagesWithCounts.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">暂无数据。</p>
        ) : (
          <div className="space-y-4">
            {pagesWithCounts.map((page) => {
              const maxVisitors = Math.max(...pagesWithCounts.map((p) => p.visitor_count), 1);
              const barWidth = Math.max((page.visitor_count / maxVisitors) * 100, 2);
              return (
                <div key={page.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300 truncate max-w-[200px]">{page.title}</span>
                    <span className="text-sm text-gray-500 font-mono">{page.visitor_count} 次</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all" style={{ width: `${barWidth}%` }} />
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">/{page.slug}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
