import DataLoader, { TLoaderConfig } from "./data-loader.interface.ts";
import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export class LocalPdfLoader implements DataLoader {
  async load(source: string, config?: TLoaderConfig): Promise<Document[]> {
    const loader = new PDFLoader(source);
    return await loader.load();
  }
}
