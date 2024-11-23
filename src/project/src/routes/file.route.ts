import { Router } from "express";
import type { Request, Response } from "express";
import fileUploader, {
  replaceSafetyPath,
} from "../services/File/file-uploader.ts";
import path from "path";
import fs from "fs";
import FileService from "../services/File/file.service.ts";

const router: Router = Router();

router.post("/upload", async (req: Request, res: Response) => {
  fileUploader(req, res, async (err) => {
    const file = req.file;

    if (err) {
      return res
        .status(400)
        .json({ result: false, message: err?.message || "Failed file upload" });
    }
    if (!file) {
      return res
        .status(400)
        .json({ result: false, message: "No file uploaded" });
    }
    const destPath = path.join("storage");

    // destPath 생성
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }

    const fileService = new FileService();

    const savedFileInfo = await fileService.upload(
      file.path,
      file.filename,
      file.originalname,
      file.size,
    );

    res.status(200).json({
      result: true,
      savedFileInfo,
    });
  });
});

router.get("/:id", async (req: Request, res: Response) => {
  const fileId = req.params.id;
  const fileService = new FileService();

  try {
    const fileInfo = await fileService.getById(fileId);
    if (!fileInfo) {
      console.log(`file info not found id=${fileId}`);
      return res
        .status(404)
        .json({ result: false, message: "Failed File found" });
    }

    const filePath = replaceSafetyPath(path.resolve(fileInfo.storedPath));
    if (!fs.existsSync(filePath)) {
      console.log(`failed access file path id=${fileId}, path=${filePath}`);
      return res
        .status(404)
        .json({ result: false, message: "Failed to send file" });
    }

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ result: false, message: "Failed to send file" });
      }
    });
  } catch (error: any) {
    res.status(500).json({ result: false, message: error.message });
  }
});

export default router;
