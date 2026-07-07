import { getDb } from './db';
import { LandingPage, LandingPageWithCount } from '@/types';
import { getDefaultContent } from './defaults';

export function getAllPages(): LandingPageWithCount[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT p.*,
        (SELECT COUNT(*) FROM visitor_logs v WHERE v.landing_page_id = p.id) AS visitor_count
      FROM landing_pages p
      ORDER BY p.updated_at DESC`
    )
    .all() as any[];

  return rows.map((row) => ({
    ...row,
    content: JSON.parse(row.content),
  }));
}

export function getPageById(id: number): LandingPage | null {
  const db = getDb();
  const row = db
    .prepare('SELECT * FROM landing_pages WHERE id = ?')
    .get(id) as any;
  if (!row) return null;
  return { ...row, content: JSON.parse(row.content) };
}

export function getPageBySlug(slug: string): LandingPage | null {
  const db = getDb();
  const row = db
    .prepare('SELECT * FROM landing_pages WHERE slug = ?')
    .get(slug) as any;
  if (!row) return null;
  return { ...row, content: JSON.parse(row.content) };
}

export function createPage(data: {
  slug: string;
  title: string;
  description?: string;
  content?: object;
  isPublished?: boolean;
}): LandingPage {
  const db = getDb();
  const content = data.content || getDefaultContent();
  const description = data.description || '';
  const isPublished = data.isPublished !== false ? 1 : 0;

  const result = db
    .prepare(
      `INSERT INTO landing_pages (slug, title, description, content, is_published)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(data.slug, data.title, description, JSON.stringify(content), isPublished);

  const page = getPageById(result.lastInsertRowid as number);
  if (!page) throw new Error('Failed to create page');
  return page;
}

export function updatePage(
  id: number,
  data: {
    slug?: string;
    title?: string;
    description?: string;
    content?: object;
    isPublished?: boolean;
    isTemplate?: boolean;
  }
): LandingPage | null {
  const db = getDb();
  const existing = getPageById(id);
  if (!existing) return null;

  const slug = data.slug || existing.slug;
  const title = data.title || existing.title;
  const description = data.description !== undefined ? data.description : existing.description;
  const content = data.content || existing.content;
  const isPublished =
    data.isPublished !== undefined
      ? data.isPublished
        ? 1
        : 0
      : existing.is_published;
  const isTemplate =
    data.isTemplate !== undefined
      ? data.isTemplate
        ? 1
        : 0
      : existing.is_template;

  db.prepare(
    `UPDATE landing_pages
     SET slug = ?, title = ?, description = ?, content = ?, is_published = ?, is_template = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).run(slug, title, description, JSON.stringify(content), isPublished, isTemplate, id);

  return getPageById(id);
}

export function deletePage(id: number): boolean {
  const db = getDb();

  // If deleting the template, auto-promote next oldest page
  const existing = getPageById(id);
  if (existing && existing.is_template) {
    const nextPage = db
      .prepare(
        'SELECT id FROM landing_pages WHERE id != ? ORDER BY created_at ASC LIMIT 1'
      )
      .get(id) as any;
    if (nextPage) {
      db.prepare('UPDATE landing_pages SET is_template = 1 WHERE id = ?').run(
        nextPage.id
      );
    }
  }

  const result = db.prepare('DELETE FROM landing_pages WHERE id = ?').run(id);
  return result.changes > 0;
}

export function getTemplatePage(): LandingPage | null {
  const db = getDb();
  const row = db
    .prepare(
      'SELECT * FROM landing_pages WHERE is_template = 1 ORDER BY updated_at DESC LIMIT 1'
    )
    .get() as any;
  if (!row) return null;
  return { ...row, content: JSON.parse(row.content) };
}

export function setTemplatePage(id: number): LandingPage | null {
  const db = getDb();
  const transaction = db.transaction(() => {
    // Clear existing template
    db.prepare('UPDATE landing_pages SET is_template = 0 WHERE is_template = 1').run();
    // Set new template
    db.prepare('UPDATE landing_pages SET is_template = 1 WHERE id = ?').run(id);
  });
  transaction();
  return getPageById(id);
}

export function getPageCount(): number {
  const db = getDb();
  const row = db.prepare('SELECT COUNT(*) as count FROM landing_pages').get() as any;
  return row.count;
}
