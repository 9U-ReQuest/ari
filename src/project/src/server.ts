import express, { type Express, json, urlencoded } from "express";
import session from "express-session";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import ConversationRoute from "./routes/conversation.route.ts";
import ThreadRoute from "./routes/thread.route.ts";
import ErrorHandler from "./global/error/error.handler.ts";
import UserRoute from "./routes/user.route.ts";
import FileRoute from "./routes/file.route.ts";
import EmbedingRoute from "./routes/embedding.route.ts";

dotenv.config({ debug: true });

export const createServer = (): Express => {
  const app = express();
  app.use(morgan("dev"));
  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(cors());
  app.use(sessionInstance);

  app.get("/echo/:name", (req, res) => {
    return res.json({ message: `hello ${req.params.name}` });
  });
  app.get("/health", (_, res) => {
    return res.json({ ok: true });
  });

  addRoutes(app);

  app.use(ErrorHandler);
  return app;
};

const addRoutes = (app: Express): void => {
  app.use("/users", UserRoute);
  app.use("/conversation", ConversationRoute);
  app.use("/threads", ThreadRoute);
  app.use("/file", FileRoute);
  app.use("/embedding", EmbedingRoute);
};

const sessionInstance = session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: { path: "/", maxAge: 1000 * 60 * 60 * 24 },
});
