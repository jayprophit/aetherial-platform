import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { createNPC, getNPCResponse } from "../npcs";

const router = Router();

// Create a new NPC
router.post("/", authenticateToken, async (req, res) => {
  const { name, description, personality, backstory } = req.body;

  try {
    await createNPC(name, description, personality, backstory);
    res.json({ success: true, message: "NPC created successfully" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Get a response from an NPC
router.post("/:id/respond", authenticateToken, async (req, res) => {
  const npcId = parseInt(req.params.id);
  const { playerName, playerMessage } = req.body;

  try {
    const response = await getNPCResponse(npcId, playerName, playerMessage);
    res.json({ success: true, response });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

