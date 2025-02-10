import "dotenv/config";
import express from "express";
import request from "supertest";
import { describe, it, expect } from "vitest";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import configs from "../configs/index.js";
import route from "./game-route.js";
import gameSessionService from "../game-session/game-session-service.js";
import ErrorHandler from "../errors/error-handler.js";

const app = express();

app.use(cors(configs.cors));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());

app.use("/api/v1/games", route);

app.use((err, req, res, _) => {
  if (!ErrorHandler.isTrustedError(err)) {
    process.exit(1);
  } else {
    ErrorHandler.handleError(err, res);
  }
});

describe("Game route", async () => {
  it("responds with json", async () => {
    const gamesResponse = await request(app)
      .get("/api/v1/games")
      .set("Accept", "application/json");

    const gameResponse = await request(app)
      .get("/api/v1/games/dragon-island")
      .set("Accept", "application/json");

    expect(gamesResponse.status).toEqual(200);
    expect(gameResponse.status).toEqual(200);
    expect(gamesResponse.headers["content-type"]).toMatch(/json/);
    expect(gameResponse.headers["content-type"]).toMatch(/json/);
  });

  it("(http: get, route: /games) sents a array of games", async () => {
    const response = await request(app)
      .get("/api/v1/games")
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].id).toEqual(1);
    expect(response.body[0].title).toMatch(/dragon-island/);
  });

  it("(http: get, route: /game/:title) sents a game object", async () => {
    const response = await request(app)
      .get("/api/v1/games/dragon-island")
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body)).not.toBeTruthy();
    expect(response.body.id).toEqual(1);
    expect(response.body.title).toMatch(/dragon-island/);
  });

  it("(http: get, route: /games/:title) sends a error message and status 404 if there's no game found", async () => {
    const response = await request(app)
      .get("/api/v1/games/foo-bar")
      .set("Accept", "application/json");

    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({
      code: 404,
      message: "Game does not exist",
    });
  });

  it("(http: post, route: /games/:title/game-sessions) sends a json and a cookie", async () => {
    const response = await request(app)
      .post("/api/v1/games/dragon-island/game-sessions")
      .set("Accept", "application/json");

    const cookies = response.headers["set-cookie"];

    expect(response.status).toEqual(201);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(cookies.length).toBeGreaterThan(0);

    await gameSessionService.deleteGameSessionById(response.body.id);
  });
});
