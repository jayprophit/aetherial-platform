import { inMemoryDb } from './in-memory-db';

let _db: typeof inMemoryDb | null = null;

export function getDb() {
  if (!_db) {
    _db = inMemoryDb;
  }
  return _db;
}
