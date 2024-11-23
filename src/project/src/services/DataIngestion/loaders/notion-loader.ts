import DataLoader, { TLoaderConfig } from "./data-loader.interface.ts";
import { Document } from "@langchain/core/documents";
import { NotionLoader } from "@langchain/community/document_loaders/fs/notion";
import { NotionAPILoader } from "@langchain/community/document_loaders/web/notionapi";
import HttpError from "../../../global/error/http.error.ts";

export class LocalNotionLoader implements DataLoader {
  async load(source: string, config?: TLoaderConfig): Promise<Document[]> {
    const loader = new NotionLoader(source);
    return await loader.load();
  }
}

export class WebNotionLoader implements DataLoader {
  async load(source: string, config?: TLoaderConfig): Promise<Document[]> {
    const option = config?.notionOption;
    if (!option) {
      throw new HttpError(400, "Invalid Notion API Option");
    }
    const loader = new NotionAPILoader({
      clientOptions: option?.clientOption.notionIntegrationToken,
      id: option?.id,
      type: option?.type,
      propertiesAsHeader: option?.propertiesAsHeader,
    });
    return await loader.load();
  }
}
