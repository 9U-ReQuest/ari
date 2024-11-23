import DataLoader, { TLoaderConfig } from "./data-loader.interface.ts";
import { Document } from "@langchain/core/documents";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";

export class LocalDocxLoader implements DataLoader {
  async load(source: string, config?: TLoaderConfig): Promise<Document[]> {
    const loader = new DocxLoader(source);
    return await loader.load();
  }
}
