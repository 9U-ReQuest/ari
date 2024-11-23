import mongoose, { Schema, Document, Model } from 'mongoose';

// 리뷰 엔트리 객체의 타입 정의
export type TReviewEntry = {
    submissionId: string;
    name: string;
    result?: string; // 기본값 추가
    scenario: string;
    path: string;
    message: string;
};

// Document 인터페이스 정의
export interface IReviewEntry extends Document, TReviewEntry {}

// 리뷰 엔트리 스키마 정의
const ReviewEntrySchema: Schema<IReviewEntry> = new Schema({
    submissionId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    result: { type: String, default: "natural" }, // 기본값 "natural"
    scenario: { type: String, required: true },
    path: { type: String, required: true },
    message: { type: String, required: true },
});

// 모델 생성
const ReviewEntryModel: Model<IReviewEntry> = mongoose.model<IReviewEntry>('ReviewEntry', ReviewEntrySchema);

export default ReviewEntryModel;
