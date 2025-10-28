import { getDb } from "./db";
import { user_points, badges, user_badges } from "../drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { createNotification } from "./notifications";

const POINT_ACTIONS = {
  CREATE_POST: 10,
  CREATE_COMMENT: 5,
  RECEIVE_LIKE: 1,
  ADD_FRIEND: 25,
  COMPLETE_PROFILE: 50,
  DAILY_LOGIN: 5,
};

export async function awardPoints(userId: number, action: keyof typeof POINT_ACTIONS) {
  const db = await getDb();
  if (!db) return;

  const points = POINT_ACTIONS[action];

  await db.insert(user_points).values({
    userId,
    points,
    action,
    createdAt: new Date(),
  });

  // In a real app, you would update a total points column on the users table for efficiency

  await checkForNewBadges(userId);
}

export async function checkForNewBadges(userId: number) {
  const db = await getDb();
  if (!db) return;

  const userBadgesResult = await db.select().from(user_badges).where(eq(user_badges.userId, userId));
  const userBadgeIds = userBadgesResult.map(b => b.badgeId);

  // Check for "Creator" badge (50 posts)
  if (!userBadgeIds.includes(1)) { // Assuming badge ID 1 is "Creator"
    const postCountResult = await db.select({ count: sql<number>`count(*)` }).from(posts).where(eq(posts.userId, userId));
    if (Number(postCountResult[0].count) >= 50) {
      await grantBadge(userId, 1);
    }
  }

  // Check for "Socialite" badge (100 friends)
  if (!userBadgeIds.includes(2)) { // Assuming badge ID 2 is "Socialite"
    const friendCountResult = await db.select({ count: sql<number>`count(*)` }).from(friendships).where(sql`(${friendships.userId} = ${userId} OR ${friendships.friendId} = ${userId}) AND ${friendships.status} = 'accepted'`);
    if (Number(friendCountResult[0].count) >= 100) {
      await grantBadge(userId, 2);
    }
  }
}

async function grantBadge(userId: number, badgeId: number) {
  const db = await getDb();
  if (!db) return;

  await db.insert(user_badges).values({
    userId,
    badgeId,
    createdAt: new Date(),
  });

  const badgeResult = await db.select().from(badges).where(eq(badges.id, badgeId));
  const badge = badgeResult[0];

  if (badge) {
    createNotification(userId, "new_badge", `You've earned the ${badge.name} badge!`, "/profile");
  }
}

