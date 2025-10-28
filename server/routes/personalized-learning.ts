import { Router } from "express";
import { PersonalizedLearningService } from "../personalized-learning";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const personalizedLearningService = new PersonalizedLearningService();

// Get the student model for a user
router.get("/student-model", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;

  try {
    const studentModel = await personalizedLearningService.getStudentModel(userId);
    res.json({ success: true, studentModel });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Update the student model for a user
router.post("/student-model", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;
  const { data } = req.body;

  try {
    await personalizedLearningService.updateStudentModel(userId, data);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Get learning recommendations for a user
router.get("/recommendations", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;

  try {
    const recommendations = await personalizedLearningService.getLearningRecommendations(userId);
    res.json({ success: true, recommendations });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

