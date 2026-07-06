import { getDashboardStats } from '@/lib/visitors-repo';
import StatsCards from '@/components/admin/stats-cards';
import VisitorChart from '@/components/admin/visitor-chart';

export default function AdminDashboardPage() {
  const stats = getDashboardStats();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">仪表盘</h2>
        <p className="text-gray-400 mt-1">查看落地页的整体表现数据</p>
      </div>

      <StatsCards
        totalPages={stats.totalPages}
        totalVisitors={stats.totalVisitors}
        todayVisitors={stats.todayVisitors}
      />

      <div className="mt-8">
        <VisitorChart pagesWithCounts={stats.pagesWithCounts} />
      </div>
    </div>
  );
}
