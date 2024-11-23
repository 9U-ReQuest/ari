import mongoose, { Schema, Document, Model } from 'mongoose';

// 리뷰 객체의 타입 정의
export type TSummary = {
    summary: string;
    submissionId: string
};

// Document 인터페이스 정의
export interface ISummary extends Document, TSummary {}

const SummarySchema: Schema<ISummary> = new Schema({
    submissionId: { type: String, required: true },
    summary: { type: String, required: true },
});

// 모델 생성
const SummaryModel: Model<ISummary> = mongoose.model<ISummary>('Summary', SummarySchema);

export default SummaryModel;
