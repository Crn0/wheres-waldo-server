import "dotenv/config";
import { describe, it, expect, afterAll, beforeAll } from "vitest";
import service from "./game-session-service.js";
import sessionCharacterService from "../game-session-character/session-character.service.js";

let gameSession;

beforeAll(async () => {
  const [_, data] = await service.createGameSession("dragon-island");
  gameSession = data;
});

afterAll(async () => {
  const [_, __] = await service.deleteGameSessionById(gameSession.id);
});

describe("Game session service", () => {
  it("coordinates are null if the characters are not found", async () => {
    const [_, currentGameSession] = await service.getGameSessionById(
      gameSession.id
    );

    currentGameSession.sessionCharacters.forEach((chara) => {
      if (chara.found === false) {
        expect(chara.coordinates).toBeNull();
      }
    });
  });

  it("coordinates are not null if the characters are found", async () => {
    const [_, currentGameSession] = await service.getGameSessionById(
      gameSession.id
    );

    const [e, characters] =
      await sessionCharacterService.getSessionCharactersByGameSession(
        gameSession.id
      );

    const raftMan = characters.reduce(
      (prev, chara) => (chara.name == "raft-man" ? chara : prev),
      {}
    );

    const body = {
      characterId: raftMan.id,
      currentX: 0.048555859925675474,
      currentY: 0.4243003408280244,
      height: 2354.53125,
      width: 1668.1817626953125,
    };

    await service.checkGameSessionAnswer(gameSession.id, body);

    currentGameSession.sessionCharacters.forEach((chara) => {
      if (chara.found) {
        expect(chara.coordinates).not.toBeNull();
      }
    });
  });
});
