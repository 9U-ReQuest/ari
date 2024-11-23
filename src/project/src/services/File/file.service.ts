import FileRepository from "../../repositories/file.repository.ts";
import { TFileInfo } from "@repo/types/src/File";
import HttpError from "../../global/error/http.error.ts";

class FileService {
  constructor() {}

  async upload(
    storedPath: string,
    fileName: string,
    originalName: string,
    size: number,
  ): Promise<TFileInfo> {
    const fileRepository = new FileRepository();
    return fileRepository.create(storedPath, fileName, originalName, size);
  }

  async getById(id: string): Promise<TFileInfo> {
    const fileRepository = new FileRepository();
    const fileInfo = await fileRepository.findById(id);
    if (!fileInfo) {
      throw new HttpError(404, "Not Found");
    }
    return fileInfo;
  }

  async getByStoredPath(savedName: string): Promise<TFileInfo> {
    const fileRepository = new FileRepository();
    const fileInfo = await fileRepository.findByStoredPath(savedName);
    if (!fileInfo) {
      throw new HttpError(404, "Not Found");
    }
    return fileInfo;
  }
}

export default FileService;
