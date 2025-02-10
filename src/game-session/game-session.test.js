import "dotenv/config";
import express from "express";
import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import configs from "../configs/index.js";
import route from "./game-session-route.js";
import service from "./game-session-service.js";
import sessionCharacterService from "../game-session-character/session-character.service.js";
import ErrorHandler from "../errors/error-handler.js";

const app = express();

app.use(cors(configs.cors));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());

app.use("/api/v1/game-sessions", route);

app.use((err, req, res, _) => {
  if (!ErrorHandler.isTrustedError(err)) {
    console.log(err);
    process.exit(1);
  } else {
    ErrorHandler.handleError(err, res);
  }
});

let gameSession;
let gameSessionCookie = null;

beforeAll(async () => {
  const [_, data] = await service.createGameSession("dragon-island");
  gameSession = data;
  gameSessionCookie = service.generateToken(gameSession.id, "1d");
});

describe("Game session route", () => {
  it("(http: get, route: /current-game) responds with json", async () => {
    const response = await request(app)
      .get("/api/v1/game-sessions/current-game")
      .set("Cookie", [`game_session=${gameSessionCookie}`])
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toMatch(/json/);
  });

  it("(http: post, route: /:sessionId/answer) responds with json and status 200 if the client sends the correct character position", async () => {
    const [_, characters] =
      await sessionCharacterService.getSessionCharactersByGameSession(
        gameSession.id
      );

    const raftMan = characters.reduce(
      (prev, chara) => (chara.name === "raft-man" ? chara : prev),
      {}
    );

    const characterDTO = {
      characterId: raftMan.id,
      currentX: 0.048555859925675474,
      currentY: 0.4243003408280244,
      height: 2354.53125,
      width: 1668.1817626953125,
    };

    const response = await request(app)
      .post(`/api/v1/game-sessions/${gameSession.id}/answer`)
      .send(characterDTO)
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toMatch(/json/);
  });

  it("(http: post, route: /:sessionId/answer) responds with json and status 422 if there's an missing body field", async () => {
    const response = await request(app)
      .post(`/api/v1/game-sessions/${gameSession.id}/answer`)
      .set("Accept", "application/json");

    expect(response.status).toEqual(422);
    expect(response.headers["content-type"]).toMatch(/json/);
  });

  it("(http: post, route: /:sessionId/answer) responds with status 204 if the game got deleted", async () => {
    const response = await request(app)
      .del(`/api/v1/game-sessions/${gameSession.id}`)
      .set("Accept", "application/json");

    expect(response.status).toEqual(204);
  });
});
