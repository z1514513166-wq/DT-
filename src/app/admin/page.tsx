'use client';

import { useState, useEffect, useCallback } from 'react';
import StatsCards from '@/components/admin/stats-cards';
import VisitorChart from '@/components/admin/visitor-chart';

interface DashboardData {
  totalPages: number;
  totalVisitors: number;
  todayVisitors: number;
  periodVisitors?: number;
  pagesWithCounts: { id: number; title: string; slug: string; visitor_count: number }[];
  dailyStats?: { date: string; count: number }[];
}

const PERIODS = [
  { value: '', label: '全部' },
  { value: 'today', label: '今天' },
  { value: '7d', label: '7天' },
  { value: '30d', label: '30天' },
  { value: 'thisMonth', label: '本月' },
  { value: 'lastMonth', label: '上月' },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [period, setPeriod] = useState('7d');
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async (p: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stats/dashboard?period=${p}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('获取数据失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(period);
  }, [period, fetchStats]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">仪表盘</h2>
          <p className="text-gray-400 mt-1">查看落地页的整体表现数据</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-900 rounded-lg border border-gray-800 p-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                period === p.value
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading && !stats && (
        <div className="text-center py-12 text-gray-400">加载中...</div>
      )}

      {stats && (
        <>
          <StatsCards
            totalPages={stats.totalPages}
            totalVisitors={stats.totalVisitors}
            todayVisitors={stats.todayVisitors}
            periodVisitors={stats.periodVisitors}
            period={period}
          />

          <div className="mt-8">
            <VisitorChart
              pagesWithCounts={stats.pagesWithCounts}
              dailyStats={stats.dailyStats}
            />
          </div>
        </>
      )}
    </div>
  );
}
