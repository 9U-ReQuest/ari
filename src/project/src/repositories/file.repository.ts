import { TFileInfo } from "@repo/types/src/File";
import FileInfoModel from "../models/file.schema.ts";

class FileRepository {
  async create(
    storedPath: string,
    fileName: string,
    originalName: string,
    size: number,
  ): Promise<TFileInfo> {
    const fileInfo = new FileInfoModel({
      storedPath: storedPath,
      fileName: fileName,
      originalName: originalName,
      size: size,
    });

    const savedFileInfo = await fileInfo.save();

    return {
      id: savedFileInfo._id.toString(),
      storedPath: savedFileInfo.storedPath,
      fileName: savedFileInfo.fileName,
      originalName: savedFileInfo.originalName,
      size: savedFileInfo.size,
    };
  }

  async findById(id: string): Promise<TFileInfo | null> {
    const fileInfo = await FileInfoModel.findById(id);
    if (!fileInfo) {
      return null;
    }

    return {
      id: fileInfo._id.toString(),
      storedPath: fileInfo.storedPath,
      fileName: fileInfo.fileName,
      originalName: fileInfo.originalName,
      size: fileInfo.size,
    };
  }

  async findByStoredPath(path: string): Promise<TFileInfo | null> {
    const fileInfo = await FileInfoModel.findOne({
      storedPath: path,
    });
    if (!fileInfo) {
      return null;
    }

    return {
      id: fileInfo._id.toString(),
      storedPath: fileInfo.storedPath,
      fileName: fileInfo.fileName,
      originalName: fileInfo.originalName,
      size: fileInfo.size,
    };
  }
}

export default FileRepository;
