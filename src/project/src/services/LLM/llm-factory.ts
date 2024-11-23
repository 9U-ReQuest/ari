import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import ApiKeyConfig from "../../global/config/api-key.config.ts";

export const LLMType = {
  OPENAI: "openai",
  ANTHROPIC: "anthropic",
} as const;

export type LLMType = (typeof LLMType)[keyof typeof LLMType];

export class LLMFactory {
  static createLLM(type: LLMType) {
    switch (type) {
      case LLMType.OPENAI:
        return new ChatOpenAI({
          model: "gpt-4o-mini",
          openAIApiKey: ApiKeyConfig.OPENAI_API_KEY,
          temperature: 0.3,
        });
      case LLMType.ANTHROPIC:
        return new ChatAnthropic({
          model: "claude-3-5-sonnet-20240620",
          anthropicApiKey: ApiKeyConfig.ANTHROPIC_API_KEY,
          temperature: 0.3,
        });
      default:
        const _exhaustiveCheck: never = type;
        throw new Error(`Unsupported LLM type: ${_exhaustiveCheck}`);
    }
  }
}

export default LLMFactory;
