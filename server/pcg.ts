import { createNoise2D } from "simplex-noise";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export function generateLandscape(width: number, height: number) {
  const noise2D = createNoise2D();
  const landscape = [];

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push(noise2D(x / 50, y / 50));
    }
    landscape.push(row);
  }

  return landscape;
}

export async function generateQuest(prompt: string): Promise<any> {
  const response = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt: `Generate a fantasy quest based on the following prompt: ${prompt}`,
    max_tokens: 200,
    temperature: 0.8,
  });

  return response.choices[0].text.trim();
}

