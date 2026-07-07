import { getDb } from './db';

let initialized = false;

export function initDb(): void {
  if (initialized) return;

  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS landing_pages (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      slug          TEXT    NOT NULL UNIQUE,
      title         TEXT    NOT NULL,
      description   TEXT    DEFAULT '',
      content       TEXT    NOT NULL DEFAULT '{}',
      is_template   INTEGER NOT NULL DEFAULT 0,
      is_published  INTEGER NOT NULL DEFAULT 1,
      created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS visitor_logs (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      landing_page_id INTEGER NOT NULL,
      ip_address      TEXT,
      user_agent      TEXT,
      referer         TEXT,
      visited_at      TEXT    NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (landing_page_id) REFERENCES landing_pages(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_visitor_page   ON visitor_logs(landing_page_id);
    CREATE INDEX IF NOT EXISTS idx_visitor_time   ON visitor_logs(visited_at);
    CREATE INDEX IF NOT EXISTS idx_pages_slug     ON landing_pages(slug);
    CREATE INDEX IF NOT EXISTS idx_pages_template ON landing_pages(is_template);
  `);

  initialized = true;
}

// Auto-initialize on first import (skip during Next.js build)
if (process.env.NEXT_PHASE !== 'phase-production-build') {
  initDb();
}
