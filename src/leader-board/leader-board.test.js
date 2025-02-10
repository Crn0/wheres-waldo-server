import "dotenv/config";
import express from "express";
import request from "supertest";
import { describe, it, expect } from "vitest";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import configs from "../configs/index.js";
import route from "./leader-board-route.js";
import service from "./leader-board-service.js";
import ErrorHandler from "../errors/error-handler.js";

const app = express();

app.use(cors(configs.cors));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());

app.use("/api/v1/leader-boards", route);

app.use((err, req, res, _) => {
  if (!ErrorHandler.isTrustedError(err)) {
    process.exit(1);
  } else {
    ErrorHandler.handleError(err, res);
  }
});

describe("Leader board route", () => {
  it("responds with json", async () => {
    const leaderBoardList = await request(app)
      .get("/api/v1/leader-boards")
      .set("Accept", "application/json");

    const leaderBoard = await request(app)
      .get("/api/v1/leader-boards/1")
      .set("Accept", "application/json");

    expect(leaderBoardList.status).toEqual(200);
    expect(leaderBoard.status).toEqual(200);
    expect(leaderBoardList.headers["content-type"]).toMatch(/json/);
    expect(leaderBoard.headers["content-type"]).toMatch(/json/);
  });
});
