import { getDb } from "./db";

export class SocialGraphService {
  async getFollowers(userId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const followers = await db.run(
      "SELECT follower_id FROM followers WHERE followee_id = ?",
      userId
    );
    return followers;
  }

  async getFollowing(userId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const following = await db.run(
      "SELECT followee_id FROM followers WHERE follower_id = ?",
      userId
    );
    return following;
  }

  async getFriends(userId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const friends = await db.run(
      "SELECT f1.followee_id FROM followers f1 JOIN followers f2 ON f1.follower_id = f2.followee_id AND f1.followee_id = f2.follower_id WHERE f1.follower_id = ?",
      userId
    );
    return friends;
  }

  async getSocialFeed(userId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const following = await this.getFollowing(userId);
    if (following.rows.length === 0) {
      // If the user is not following anyone, return the most popular posts
      const popularPosts = await db.run(
        "SELECT post_id, COUNT(*) as like_count FROM post_likes GROUP BY post_id ORDER BY like_count DESC LIMIT 10"
      );
      return popularPosts;
    }

    const socialFeed = await db.run(
      `SELECT p.* FROM posts p JOIN followers f ON p.user_id = f.followee_id WHERE f.follower_id = ? ORDER BY p.created_at DESC`,
      userId
    );
    return socialFeed;
  }
}

