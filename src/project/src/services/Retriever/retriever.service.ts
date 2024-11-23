import { Document } from "@langchain/core/documents";
import { MultiQueryRetriever } from "langchain/retrievers/multi_query";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import ApiKeyConfig from "../../global/config/api-key.config.ts";
import HttpError from "../../global/error/http.error.ts";
import LLMFactory, { LLMType } from "../LLM/llm-factory.ts";
import { BaseLanguageModel } from "@langchain/core/language_models/base";

class RetrieverService {
  private readonly embeddings: OpenAIEmbeddings;
  private readonly llm: BaseLanguageModel;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
      apiKey: ApiKeyConfig.OPENAI_API_KEY,
    });
    this.llm = LLMFactory.createLLM(LLMType.OPENAI);
  }

  async retrieveDocuments({
    query,
    vectorDB,
    collectionName,
  }: {
    query: string;
    vectorDB?: Chroma;
    collectionName?: string;
  }): Promise<Document[]> {
    if (!vectorDB) {
      if (!collectionName) {
        throw new HttpError(400, "Invalid collection name");
      }
      vectorDB = await Chroma.fromExistingCollection(this.embeddings, {
        collectionName,
      });
    }

    const llm = this.llm;
    const retriever = MultiQueryRetriever.fromLLM({
      retriever: vectorDB.asRetriever(),
      llm,
    });

    const retrievedDocs = await retriever.invoke(query);

    return retrievedDocs;
  }

  static joinDocumentContents(docs: Document[]): string {
    return docs.map((doc) => doc.pageContent).join("\n\n");
  }
}

export default RetrieverService;
