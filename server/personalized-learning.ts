import { getDb } from "./db";

export class PersonalizedLearningService {
  async getStudentModel(userId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const studentModel = await db.get(
      "SELECT * FROM student_models WHERE user_id = ?",
      userId
    );
    return studentModel;
  }

  async updateStudentModel(userId: number, data: any) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db.run(
      "UPDATE student_models SET data = ? WHERE user_id = ?",
      JSON.stringify(data),
      userId
    );
    return result;
  }

  async getLearningRecommendations(userId: number) {
    // This is a placeholder for the actual learning recommendation logic.
    // In a real-world application, this would involve using the student model to select the most appropriate learning content and activities for the user.
    console.log(`Getting learning recommendations for user ${userId}`);
    return [{ title: "Introduction to AETHERIAL", url: "/learn/intro" }];
  }
}

