import { Schema, model } from "mongoose";

interface FileInfoSchemaInterface {
  storedPath: string;
  fileName: string;
  originalName: string;
  size: number;
}

const FileInfoSchema = new Schema<FileInfoSchemaInterface>(
  {
    storedPath: { type: String, required: true },
    fileName: { type: String, required: true },
    originalName: { type: String, required: true },
    size: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

const FileInfoModel = model<FileInfoSchemaInterface>(
  "FileInfo",
  FileInfoSchema,
);

export default FileInfoModel;
