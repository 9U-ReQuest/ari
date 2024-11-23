import HttpError from "../../../global/error/http.error.ts";
import type DataLoader from "./data-loader.interface.ts";
import { LocalPdfLoader } from "./pdf-loader.ts";
import { LocalDocxLoader } from "./docx-loader.ts";
import { LocalNotionLoader, WebNotionLoader } from "./notion-loader.ts";
import { WebLoader } from "./web-loader.ts";

class LoaderFactory {
  static createLoader(type: LoaderType): DataLoader {
    switch (type) {
      case LoaderType.WEB:
        return new WebLoader();
      case LoaderType.PDF_LOCAL:
        return new LocalPdfLoader();
      case LoaderType.DOCX:
        return new LocalDocxLoader();
      case LoaderType.NOTION_LOCAL:
        return new LocalNotionLoader();
      case LoaderType.NOTION_WEB:
        return new WebNotionLoader();
      default:
        const _exhaustiveCheck: never = type;
        throw new HttpError(400, `Invalid loader type: ${_exhaustiveCheck}`);
    }
  }
}

export const LoaderType = {
  PDF_LOCAL: "PDFLocal",
  NOTION_LOCAL: "NotionLocal",
  NOTION_WEB: "NotionWeb",
  WEB: "Web",
  DOCX: "Docx",
} as const;
export type LoaderType = (typeof LoaderType)[keyof typeof LoaderType];

export default LoaderFactory;
