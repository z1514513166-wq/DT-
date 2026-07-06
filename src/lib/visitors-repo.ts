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
  db.prepare(
    `INSERT INTO visitor_logs (landing_page_id, ip_address, user_agent, referer)
     VALUES (?, ?, ?, ?)`
  ).run(landingPageId, ipAddress, userAgent, referer);
}

export function getStatsForPage(pageId: number): PageStats {
  const db = getDb();

  const totalRow = db
    .prepare('SELECT COUNT(*) as count FROM visitor_logs WHERE landing_page_id = ?')
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

  const last30Row = db
    .prepare(
      `SELECT COUNT(*) as count FROM visitor_logs
       WHERE landing_page_id = ? AND visited_at >= datetime('now', '-30 days')`
    )
    .get(pageId) as any;

  return {
    total: totalRow.count,
    today: todayRow.count,
    last7Days,
    last30Days: last30Row.count,
  };
}

export function getDashboardStats(): DashboardStats {
  const db = getDb();

  const pagesRow = db
    .prepare('SELECT COUNT(*) as count FROM landing_pages')
    .get() as any;

  const totalVisitorsRow = db
    .prepare('SELECT COUNT(*) as count FROM visitor_logs')
    .get() as any;

  const todayVisitorsRow = db
    .prepare(
      "SELECT COUNT(*) as count FROM visitor_logs WHERE date(visited_at) = date('now')"
    )
    .get() as any;

  const pagesWithCounts = getAllPages().map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    visitor_count: p.visitor_count,
  }));

  return {
    totalPages: pagesRow.count,
    totalVisitors: totalVisitorsRow.count,
    todayVisitors: todayVisitorsRow.count,
    pagesWithCounts,
  };
}
