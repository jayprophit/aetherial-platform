import { Router } from "express";
import { FederatedLearningService } from "../federated-learning";

const router = Router();
const flService = new FederatedLearningService();

// Get the current model
router.get("/model", async (req, res) => {
  try {
    const model = await flService.getModel();
    res.json({ success: true, model });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Update the model with new weights
router.post("/model", async (req, res) => {
  const { weights } = req.body;

  try {
    await flService.updateModel(weights);
    res.json({ success: true, message: "Model updated successfully" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

