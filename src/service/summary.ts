import path from "node:path";
import {extractFilePaths, getProjectFileTree} from "#util/file";
import {promptFactory} from "#service/promptFactory";
import LLMService from "#service/llmService";
import SummaryRepository from "#repository/summary";
import HttpError from "#global/error/http.error";

class SummaryService {
    private llmService: LLMService;
    private summaryRepository: SummaryRepository;
    constructor() {
        this.llmService = new LLMService()
        this.summaryRepository = new SummaryRepository()
    }

    getTotalSummary= async (submissionId: string) => {
        const projectDirectory = path.join(process.cwd(), 'src/project');
        const fileTree = await getProjectFileTree(projectDirectory);
        const extractFileTree = extractFilePaths(fileTree);

        const joinedCode = extractFileTree.join("\n\n");

        const args = { codeFiles: joinedCode, requirements};

        const prompt = promptFactory("summary", [args]);
        const summary = await this.llmService.query(prompt);

        if (typeof summary !== "string") {
            throw new HttpError(500, "internal error");
        }


        await this.summaryRepository.saveSummary(submissionId, summary);
        return summary;
    }
}

export default SummaryService;

const requirements =
    `
# 과제 요구사항

다음 과제 요구사항에 맞춰 코드를 구현해합니다.

RAG를 활용하여 LLM 시맨틱 검색 기능을 구현합니다.

## RAG
- RAG 시스템을 구축합니다.
- retrive는 vector 를 통한 검색을 사용합니다.
- PDF 및 외부 파일도 읽을 수 있어야합니다

## Chat
- LLM에게 제시하는 대화는 멀티턴을 구현할 수 있어야합니다.
- LLM이 이전 대화를 기억할 수 있도록 구현하세요

## Convention
- 타입스크립트를 사용합니다.
- MVC 패턴을 사용합니다.
`