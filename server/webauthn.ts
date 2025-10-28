import { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server';
import { isoUint8Array } from '@simplewebauthn/server/helpers';
import { getDb } from './db';
import { authenticators, users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const rpID = 'localhost';
const rpName = 'AETHERIAL';
const origin = `http://${rpID}:3000`;

export async function getRegistrationOptions(userId: number, username: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const userAuthenticators = await db.select().from(authenticators).where(eq(authenticators.userId, userId));

  const options = await generateRegistrationOptions({
    rpID,
    rpName,
    userID: isoUint8Array.fromASCII(userId.toString()),
    userName: username,
    attestationType: 'none',
    excludeCredentials: userAuthenticators.map(auth => ({
      id: isoUint8Array.fromHex(auth.credentialID),
      type: 'public-key',
      transports: auth.transports ? auth.transports as any : undefined,
    })),
  });

  await db.update(users).set({ currentChallenge: options.challenge }).where(eq(users.id, userId));

  return options;
}

export async function verifyRegistration(userId: number, response: any) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const userResult = await db.select().from(users).where(eq(users.id, userId));
  const user = userResult[0];

  if (!user || !user.currentChallenge) throw new Error('User not found or challenge missing');

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge: user.currentChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });

  if (!verification.verified || !verification.registrationInfo) throw new Error('Verification failed');

  const { credentialPublicKey, credentialID, counter } = verification.registrationInfo;

  await db.insert(authenticators).values({
    userId,
    credentialID: isoUint8Array.toHex(credentialID),
    credentialPublicKey: isoUint8Array.toHex(credentialPublicKey),
    counter,
    transports: response.response.transports,
  });

  await db.update(users).set({ currentChallenge: null }).where(eq(users.id, userId));
}

export async function getAuthenticationOptions(username: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const userResult = await db.select().from(users).where(eq(users.username, username));
  const user = userResult[0];

  if (!user) throw new Error('User not found');

  const userAuthenticators = await db.select().from(authenticators).where(eq(authenticators.userId, user.id));

  const options = await generateAuthenticationOptions({
    allowCredentials: userAuthenticators.map(auth => ({
      id: isoUint8Array.fromHex(auth.credentialID),
      type: 'public-key',
      transports: auth.transports ? auth.transports as any : undefined,
    })),
  });

  await db.update(users).set({ currentChallenge: options.challenge }).where(eq(users.id, user.id));

  return options;
}

export async function verifyAuthentication(username: string, response: any) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const userResult = await db.select().from(users).where(eq(users.username, username));
  const user = userResult[0];

  if (!user || !user.currentChallenge) throw new Error('User not found or challenge missing');

  const authenticatorResult = await db.select().from(authenticators).where(eq(authenticators.credentialID, response.id));
  const authenticator = authenticatorResult[0];

  if (!authenticator) throw new Error('Authenticator not found');

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge: user.currentChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    authenticator: {
      credentialID: isoUint8Array.fromHex(authenticator.credentialID),
      credentialPublicKey: isoUint8Array.fromHex(authenticator.credentialPublicKey),
      counter: authenticator.counter,
    },
  });

  if (!verification.verified) throw new Error('Verification failed');

  await db.update(authenticators).set({ counter: verification.authenticationInfo.newCounter }).where(eq(authenticators.id, authenticator.id));
  await db.update(users).set({ currentChallenge: null }).where(eq(users.id, user.id));

  return { userId: user.id };
}

