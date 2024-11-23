import LLMService from "#service/llmService.js";
import ReviewEntryRepository from "#repository/reviewEntry";
import ReviewRepository from "#repository/review";
import { promptFactory } from "#service/promptFactory.js";
import { EventEmitter } from "events";
import { extractFilePaths, getProjectFileTree } from "#util/file";
import HttpError from "#global/error/http.error";
import path from "path";
import fs from "fs";
import ReviewService from "#service/review";
import SubmissionRepository from "#repository/submission";

export type TReviewEntry = {
    submissionId: string;
    name: string;
    result?: string;
    scenario: string;
    path: string;
    message: string;
};

export class ReviewEntryService {
    private reviewEntryRepository: ReviewEntryRepository;
    private reviewRepository: ReviewRepository;
    private reviewService: ReviewService;
    private llmService: LLMService;
    private submissionRepository: SubmissionRepository

    constructor() {
        this.reviewEntryRepository = new ReviewEntryRepository();
        this.reviewRepository = new ReviewRepository(); // 초기화
        this.llmService = new LLMService();
        this.reviewService = new ReviewService();
        this.submissionRepository = new SubmissionRepository();
    }

    // AI 리뷰 생성 메서드 (public)
    public generateReview = async ({
                                       submissionId,
                                       scenario,
                                   }: {
        submissionId: string;
        scenario: "accuracy" | "logic" | "efficiency" | "consistency";
        emitter?: EventEmitter;
        stream?: boolean;
    }): Promise<void> => {
        console.log(`Generating review for submissionId: ${submissionId} with scenario: ${scenario}`);

        // 리뷰 상태를 "reviewing"으로 업데이트
        await this.reviewRepository.updateStatus(submissionId, "REVIEWING");
        await this.submissionRepository.updateStatusById(submissionId, "REVIEWING");

        // 프로젝트 디렉터리 및 파일 목록 가져오기
        const projectDirectory = path.join(process.cwd(), "src/project");
        const fileTree = await getProjectFileTree(projectDirectory);
        const extractFileTree = extractFilePaths(fileTree).slice(0, 10);
        const fileTreeStr = extractFileTree.join("\n");

        // 각 파일에 대해 리뷰 생성
        for (const extFilePath of extractFileTree) {
            const codeFile = fs.readFileSync(extFilePath, "utf-8");
            const relativeFilePath = extFilePath.substring(`${process.cwd()}/src/project`.length);

            const args = { filePath: relativeFilePath, codeFile, requirements, fileTreeStr };

            // 시나리오 기반으로 prompt 생성
            const prompt = promptFactory(scenario, [args]);
            const llmResponse = await this.llmService.query(prompt);

            if (llmResponse === "") {
                continue;
            }

            if (typeof llmResponse === "string") {
                throw new HttpError(500, "internal");
            }

            const reviewEntry: TReviewEntry = {
                submissionId,
                name: llmResponse.category ?? "",
                result: "natural",
                scenario,
                path: relativeFilePath,
                message: llmResponse.review,
            };

            console.log(reviewEntry);
            // 리뷰 엔트리 저장
            await this.reviewEntryRepository.saveReviewEntry(reviewEntry);
        }

        const entries = await this.reviewEntryRepository.getEntriesBySubmissionAndScenario(submissionId, scenario);
        const joinedEntries = entries.map(entry => JSON.stringify(entry)).join("\n\n");

        console.log(joinedEntries);

        const { positive, negative } = await this.llmService.gradeScenario(joinedEntries);

        const total = positive + negative;
        const score = total > 0 ? positive / total : 0;
        console.log(positive, negative, score);

        await this.reviewRepository.updateScore(submissionId, scenario, score * 100);

        const isDone = await this.reviewService.checkReviewDone(submissionId);
        if (isDone) {
            await this.reviewRepository.updateStatus(submissionId, "DONE");
            await this.submissionRepository.updateStatusById(submissionId, "REVIEWED");
        }
    };
}

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