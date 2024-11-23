import { TSplitterConfig } from "./doc-spliiter.interface.ts";
import {
  MarkdownTextSplitter,
  RecursiveCharacterTextSplitter,
} from "@langchain/textsplitters";
import HttpError from "../../../global/error/http.error.ts";

class SplitterFactory {
  static createSplitter(
    type: SplitterType,
    config?: TSplitterConfig,
  ): RecursiveCharacterTextSplitter {
    const { chunkSize = 350, chunkOverlap = 35 } = config || {};

    switch (type) {
      case SplitterType.RECURSIVE_CHARACTER:
        return new RecursiveCharacterTextSplitter({
          chunkSize: chunkSize,
          chunkOverlap: chunkOverlap,
        });
      case SplitterType.MARKDOWN:
        return new MarkdownTextSplitter({
          chunkSize: chunkSize,
          chunkOverlap: chunkOverlap,
        });
      default:
        const _exhaustiveCheck: never = type;
        throw new HttpError(400, `Invalid splitter type: ${_exhaustiveCheck}`);
    }
  }
}

export const SplitterType = {
  RECURSIVE_CHARACTER: "RecursiveCharacter",
  MARKDOWN: "Markdown",
} as const;
export type SplitterType = (typeof SplitterType)[keyof typeof SplitterType];

export default SplitterFactory;
