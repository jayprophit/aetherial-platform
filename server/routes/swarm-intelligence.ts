import { Router } from "express";
import { SwarmIntelligenceService } from "../swarm-intelligence";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const swarmIntelligenceService = new SwarmIntelligenceService();

// Create a new swarm
router.post("/", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;
  const { name, description, agentCount } = req.body;

  try {
    const result = await swarmIntelligenceService.createSwarm(userId, name, description, agentCount);
    res.json({ success: true, swarmId: result.lastID });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Get all swarms for a user
router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;

  try {
    const swarms = await swarmIntelligenceService.getSwarms(userId);
    res.json({ success: true, swarms });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Get a specific swarm
router.get("/:swarmId", async (req, res) => {
  const swarmId = parseInt(req.params.swarmId, 10);

  try {
    const swarm = await swarmIntelligenceService.getSwarm(swarmId);
    res.json({ success: true, swarm });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Update a swarm
router.post("/:swarmId", authenticateToken, async (req, res) => {
  const swarmId = parseInt(req.params.swarmId, 10);
  const { agentCount } = req.body;

  try {
    await swarmIntelligenceService.updateSwarm(swarmId, agentCount);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

