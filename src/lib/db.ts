import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'landing-pages.db');

// Singleton database connection
let db: Database.Database | null = null;
let initialized = false;

export function getDb(): Database.Database {
  if (!db) {
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.pragma('busy_timeout = 5000');
  }
  if (!initialized) {
    initialized = true;
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
  }
  return db;
}

export default getDb;
