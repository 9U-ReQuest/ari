import * as crypto from "node:crypto";
import type { Request, Response } from "express";
import { Router } from "express";
import type { MessageInterface } from "@repo/types/src/Chat";
import { LOGGER } from "@repo/logger";
import Lipsum from "../resources/sample-response.json";
import RAGService from "../services/rag.service.ts";

const router: Router = Router();

// 기존 스레드가 있을 경우

type Content = {
  type: "text" | "file";
  parts: string[];
};

const chunks = Lipsum["Lipsum-KO"][3].split(" ");

router.post("/:thread", async (req: Request, res: Response) => {
  const { thread } = req.params;
  const { query, source }: { query: string; source: string } = req.body;

  LOGGER(`Thread: ${thread}, Query: ${query}, Source: ${source}`);
  setEventStreamHeaders(res);

  const ragService = new RAGService();

  try {
    // AsyncGenerator를 사용하여 스트리밍
    if (query.includes("급여") && query.includes("얼마")) {
      let result = "";

      // 100ms 대기를 위한 함수
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      // async 함수로 만들어 await 사용
      await delay(1000);
      const processChunks = async () => {
        for (const chunk of chunks) {
          result += chunk + " ";
          LOGGER(result);
          res.write(
            `data: ${JSON.stringify({ type: "chunk", content: result })}\n\n`,
          );

          // 100ms 대기
          await delay(100);
        }
        res.write(`data: [DONE]\n\n`);
        res.end();
      };

      // 비동기 처리 호출
      processChunks();
    } else if (query.includes("월급") && query.includes("얼마")) {
      let result = "";

      // 100ms 대기를 위한 함수
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      // async 함수로 만들어 await 사용
      const processChunks = async () => {
        for (const chunk of chunks) {
          result += chunk + " ";
          res.write(
            `data: ${JSON.stringify({ type: "chunk", content: result })}\n\n`,
          );

          // 100ms 대기
          await delay(100);
        }
        res.write(`data: [DONE]\n\n`);
        res.end();
      };

      // 비동기 처리 호출
      processChunks();
    }

    let result = "";
    for await (const chunk of ragService.askQuery({ query, source })) {
      result += chunk;
      res.write(
        `data: ${JSON.stringify({ type: "chunk", content: result })}\n\n`,
      );
      // LOGGER(`Chunk: ${chunk}`);
    }

    res.write(`data: [DONE]\n\n`);
  } catch (error) {
    LOGGER(`Error in RAGService: ${error}`);
    res.write(`data: [DONE]\n\n`);
  } finally {
    res.end();
  }

  req.on("close", () => {
    LOGGER("Client disconnected");
  });
});

router.get("/question", async (req: Request, res: Response) => {
  const endMessage = createMessage(
    { role: "assistance", name: "Libernex" },
    { contentType: "text", body: "DONE" },
  );
  const connectMessage = createMessage(
    { role: "system", name: "Libernex" },
    { contentType: "text", body: crypto.randomUUID() },
  );

  try {
    setEventStreamHeaders(res);
    setTimeout(() => {}, 5000);

    res.write("event: connect\n");
    res.write(`data: ${JSON.stringify(connectMessage)} \n\n`);

    let result = "";
    for (const chunk of chunks) {
      result += `${chunk} `;

      const message = createMessage(
        { role: "assistance", name: "Libernex" },
        { contentType: "text", body: `${chunk} ` },
      );

      res.write(`event: message\n`);
      res.write(`data: ${JSON.stringify(message)} \n\n`);
      new Promise((resolve) => setTimeout(resolve, 100));
    }

    res.write(`event: message\n`);
    res.write(`data: ${JSON.stringify(endMessage)} \n\n`);
    res.end();
    LOGGER(result);
  } catch (error) {
    LOGGER("SSE 에러:", error);
    res.write(`event: message\n`);
    res.write(`data: ${JSON.stringify(endMessage)} \n\n`);
    res.end();
  }
});

const createMessage = (
  author: { role: "assistance" | "system" | "user"; name: string },
  content: { contentType: "text" | "file" | "link"; body: string },
): MessageInterface => {
  return {
    id: crypto.randomUUID(),
    author,
    content,
    sentAt: new Date().toLocaleString(),
  };
};

const setEventStreamHeaders = (res: Response): void => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
};

export default router;
