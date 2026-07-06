import { getDb } from './db';
import { initDb } from './db-init';
import { PageStats, DashboardStats } from '@/types';
import { getAllPages } from './pages-repo';

initDb();

export function trackVisit(
  landingPageId: number,
  ipAddress: string | null,
  userAgent: string | null,
  referer: string | null
): void {
  const db = getDb();
  if (ipAddress) {
    const existing = db
      .prepare(
        `SELECT id FROM visitor_logs
         WHERE landing_page_id = ? AND ip_address = ? AND date(visited_at) = date('now')
         LIMIT 1`
      )
      .get(landingPageId, ipAddress) as any;
    if (existing) return;
  }
  db.prepare(
    `INSERT INTO visitor_logs (landing_page_id, ip_address, user_agent, referer)
     VALUES (?, ?, ?, ?)`
  ).run(landingPageId, ipAddress, userAgent, referer);
}

export function getStatsForPage(pageId: number, period?: string): PageStats {
  const db = getDb();
  const dateFilter = getDateFilter(period);

  const totalRow = db
    .prepare('SELECT COUNT(*) as count FROM visitor_logs WHERE landing_page_id = ?')
    .get(pageId) as any;

  const periodRow = db
    .prepare(
      `SELECT COUNT(*) as count FROM visitor_logs
       WHERE landing_page_id = ? ${dateFilter}`
    )
    .get(pageId) as any;

  const todayRow = db
    .prepare(
      `SELECT COUNT(*) as count FROM visitor_logs
       WHERE landing_page_id = ? AND date(visited_at) = date('now')`
    )
    .get(pageId) as any;

  const last7Days: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const row = db
      .prepare(
        `SELECT COUNT(*) as count FROM visitor_logs
         WHERE landing_page_id = ? AND date(visited_at) = date('now', ? || ' days')`
      )
      .get(pageId, `-${i}`) as any;
    last7Days.push(row.count);
  }

  return {
    total: totalRow.count,
    today: todayRow.count,
    last7Days,
    last30Days: periodRow.count,
  };
}

export function getDashboardStats(period?: string, startDate?: string, endDate?: string): DashboardStats {
  const db = getDb();
  const dateFilter = getDateFilter(period, startDate, endDate);

  const pagesRow = db
    .prepare('SELECT COUNT(*) as count FROM landing_pages')
    .get() as any;

  const totalVisitorsRow = db
    .prepare('SELECT COUNT(*) as count FROM visitor_logs')
    .get() as any;

  const periodVisitorsRow = db
    .prepare(`SELECT COUNT(*) as count FROM visitor_logs ${dateFilter}`)
    .get() as any;

  const todayVisitorsRow = db
    .prepare("SELECT COUNT(*) as count FROM visitor_logs WHERE date(visited_at) = date('now')")
    .get() as any;

  const yesterdayVisitorsRow = db
    .prepare("SELECT COUNT(*) as count FROM visitor_logs WHERE date(visited_at) = date('now', '-1 day')")
    .get() as any;

  // 按时间段统计每个页面的访问量
  const pagesWithCounts = db
    .prepare(
      `SELECT p.id, p.title, p.slug,
        (SELECT COUNT(*) FROM visitor_logs v WHERE v.landing_page_id = p.id ${dateFilter.replace(/WHERE/i, 'AND')}) AS visitor_count
       FROM landing_pages p
       ORDER BY visitor_count DESC`
    )
    .all() as any[];

  // 按天统计（用于图表）
  const dailyStats = getDailyStats(db, period, startDate, endDate);

  return {
    totalPages: pagesRow.count,
    totalVisitors: totalVisitorsRow.count,
    todayVisitors: todayVisitorsRow.count,
    yesterdayVisitors: yesterdayVisitorsRow.count,
    periodVisitors: periodVisitorsRow.count,
    pagesWithCounts,
    dailyStats,
  };
}

function getDateFilter(period?: string, startDate?: string, endDate?: string): string {
  if (period === 'custom' && startDate && endDate) {
    return `WHERE date(visited_at) >= date('${startDate}') AND date(visited_at) <= date('${endDate}')`;
  }
  switch (period) {
    case 'today':
      return "WHERE date(visited_at) = date('now')";
    case 'yesterday':
      return "WHERE date(visited_at) = date('now', '-1 day')";
    case '7d':
      return "WHERE visited_at >= datetime('now', '-7 days')";
    case '30d':
      return "WHERE visited_at >= datetime('now', '-30 days')";
    case 'thisMonth':
      return "WHERE strftime('%Y-%m', visited_at) = strftime('%Y-%m', 'now')";
    case 'lastMonth':
      return "WHERE strftime('%Y-%m', visited_at) = strftime('%Y-%m', 'now', '-1 month')";
    default:
      return '';
  }
}

function getDailyStats(db: any, period?: string, startDate?: string, endDate?: string): { date: string; count: number }[] {
  let days = 7;

  if (period === 'custom' && startDate && endDate) {
    const s = new Date(startDate);
    const e = new Date(endDate);
    days = Math.min(Math.ceil((e.getTime() - s.getTime()) / 86400000) + 1, 90);
    const rows: { date: string; count: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(e);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const row = db.prepare("SELECT COUNT(*) as count FROM visitor_logs WHERE date(visited_at) = ?").get(dateStr) as any;
      rows.push({ date: `${d.getMonth() + 1}/${d.getDate()}`, count: row.count });
    }
    return rows;
  }

  if (period === '30d' || period === 'lastMonth') days = 30;
  if (period === 'thisMonth') days = new Date().getDate();
  if (period === 'today' || period === 'yesterday') days = 1;

  const rows: { date: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const row = db
      .prepare(
        `SELECT COUNT(*) as count FROM visitor_logs
         WHERE date(visited_at) = date('now', ? || ' days')`
      )
      .get(`-${i}`) as any;
    const d = new Date();
    d.setDate(d.getDate() - i);
    rows.push({ date: `${d.getMonth() + 1}/${d.getDate()}`, count: row.count });
  }
  return rows;
}
