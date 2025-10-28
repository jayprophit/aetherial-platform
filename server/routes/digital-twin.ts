import { Router } from "express";
import { DigitalTwinService } from "../digital-twin";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const digitalTwinService = new DigitalTwinService();

// Create a new digital twin
router.post("/", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;
  const { name, description } = req.body;

  try {
    const result = await digitalTwinService.createTwin(userId, name, description);
    res.json({ success: true, twinId: result.lastID });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Get all digital twins for a user
router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;

  try {
    const twins = await digitalTwinService.getTwins(userId);
    res.json({ success: true, twins });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Get a specific digital twin
router.get("/:twinId", async (req, res) => {
  const twinId = parseInt(req.params.twinId, 10);

  try {
    const twin = await digitalTwinService.getTwin(twinId);
    res.json({ success: true, twin });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Update the data of a digital twin
router.post("/:twinId/data", authenticateToken, async (req, res) => {
  const twinId = parseInt(req.params.twinId, 10);
  const { data } = req.body;

  try {
    await digitalTwinService.updateTwinData(twinId, data);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

