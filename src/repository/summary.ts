import SummaryModel, { TSummary } from '#model/summary';

class SummaryRepository {
    // Summary를 저장하거나 업데이트하는 메서드
    async saveSummary(submissionId: string, summary: string): Promise<TSummary> {
        return SummaryModel.findOneAndUpdate(
            { submissionId },
            { summary },
            { new: true, upsert: true } // 새 문서를 생성하거나 업데이트된 문서를 반환
        ).lean();
    }
}

export default SummaryRepository