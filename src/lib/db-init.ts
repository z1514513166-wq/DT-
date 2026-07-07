import { getDb } from './db';

/**
 * @deprecated Initialization is now handled inside getDb().
 * Kept for backward compatibility.
 */
export function initDb(): void {
  getDb();
}
