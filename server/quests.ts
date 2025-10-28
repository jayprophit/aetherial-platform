import { getDb } from "./db";
import { quests, quest_objectives, user_quests, users, posts, friendships } from "../drizzle/schema";
import { eq, and, or, sql } from "drizzle-orm";
import { awardPoints } from "./gamification";
import { createNotification } from "./notifications";

export async function checkQuestProgress(userId: number, objectiveType: string) {
  const db = await getDb();
  if (!db) return;

  const activeQuests = await db.select().from(user_quests)
    .innerJoin(quest_objectives, eq(user_quests.questId, quest_objectives.questId))
    .where(and(eq(user_quests.userId, userId), eq(user_quests.status, "in_progress"), eq(quest_objectives.objectiveType, objectiveType)));

  for (const { user_quests: userQuest, quest_objectives: objective } of activeQuests) {
    let currentProgress = 0;

    switch (objective.objectiveType) {
      case "post_x_times":
        const postCount = await db.select({ count: sql<number>`count(*)` }).from(posts).where(eq(posts.userId, userId));
        currentProgress = Number(postCount[0].count);
        break;
      case "add_x_friends":
        const friendCount = await db.select({ count: sql<number>`count(*)` }).from(friendships).where(and(or(eq(friendships.userId, userId), eq(friendships.friendId, userId)), eq(friendships.status, "accepted")));
        currentProgress = Number(friendCount[0].count);
        break;
    }

    await db.update(user_quests).set({ progress: currentProgress }).where(eq(user_quests.id, userQuest.id));

    if (currentProgress >= objective.targetCount) {
      await completeQuest(userId, userQuest.questId);
    }
  }
}

async function completeQuest(userId: number, questId: number) {
  const db = await getDb();
  if (!db) return;

  await db.update(user_quests).set({ status: "completed", completedAt: new Date() }).where(and(eq(user_quests.userId, userId), eq(user_quests.questId, questId)));

  const questResult = await db.select().from(quests).where(eq(quests.id, questId));
  const quest = questResult[0];

  if (quest) {
    if (quest.rewardPoints) {
      awardPoints(userId, "COMPLETE_QUEST"); // You might want a more specific action here
    }
    if (quest.rewardBadgeId) {
      // This logic needs to be adapted to your badge granting system
    }
    createNotification(userId, "quest_completed", `You have completed the quest: ${quest.name}!`, "/quests");
  }
}

