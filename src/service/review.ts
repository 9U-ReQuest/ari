import path from "node:path";
import { extractFilePaths, getProjectFileTree } from "#util/file";
import { promptFactory } from "#service/promptFactory";
import LLMService from "#service/llmService";
import HttpError from "#global/error/http.error";
import ReviewRepository from "#repository/review";

export default class ReviewService {
    private llmService: LLMService;
    private reviewRepository: ReviewRepository;

    constructor() {
        this.llmService = new LLMService();
        this.reviewRepository = new ReviewRepository();
    }

    generateSummary = async (submissionId: string): Promise<string> => {
        // 기존 문서를 확인
        const existingReview = await this.reviewRepository.findBySubmissionId(submissionId);

        // 문서가 없으면 생성
        if (!existingReview) {
            await this.reviewRepository.createReview({
                id: submissionId,
                status: "PENDING", // 초기 상태
                summary: "default", // 요약은 비워둠
                scores: {
                    accuracy: 0,
                    logic: 0,
                    efficiency: 0,
                    consistency: 0,
                },
            });
        }

        // 프로젝트 디렉터리 및 파일 목록 처리
        const projectDirectory = path.join(process.cwd(), "src/project");
        const fileTree = await getProjectFileTree(projectDirectory);
        const extractFileTree = extractFilePaths(fileTree);
        const joinedCode = extractFileTree.join("\n\n");

        // LLM에 전달할 prompt 생성
        const args = { codeFiles: joinedCode, requirements };
        const prompt = promptFactory("summary", [args]);

        // LLM에 요청하여 요약 생성
        const summary = await this.llmService.query(prompt);

        if (typeof summary !== "string") {
            throw new HttpError(500, "internal error");
        }

        // 요약 업데이트
        await this.reviewRepository.updateSummary(submissionId, summary);

        return summary;
    };

    checkReviewDone = async (submissionId: string): Promise<boolean> => {
        const review = await this.reviewRepository.findBySubmissionId(submissionId);

        if (!review) {
            return false; // 리뷰 문서가 없으면 false
        }

        const { summary, scores } = review;

        // summary가 비어있지 않고 scores의 모든 값이 0이 아닌 경우 true
        const isSummaryValid = summary.trim() !== "";
        const areScoresValid = Object.values(scores).every((value) => value !== 0);

        return isSummaryValid && areScoresValid;
    };
}

const requirements = `
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
`;
