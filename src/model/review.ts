import mongoose, { Schema, Document, Model } from 'mongoose';

// 리뷰 객체의 타입 정의
export type TReviewDetail = {
    review: string;
    flag?: boolean;
    filePath: string;
    func?: string;
};

// 전체 문서의 타입 정의
export type TReview = {
    assignmentId: string;
    accuracy: TReviewDetail[];
    logic: TReviewDetail[];
    efficiency: TReviewDetail[];
    consistency: TReviewDetail[];
};

// Document 인터페이스 정의
export interface IReview extends Document, TReview {}

// 리뷰 세부사항 스키마 정의
const ReviewDetailSchema: Schema<TReviewDetail> = new Schema({
    review: { type: String, required: true },
    flag: { type: Boolean, default: false },
    filePath: { type: String, required: true },
    func: { type: String, default: null },
});

// 메인 스키마 정의
const ReviewSchema: Schema<IReview> = new Schema({
    assignmentId: { type: String, required: true },
    accuracy: { type: [ReviewDetailSchema], default: [] },
    logic: { type: [ReviewDetailSchema], default: [] },
    efficiency: { type: [ReviewDetailSchema], default: [] },
    consistency: { type: [ReviewDetailSchema], default: [] },
});

// 모델 생성
const ReviewModel: Model<IReview> = mongoose.model<IReview>('Review', ReviewSchema);

export default ReviewModel;
