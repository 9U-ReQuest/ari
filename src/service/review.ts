import path from "node:path";
import * as fs from "node:fs";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import LLMService from "#service/llmService.js";
import ReviewRepository from "#repository/review"
import {promptFactory} from "#service/promptFactory.js";
import {TReviewDetail} from "#model/review";
import {EventEmitter} from "events";

type FileTree = {
    path: string; // 파일의 전체 경로
    name: string; // 파일 이름
    isDirectory: boolean; // 디렉터리 여부
    children?: FileTree[]; // 디렉터리인 경우 자식 노드
};

export type TReview = {
    review: string,
    flag?: boolean,
    filePath: string,
    func?: string
}

export class ReviewService {
    private reviewRepository: ReviewRepository;
    private llmService: LLMService;

    constructor() {
        this.reviewRepository = new ReviewRepository();
        this.llmService = new LLMService()
    }


    // AI 리뷰 생성 메서드 (public)
    public generateReview = async ({
                                    assignmentId,
                                    criteria,
        emitter,
        stream = false,
                                }: {
        assignmentId: string;
        criteria: "accuracy" | "logic" | "efficiency" | "consistency";
        emitter?: EventEmitter
        stream?: boolean;
    }): Promise<TReview[]> => {
        console.log(`Generating review for assignmentId: ${assignmentId} with criteria: ${criteria}`);

        // TODO: 실제로는 assignmentId 기반으로 불러와야 함
        const projectDirectory = path.join(process.cwd(), 'src/project');
        const fileTree = await this.getProjectFileTree(projectDirectory);
        const extractFileTree = this.extractFilePaths(fileTree).slice(0, 10);
        const fileTreeStr = extractFileTree.join("\n");

        const reviewResults: TReview[] = [];

        // 파일별로 평가 수행
        for (const filePath of extractFileTree) {
            const codeFile = fs.readFileSync(filePath, "utf-8");

            const args = { filePath, codeFile, requirements, fileTreeStr };

            // 전달받은 criteria에 따라 prompt 생성 및 평가 수행
            const prompt = promptFactory(criteria, [args]);
            const res = await this.llmService.query(prompt);

            const reviewWithFilePath: TReview = {
                ...res,
                filePath,
            };

            reviewResults.push(reviewWithFilePath);
            console.log(reviewWithFilePath);
            const reviewDoc = await this.reviewRepository.addReviewToCriteria(assignmentId, criteria, reviewWithFilePath);

            if (stream === true && emitter) {
                emitter.emit("data", reviewWithFilePath);
            }
        }

        return reviewResults;
    }

    // 파일 트리 생성 메서드 (private)
    private getProjectFileTree = async (directory: string): Promise<FileTree[]> => {
        const result: FileTree[] = [];
        const items = fs.readdirSync(directory);

        for (const item of items) {
            const itemPath = path.join(directory, item);
            const stat = fs.statSync(itemPath);

            if (stat.isDirectory()) {
                result.push({
                    path: itemPath,
                    name: item,
                    isDirectory: true,
                    children: await this.getProjectFileTree(itemPath),
                });
            } else {
                result.push({
                    path: itemPath,
                    name: item,
                    isDirectory: false,
                });
            }
        }

        return result;
    }

    // 파일 경로 추출 메서드 (private)
    private extractFilePaths = (fileTree: FileTree[]): string[] => {
        const filePaths: string[] = [];

        for (const node of fileTree) {
            if (node.isDirectory && node.children) {
                filePaths.push(...this.extractFilePaths(node.children));
            } else if (!node.isDirectory) {
                filePaths.push(node.path);
            }
        }

        return filePaths;
    }

    // 각 크리테리아 배열에 리뷰를 추가하는 서비스 함수
    public addReview = async (
        assignmentId: string,
        criteria: 'accuracy' | 'logic' | 'efficiency' | 'consistency',
        reviewDetail: TReviewDetail
    ) => {
        if (!reviewDetail.review || !reviewDetail.filePath) {
            throw new Error('Review and filePath are required fields');
        }
        return this.reviewRepository.addReviewToCriteria(assignmentId, criteria, reviewDetail);
    };

    // 특정 크리테리아 정보를 가져오는 서비스 함수
    public fetchCriteriaReviews = async (
        assignmentId: string,
        criteria: 'accuracy' | 'logic' | 'efficiency' | 'consistency'
    ) => {
        const result = await this.reviewRepository.getCriteriaReviews(assignmentId, criteria);
        if (!result) {
            throw new Error(`No reviews found for assignmentId: ${assignmentId} and criteria: ${criteria}`);
        }
        return result;
    };

    // 전체 리뷰 정보를 가져오는 서비스 함수
    public fetchAllReviews = async (assignmentId: string) => {
        const result = await this.reviewRepository.getAllReviewsByAssignmentId(assignmentId);
        if (!result) {
            throw new Error(`No reviews found for assignmentId: ${assignmentId}`);
        }
        return result;
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