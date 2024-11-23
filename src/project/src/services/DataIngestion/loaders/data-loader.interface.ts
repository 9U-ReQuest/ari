import { Document } from "@langchain/core/documents";

interface DataLoader {
  load(source: string, config?: TLoaderConfig): Promise<Document[]>;
}

export type TLoaderConfig = {
  notionOption?: {
    clientOption: {
      notionIntegrationToken: string;
    };
    id: string;
    type: "page" | "database";
    propertiesAsHeader?: boolean;
  };
};

export default DataLoader;
