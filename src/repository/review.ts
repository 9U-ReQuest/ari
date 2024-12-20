import { ReviewModel, TReview } from "#model/review";

export default class ReviewRepository {
    // 1. 문서를 생성하는 기능
    async createReview(data: Partial<TReview>): Promise<TReview> {
        const review = new ReviewModel(data);
        return review.save();
    }

    // 2. 특정 스코어만 업데이트하는 기능
    async updateScore(id: string, scenario: keyof TReview["scores"], score: number): Promise<TReview | null> {
        // 동적으로 특정 시나리오의 스코어를 업데이트
        return ReviewModel.findOneAndUpdate(
            { id },
            { $set: { [`scores.${scenario}`]: score } }, // 동적 경로 설정
            { new: true } // 업데이트된 문서 반환
        ).lean() as Promise<TReview | null>;
    }

    // 3. 상태만 업데이트하는 기능
    async updateStatus(id: string, status: TReview["status"]): Promise<TReview | null> {
        return ReviewModel
            .findOneAndUpdate(
                { id },
                { $set: { status } },
                { new: true }
            )
            .lean() as Promise<TReview | null>;
    }

    // 4. 서머리만 업데이트하는 기능
    async updateSummary(id: string, summary: TReview["summary"]): Promise<TReview | null> {
        return ReviewModel
            .findOneAndUpdate(
                { id },
                { $set: { summary } },
                { new: true }
            )
            .lean() as Promise<TReview | null>;
    }

    // 5. submissionId로 문서를 찾는 기능
    async findBySubmissionId(submissionId: string): Promise<TReview | null> {
        return ReviewModel.findOne({ id: submissionId }).lean() as Promise<TReview | null>;
    }
}
