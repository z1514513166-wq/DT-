'use client';

interface StatsCardsProps {
  totalPages: number;
  totalVisitors: number;
  todayVisitors: number;
  periodVisitors?: number;
  period?: string;
}

const PERIOD_LABELS: Record<string, string> = {
  today: '今日',
  '7d': '7天',
  '30d': '30天',
  thisMonth: '本月',
  lastMonth: '上月',
};

export default function StatsCards({ totalPages, totalVisitors, todayVisitors, periodVisitors, period }: StatsCardsProps) {
  const periodLabel = PERIOD_LABELS[period || ''] || '总';

  const cards = [
    { label: '页面总数', value: totalPages, icon: '📄', color: 'from-blue-600 to-blue-800' },
    { label: '总访问量', value: totalVisitors, icon: '👥', color: 'from-green-600 to-green-800' },
    { label: '今日访问', value: todayVisitors, icon: '📈', color: 'from-purple-600 to-purple-800' },
    { label: `${periodLabel}访问`, value: periodVisitors ?? totalVisitors, icon: '📊', color: 'from-orange-600 to-orange-800' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-xl bg-gradient-to-br ${card.color} p-5 shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">{card.label}</p>
              <p className="text-3xl font-bold text-white mt-1">{card.value.toLocaleString()}</p>
            </div>
            <span className="text-3xl opacity-50">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
