import { Router } from "express";
import { createAndRegisterDid, createVc, createVp, verifyVc, verifyVp } from "../did";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";

const router = Router();

// Create a new DID
router.post("/", async (req, res) => {
  try {
    const didData = await createAndRegisterDid();
    res.json({ success: true, ...didData });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Create a new Verifiable Credential
router.post("/vc", async (req, res) => {
  const { did, privateKey, subject, data } = req.body;

  try {
    const provider = new Ed25519Provider(new Uint8Array(privateKey));
    const didInstance = new DID({ provider, resolver: getResolver() });
    await didInstance.authenticate();

    const vc = await createVc(didInstance, subject, data);
    res.json({ success: true, vc });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Create a new Verifiable Presentation
router.post("/vp", async (req, res) => {
  const { did, privateKey, vc } = req.body;

  try {
    const provider = new Ed25519Provider(new Uint8Array(privateKey));
    const didInstance = new DID({ provider, resolver: getResolver() });
    await didInstance.authenticate();

    const vp = await createVp(didInstance, vc);
    res.json({ success: true, vp });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Verify a Verifiable Credential
router.post("/vc/verify", async (req, res) => {
  const { vc } = req.body;

  try {
    const verifiedVc = await verifyVc(vc);
    res.json({ success: true, verifiedVc });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Verify a Verifiable Presentation
router.post("/vp/verify", async (req, res) => {
  const { vp } = req.body;

  try {
    const verifiedVp = await verifyVp(vp);
    res.json({ success: true, verifiedVp });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

