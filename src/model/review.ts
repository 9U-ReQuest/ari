import mongoose, { Schema, Document } from 'mongoose';

// TReview 타입 정의
export type TReview = {
    id: string; // 사용자 정의 ID
    status: "done" | "reviewing" | "pending"; // 상태명 영어로 표준화
    summary: string;
    scores: {
        accuracy?: number; // undefined 허용
        logic?: number;    // undefined 허용
        efficiency?: number; // undefined 허용
        consistency?: number; // undefined 허용
    };
};

// MongoDB 문서 타입 정의
export interface IReview extends Document {
    id: string; // 사용자 정의 필드
    status: "done" | "reviewing" | "pending";
    summary: string;
    scores: {
        accuracy?: number;
        logic?: number;
        efficiency?: number;
        consistency?: number;
    };
    _id: mongoose.Types.ObjectId; // MongoDB의 기본 _id 필드
}

// 스키마 정의
export const mReviewSchema = new Schema<IReview>({
    id: { type: String, unique: true, required: true, index: true }, // 사용자 정의 ID
    status: {
        type: String,
        required: true,
        enum: ["done", "reviewing", "pending"], // 허용 값 제한
    },
    summary: { type: String, required: true },
    scores: {
        accuracy: { type: Number, default: 0 }, // 기본값 0
        logic: { type: Number, default: 0 },    // 기본값 0
        efficiency: { type: Number, default: 0 }, // 기본값 0
        consistency: { type: Number, default: 0 }, // 기본값 0
    },
});

// 모델 정의
export const ReviewModel = mongoose.model<IReview>('Review', mReviewSchema);

export default ReviewModel;
