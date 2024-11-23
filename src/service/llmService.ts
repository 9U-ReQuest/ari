import OpenAI from "openai";
import {zodResponseFormat} from "openai/helpers/zod";
import {z} from "zod";

export type TReview = {
    review: string,
    flag?: boolean,
    filePath: string,
    func?: string,
    category?: string;
}

class LLMService {
    private client: OpenAI;
    constructor() {
        this.client = new OpenAI({apiKey: process.env.OPEN_AI_SECRET})
    }

    async query (query: string): Promise<Omit<TReview, "filePath"> | string> {
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

    public async gradeScenario(query: string): Promise<{ positive: number; negative: number }> {
        // Zod 스키마 정의
        const GradeFormat = z.object({
            positive: z.number(),
            negative: z.number(),
        });

        const prompt = `
        응답 배열에서 positive와 nagative한 응답의 개수를 반환해야한다.
        아주 긍정적이거나, 아주 부정적인 것은 2개로 카운트한다.
        `

        // OpenAI API 호출
        const response = await this.client.beta.chat.completions.parse({
            model: "gpt-4o",
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: query },
            ],
            response_format: zodResponseFormat(GradeFormat, "grade"),
        });

        // 응답 파싱 및 반환
        const parsed = response.choices[0].message.parsed;
        if (!parsed) {
            throw new Error("Invalid response structure");
        }

        return parsed;
    }

    parseResponse(content: string) {
        try {
            if (!content.startsWith("```")) {
                return content;
            }
            // 백틱과 ```json, ``` 제거
            const jsonString = content
                .replace(/```json\n/, '') // ```json 제거
                .replace(/```markdown\n/, '') // ```markdown 제거
                .replace(/```$/, '')     // 마지막 ``` 제거
                .trim();

            // JSON 파싱
            const parsedObject = JSON.parse(jsonString);
            return parsedObject;
        } catch (error) {
            console.error('JSON 파싱 실패:', error);
            return ""
        }
    }
}

export default LLMService;