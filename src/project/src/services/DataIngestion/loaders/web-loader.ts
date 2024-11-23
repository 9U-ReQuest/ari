import DataLoader, { TLoaderConfig } from "./data-loader.interface.ts";
import { Document } from "@langchain/core/documents";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

export class WebLoader implements DataLoader {
  async load(source: string, config?: TLoaderConfig): Promise<Document[]> {
    const loader = new CheerioWebBaseLoader(source);
    return await loader.load();
  }
}
