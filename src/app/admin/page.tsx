'use client';

import { useState, useEffect, useCallback } from 'react';

interface DashboardData {
  totalPages: number;
  totalVisitors: number;
  todayVisitors: number;
  yesterdayVisitors?: number;
  periodVisitors?: number;
  pagesWithCounts: { id: number; title: string; slug: string; visitor_count: number }[];
  dailyStats?: { date: string; count: number }[];
}

const PERIODS = [
  { value: 'today', label: '今天' },
  { value: 'yesterday', label: '昨天' },
  { value: '7d', label: '近7天' },
  { value: '30d', label: '近30天' },
  { value: 'thisMonth', label: '本月' },
  { value: 'lastMonth', label: '上月' },
  { value: 'custom', label: '自定义' },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [period, setPeriod] = useState('7d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async (p: string, start?: string, end?: string) => {
    setLoading(true);
    try {
      let url = `/api/stats/dashboard?period=${p}`;
      if (p === 'custom' && start && end) url += `&start=${start}&end=${end}`;
      const res = await fetch(url);
      if (res.ok) setStats(await res.json());
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchStats(period, customStart, customEnd);
  }, [period, customStart, customEnd, fetchStats]);

  if (loading && !stats) return <div className="text-center py-20 text-gray-500">加载中...</div>;
  if (!stats) return null;

  const maxDaily = Math.max(...(stats.dailyStats || []).map(d => d.count), 1);
  const maxPageVisitors = Math.max(...stats.pagesWithCounts.map(p => p.visitor_count), 1);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">仪表盘</h2>
          <p className="text-gray-500 text-sm mt-0.5">监控落地页数据表现</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-1 border border-gray-800/50 flex-wrap">
          {PERIODS.map(p => (
            <button key={p.value} onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                period === p.value ? 'bg-pink-500/20 text-pink-400' : 'text-gray-500 hover:text-gray-300'
              }`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 自定义日期范围 */}
      {period === 'custom' && (
        <div className="flex items-center gap-3 mb-6 bg-gray-900 border border-gray-800/50 rounded-xl px-4 py-3">
          <span className="text-xs text-gray-400">日期范围：</span>
          <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-pink-500" />
          <span className="text-gray-500 text-xs">至</span>
          <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-pink-500" />
          <button
            onClick={() => fetchStats(period, customStart, customEnd)}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 transition-colors">
            查询
          </button>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* 时间段访问量 */}
        <div className="bg-gray-900 border border-gray-800/50 rounded-xl p-5 hover:border-gray-700/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500">访问量</span>
            <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-sm">📊</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.periodVisitors?.toLocaleString() || stats.totalVisitors.toLocaleString()}</div>
          <div className="text-xs text-gray-600">所选时段总访问</div>
        </div>

        {/* 今日 */}
        <div className="bg-gray-900 border border-gray-800/50 rounded-xl p-5 hover:border-gray-700/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500">今日</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-sm">📈</span>
          </div>
          <div className="text-3xl font-bold text-emerald-400 mb-1">{stats.todayVisitors.toLocaleString()}</div>
          <div className="text-xs text-gray-600">今日独立访客</div>
        </div>

        {/* 昨日 */}
        <div className="bg-gray-900 border border-gray-800/50 rounded-xl p-5 hover:border-gray-700/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500">昨日</span>
            <span className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 text-sm">📉</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.yesterdayVisitors?.toLocaleString() || '-'}</div>
          <div className="flex items-center gap-1.5">
            {stats.yesterdayVisitors != null && stats.todayVisitors > 0 ? (
              <span className={`text-xs font-medium ${stats.todayVisitors >= stats.yesterdayVisitors ? 'text-emerald-400' : 'text-red-400'}`}>
                {stats.todayVisitors >= stats.yesterdayVisitors ? '↑' : '↓'}
                {stats.yesterdayVisitors > 0 ? Math.abs(Math.round(((stats.todayVisitors - stats.yesterdayVisitors) / stats.yesterdayVisitors) * 100)) : 0}%
              </span>
            ) : null}
            <span className="text-xs text-gray-600">较昨日</span>
          </div>
        </div>

        {/* 活跃页面 */}
        <div className="bg-gray-900 border border-gray-800/50 rounded-xl p-5 hover:border-gray-700/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500">页面数</span>
            <span className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 text-sm">📄</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalPages}</div>
          <div className="text-xs text-gray-600">
            平均每页 {stats.totalPages > 0 ? Math.round((stats.periodVisitors || stats.totalVisitors) / stats.totalPages) : 0} 次访问
          </div>
        </div>
      </div>

      {/* Chart + Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 趋势图 */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-white">访问趋势</h3>
            <span className="text-xs text-gray-500">每日独立访客</span>
          </div>
          {stats.dailyStats && stats.dailyStats.length > 0 ? (
            <div className="relative h-48">
              <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[10px] text-gray-600">
                <span>{maxDaily}</span><span>{Math.round(maxDaily / 2)}</span><span>0</span>
              </div>
              <svg className="w-full h-full pl-8" viewBox={`0 0 ${Math.max((stats.dailyStats.length - 1) * 40, 40)} 120`} preserveAspectRatio="none">
                <line x1="0" y1="0" x2={(stats.dailyStats.length - 1) * 40} y2="0" stroke="#1f2937" strokeWidth="0.5" />
                <line x1="0" y1="60" x2={(stats.dailyStats.length - 1) * 40} y2="60" stroke="#1f2937" strokeWidth="0.5" />
                <line x1="0" y1="120" x2={(stats.dailyStats.length - 1) * 40} y2="120" stroke="#1f2937" strokeWidth="0.5" />
                <defs>
                  <linearGradient id="area2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`M0,${120 - (stats.dailyStats[0].count / maxDaily) * 120} ${stats.dailyStats.map((d, i) => `L${i * 40},${120 - (d.count / maxDaily) * 120}`).join(' ')} L${(stats.dailyStats.length - 1) * 40},120 L0,120 Z`} fill="url(#area2)" />
                <polyline points={stats.dailyStats.map((d, i) => `${i * 40},${120 - (d.count / maxDaily) * 120}`).join(' ')} fill="none" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                {stats.dailyStats.map((d, i) => (
                  <circle key={i} cx={i * 40} cy={120 - (d.count / maxDaily) * 120} r="2" fill="#ec4899" />
                ))}
              </svg>
              <div className="flex justify-between pl-8 mt-1">
                {(stats.dailyStats || []).filter((_, i) => i % Math.ceil((stats.dailyStats || []).length / 6) === 0).map((d, i) => (
                  <span key={i} className="text-[10px] text-gray-600">{d.date}</span>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-600 text-sm">暂无数据</div>
          )}
        </div>

        {/* 页面排行 */}
        <div className="bg-gray-900 border border-gray-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">页面排行</h3>
            <span className="text-xs text-gray-500">{stats.pagesWithCounts.length} 个页面</span>
          </div>
          {stats.pagesWithCounts.length === 0 ? (
            <div className="text-gray-600 text-sm text-center py-12">暂无数据</div>
          ) : (
            <div className="space-y-1">
              {stats.pagesWithCounts.slice(0, 8).map((page, i) => (
                <div key={page.id} className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-gray-800/50 transition-colors group">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    i === 0 ? 'bg-pink-500/20 text-pink-400' :
                    i === 1 ? 'bg-pink-500/10 text-pink-300' :
                    i === 2 ? 'bg-pink-500/5 text-pink-200/50' : 'text-gray-600'
                  }`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 truncate">{page.title || '未命名'}</p>
                    <p className="text-[11px] text-gray-600">/{page.slug}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden hidden sm:block">
                      <div className="h-full bg-pink-500/40 rounded-full transition-all"
                        style={{ width: `${Math.max((page.visitor_count / maxPageVisitors) * 100, 2)}%` }} />
                    </div>
                    <span className="text-xs font-mono text-gray-400 w-10 text-right">{page.visitor_count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
