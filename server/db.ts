import { dbStore, inMemoryDb } from './in-memory-db';
import type { User } from '../drizzle/schema';

let _db: typeof inMemoryDb | null = null;

export function getDb() {
  if (!_db) {
    _db = inMemoryDb;
  }
  return _db;
}

/**
 * The fields the OAuth and session code supplies when it creates or
 * refreshes a user. This is deliberately smaller than the whole table:
 * the in-memory store cannot persist the rest, and pretending otherwise
 * would hide the gap.
 */
export interface UpsertUserInput {
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  lastSignedIn?: Date;
}

/**
 * Create a user or update the supplied fields on an existing one.
 *
 * This is an in-memory store. It survives for the life of the server
 * process only and is not a database.
 */
export async function upsertUser(data: UpsertUserInput): Promise<void> {
  const now = new Date();
  const existing = dbStore.users.find(user => user.openId === data.openId);

  if (existing) {
    if (data.name !== undefined) existing.name = data.name;
    if (data.email !== undefined) existing.email = data.email;
    if (data.loginMethod !== undefined) existing.loginMethod = data.loginMethod;
    existing.lastSignedIn = data.lastSignedIn ?? now;
    existing.updatedAt = now;
    return;
  }

  const nextId =
    dbStore.users.reduce((highest, user) => Math.max(highest, user.id), 0) + 1;

  const user: User = {
    id: nextId,
    openId: data.openId,
    email: data.email ?? null,
    username: null,
    name: data.name ?? null,
    loginMethod: data.loginMethod ?? null,
    role: 'user',
    firstName: null,
    lastName: null,
    displayName: null,
    bio: null,
    avatar: null,
    coverPhoto: null,
    birthDate: null,
    age: null,
    ageTier: null,
    walletAddress: null,
    aethBalance: '0',
    lockedBalance: '0',
    isVerified: false,
    isActive: true,
    lastSignedIn: data.lastSignedIn ?? now,
    createdAt: now,
    updatedAt: now,
  };

  dbStore.users.push(user);
}

/**
 * Find a user by the OAuth subject identifier.
 */
export async function getUserByOpenId(
  openId: string
): Promise<User | undefined> {
  return dbStore.users.find(user => user.openId === openId);
}
