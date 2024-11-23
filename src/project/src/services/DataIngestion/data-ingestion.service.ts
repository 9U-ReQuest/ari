import LoaderFactory, { LoaderType } from "./loaders/loader-factory.ts";
import DataLoader, { TLoaderConfig } from "./loaders/data-loader.interface.ts";
import SplitterFactory, { SplitterType } from "./splitters/splitter-factory.ts";
import { TSplitterConfig } from "./splitters/doc-spliiter.interface.ts";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import ApiKeyConfig from "../../global/config/api-key.config.ts";
import { LOGGER } from "@repo/logger";
import { ChromaClient } from "chromadb";
import { Chroma } from "@langchain/community/vectorstores/chroma";

class DataIngestionService {
  constructor() {}

  async ingest({
    loadOption,
    splitOption,
    storeOption,
  }: TIngestOptions): Promise<Chroma> {
    const loader: DataLoader = LoaderFactory.createLoader(loadOption.type);
    const document = await loader.load(loadOption.source, loadOption.config);
    LOGGER(`Load Document: ${loadOption.source}`);

    const splitter: RecursiveCharacterTextSplitter =
      SplitterFactory.createSplitter(splitOption.type);
    const splits = await splitter.invoke(document);
    LOGGER(`Split Document: ${splits.length}`);

    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
      apiKey: ApiKeyConfig.OPENAI_API_KEY,
    });
    LOGGER(`Embedding Chunks`);

    const client = new ChromaClient({
      path: "http://localhost:8000",
    });
    const vectorDB = await Chroma.fromDocuments(splits, embeddings, {
      index: client,
      collectionName: storeOption.collectionName,
    });
    LOGGER("Store Document");

    return vectorDB;
  }
}

type TIngestOptions = {
  loadOption: {
    source: string;
    type: LoaderType;
    config?: TLoaderConfig;
  };
  splitOption: {
    type: SplitterType;
    config?: TSplitterConfig;
  };
  storeOption: {
    collectionName?: string;
  };
};

export default DataIngestionService;
