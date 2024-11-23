import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 } from "uuid";
import { RequestHandler } from "express";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dirPath = path.join("storage");

    fs.mkdirSync(dirPath, { recursive: true });

    cb(null, dirPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${path.basename(file.originalname, ext)}${ext}`;
    cb(null, filename);
  },
});

const uploader: RequestHandler = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 },
}).single("file");

export const replaceSafetyPath = (inputPath: string): string => {
  const sep = path.sep;

  if (sep === "\\") {
    return inputPath.replace(/\//g, sep);
  }
  return inputPath.replace(/\\/g, sep);
};

export default uploader;
