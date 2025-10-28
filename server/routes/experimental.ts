import { Router } from "express";
import { isFeatureEnabled } from "../features";

const router = Router();

router.get("/new-feature", (req, res) => {
  if (isFeatureEnabled("new-experimental-feature")) {
    res.json({ success: true, message: "You are seeing the new experimental feature!" });
  } else {
    res.status(404).json({ success: false, message: "Feature not found" });
  }
});

export default router;
