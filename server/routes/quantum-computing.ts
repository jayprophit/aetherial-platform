import { Router } from "express";
import { QuantumComputingService } from "../quantum-computing";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const quantumComputingService = new QuantumComputingService();

// Create a new quantum algorithm
router.post("/", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;
  const { name, description, code } = req.body;

  try {
    const result = await quantumComputingService.createAlgorithm(userId, name, description, code);
    res.json({ success: true, algorithmId: result.lastID });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Get all quantum algorithms for a user
router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;

  try {
    const algorithms = await quantumComputingService.getAlgorithms(userId);
    res.json({ success: true, algorithms });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Get a specific quantum algorithm
router.get("/:algorithmId", async (req, res) => {
  const algorithmId = parseInt(req.params.algorithmId, 10);

  try {
    const algorithm = await quantumComputingService.getAlgorithm(algorithmId);
    res.json({ success: true, algorithm });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Run a quantum algorithm
router.post("/:algorithmId/run", authenticateToken, async (req, res) => {
  const algorithmId = parseInt(req.params.algorithmId, 10);

  try {
    const result = await quantumComputingService.runAlgorithm(algorithmId);
    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

