import { getDb } from "./db";

export class RecommenderService {
  async getRecommendations(userId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Get the user's liked posts
    const likedPosts = await db.run(
      "SELECT post_id FROM post_likes WHERE user_id = ?",
      userId
    );

    if (likedPosts.rows.length === 0) {
      // If the user has not liked any posts, return the most popular posts
      const popularPosts = await db.run(
        "SELECT post_id, COUNT(*) as like_count FROM post_likes GROUP BY post_id ORDER BY like_count DESC LIMIT 10"
      );
      return popularPosts;
    }

    // Get other users who have liked the same posts
    const similarUsers = await db.run(
      `SELECT user_id, COUNT(*) as similarity FROM post_likes WHERE post_id IN (${likedPosts.rows.map(r => r[0]).join(",")}) AND user_id != ? GROUP BY user_id ORDER BY similarity DESC LIMIT 10`,
      userId
    );

    if (similarUsers.rows.length === 0) {
      // If no similar users are found, return the most popular posts
      const popularPosts = await db.run(
        "SELECT post_id, COUNT(*) as like_count FROM post_likes GROUP BY post_id ORDER BY like_count DESC LIMIT 10"
      );
      return popularPosts;
    }

    // Get the posts that similar users have liked
    const recommendedPosts = await db.run(
      `SELECT post_id, COUNT(*) as like_count FROM post_likes WHERE user_id IN (${similarUsers.rows.map(r => r[0]).join(",")}) AND post_id NOT IN (${likedPosts.rows.map(r => r[0]).join(",")}) GROUP BY post_id ORDER BY like_count DESC LIMIT 10`
    );

    return recommendedPosts;
  }
}

