import { Router } from "express";
import type { Request, Response } from "express";
import DataIngestionService from "../services/DataIngestion/data-ingestion.service.ts";
import { LoaderType } from "../services/DataIngestion/loaders/loader-factory.ts";
import { SplitterType } from "../services/DataIngestion/splitters/splitter-factory.ts";
import HttpError from "../global/error/http.error.ts";
import FileService from "../services/File/file.service.ts";

const router: Router = Router();

router.post("/:sourceType", async (req: Request, res: Response) => {
  const { sourceType } = req.params;
  const { source } = req.body;

  let loadType: LoaderType;
  if (sourceType === "pdf") {
    loadType = LoaderType.PDF_LOCAL;
  } else {
    loadType = LoaderType.WEB;
  }

  let filePath;
  if (sourceType === "pdf") {
    const fileService = new FileService();
    const fileInfo = await fileService.getById(source);
    filePath = fileInfo.storedPath;
  }

  const dataIngestionService: DataIngestionService = new DataIngestionService();
  const result = await dataIngestionService.ingest({
    loadOption: {
      source: sourceType === "pdf" ? filePath : source,
      type: loadType,
    },
    splitOption: {
      type: SplitterType.RECURSIVE_CHARACTER,
    },
    storeOption: {
      collectionName: "default",
    },
  });

  if (!result) {
    throw new HttpError(400, "Failed Embedding");
  }
  res.status(200).json({ result: true });
});

export default router;
