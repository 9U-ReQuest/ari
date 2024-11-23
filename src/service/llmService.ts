import OpenAI from "openai";
import {TReview} from "#service/review";

class LLMService {
    private client: OpenAI;
    constructor() {
        this.client = new OpenAI({apiKey: process.env["OPEN_AI_SECRET"]})
    }

    async query (query: string): Promise<Omit<TReview, "filePath">> {
        const stream = this.client.beta.chat.completions.stream({
            model: 'gpt-4o',
            messages: [{role: 'user', content: query}],
            stream: true,
        });

        stream.on('content', (delta: any, snapshot: any) => {
            process.stdout.write(delta);
        });

        const chatCompletion = await stream.finalChatCompletion();
        return this.parseResponse(chatCompletion?.choices[0]?.message?.content ?? '');
    }

    parseResponse(content: string) {
        try {
            // 백틱과 ```json, ``` 제거
            const jsonString = content
                .replace(/```json\n/, '') // ```json 제거
                .replace(/```$/, '')     // 마지막 ``` 제거
                .trim();

            // JSON 파싱
            const parsedObject = JSON.parse(jsonString);
            return parsedObject;
        } catch (error) {
            console.error('JSON 파싱 실패:', error);
            return {};
        }
    }
}

export default LLMService;