import mongoose, { Schema, Document } from 'mongoose';

// Status 타입 정의
type Status = 'REVIEWING' | 'PREPARING' | 'REVIEWED';

// Submission Document 인터페이스
interface Submission extends Document {
    status: Status;
    lastUpdated: Date;
    id: string;
    userId: mongoose.Types.ObjectId;
    assignmentId: string;
    repoUrl: string;
}

// Submission 스키마 정의
const submissionSchema = new Schema<Submission>(
    {
        status: {
            type: String,
            enum: ['REVIEWING', 'PREPARING', 'REVIEWED'], // 허용되는 값 제한
            required: true,
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
        id: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        assignmentId: {
            type: String,
            required: true,
        },
        repoUrl: {
            type: String,
            required: true,
        },
    },
);

// 모델 생성
const SubmissionModel = mongoose.model<Submission>('Submission', submissionSchema);

export default SubmissionModel;
