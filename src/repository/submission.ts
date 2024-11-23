import mongoose from 'mongoose';
import SubmissionModel from "#model/submission";

export default class SubmissionRepository {
    /**
     * submissionId 기반으로 status를 변경합니다.
     * @param submissionId - 변경할 submission의 ID
     * @param newStatus - 변경할 status 값
     * @returns 업데이트된 submission 문서 또는 null
     */
    async updateStatusById(submissionId: string, newStatus: 'REVIEWING' | 'PREPARING' | 'REVIEWED') {
        try {
            const updatedSubmission = await SubmissionModel.findOneAndUpdate(
                { id: submissionId }, // 커스텀 id 필드로 검색
                { status: newStatus, lastUpdated: new Date() },
                { new: true, runValidators: true } // 업데이트된 문서 반환, 검증 실행
            );

            return updatedSubmission;
        } catch (error) {
            console.error('Error updating submission status:', error);
        }
    }
}
