import { Ed25519Provider } from "key-did-provider-ed25519";
import { DID } from "dids";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays";
import { JwtCredentialPayload, createVerifiableCredential, createVerifiablePresentation, verifyCredential, verifyPresentation } from "did-jwt-vc";
import { v4 as uuidv4 } from "uuid";

async function createDid() {
  const seed = fromString(uuidv4(), "utf8");
  const provider = new Ed25519Provider(seed);
  const did = new DID({ provider, resolver: getResolver() });
  await did.authenticate();
  return did;
}

export async function createAndRegisterDid() {
  const did = await createDid();
  // In a real application, you would store the DID and its private key securely.
  // For this example, we are returning it.
  return {
    did: did.id,
    // This is for demonstration purposes only. Do not expose private keys in a real application.
    privateKey: (did.provider as any).key.privateKey,
  };
}

export async function createVc(did: DID, subject: string, data: any) {
  const vcPayload: JwtCredentialPayload = {
    sub: subject,
    nbf: Math.floor(Date.now() / 1000),
    vc: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiableCredential"],
      credentialSubject: data,
    },
  };
  const vc = await createVerifiableCredential(vcPayload, did);
  return vc;
}

export async function createVp(did: DID, vc: string[]) {
  const vp = await createVerifiablePresentation({ verifiableCredential: vc }, did);
  return vp;
}

export async function verifyVc(vc: string) {
  const verifiedVc = await verifyCredential(vc, getResolver());
  return verifiedVc;
}

export async function verifyVp(vp: string) {
  const verifiedVp = await verifyPresentation(vp, getResolver());
  return verifiedVp;
}

