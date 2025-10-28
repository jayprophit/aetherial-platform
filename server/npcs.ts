import { getDb } from "./db";
import { npcs } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createNPC(name: string, description: string, personality: any, backstory: string) {
  const db = await getDb();
  if (!db) return;

  await db.insert(npcs).values({
    name,
    description,
    personality,
    backstory,
  });
}

export async function getNPCResponse(npcId: number, playerName: string, playerMessage: string): Promise<string> {
  const db = await getDb();
  if (!db) return "The world is quiet right now.";

  const npcResult = await db.select().from(npcs).where(eq(npcs.id, npcId));
  const npc = npcResult[0];

  if (!npc) {
    return "You are talking to a ghost.";
  }

  const prompt = `You are ${npc.name}, ${npc.description}. Your personality is ${JSON.stringify(npc.personality)}. Your backstory is ${npc.backstory}. You are talking to ${playerName}.

${playerName}: ${playerMessage}
${npc.name}:`;

  const response = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt,
    max_tokens: 150,
    temperature: 0.9,
  });

  return response.choices[0].text.trim();
}

