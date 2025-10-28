import { Router } from "express";
import { CrowdsourcingAndCitizenScienceService } from "../crowdsourcing-and-citizen-science";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const crowdsourcingAndCitizenScienceService = new CrowdsourcingAndCitizenScienceService();

// Create a new project
router.post("/projects", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;
  const { name, description } = req.body;

  try {
    const result = await crowdsourcingAndCitizenScienceService.createProject(userId, name, description);
    res.json({ success: true, projectId: result.lastID });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Get all projects
router.get("/projects", async (req, res) => {
  try {
    const projects = await crowdsourcingAndCitizenScienceService.getProjects();
    res.json({ success: true, projects });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Get a specific project
router.get("/projects/:projectId", async (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);

  try {
    const project = await crowdsourcingAndCitizenScienceService.getProject(projectId);
    res.json({ success: true, project });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Submit data to a project
router.post("/projects/:projectId/data", authenticateToken, async (req, res) => {
  const userId = req.user!.userId;
  const projectId = parseInt(req.params.projectId, 10);
  const { data } = req.body;

  try {
    await crowdsourcingAndCitizenScienceService.submitData(userId, projectId, data);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Get all data for a project
router.get("/projects/:projectId/data", async (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);

  try {
    const data = await crowdsourcingAndCitizenScienceService.getProjectData(projectId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

