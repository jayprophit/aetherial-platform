import { getDb } from "./db";
import { games, game_players } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { WebSocketManager } from "./websocket";

const activeGames = new Map<number, any>();

export function initializeGameEngine(wsManager: WebSocketManager) {
  setInterval(() => {
    for (const [gameId, game] of activeGames.entries()) {
      game.update();
      wsManager.broadcastToChannel(`game-${gameId}`, { type: "game_update", state: game.getState() });
    }
  }, 1000 / 60); // 60 FPS
}

export async function createGame(gameType: string, players: number[]) {
  const db = await getDb();
  if (!db) return;

  const result = await db.insert(games).values({
    gameType,
    gameState: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const gameId = Number(result[0].insertId);

  for (const userId of players) {
    await db.insert(game_players).values({
      gameId,
      userId,
    });
  }

  // Start the game
  const game = new (require(`./games/${gameType}`).default)(gameId);
  activeGames.set(gameId, game);
}

export function handlePlayerAction(gameId: number, userId: number, action: any) {
  const game = activeGames.get(gameId);
  if (game) {
    game.handleAction(userId, action);
  }
}

