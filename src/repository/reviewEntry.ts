import ReviewEntryModel, { TReviewEntry } from '#model/reviewEntry';

export default class ReviewEntryRepository {
    // 새로운 리뷰 엔트리를 추가하는 메서드
    async saveReviewEntry(reviewEntry: TReviewEntry) {
        const entry = new ReviewEntryModel(reviewEntry);
        return entry.save();
    }

    async getEntriesBySubmissionAndScenario(submissionId: string, scenario: string): Promise<{ name: string; message: string }[]> {
        const entries = await ReviewEntryModel.find({ submissionId, scenario }).lean();

        return entries.map(entry => ({
            name: entry.name,
            message: entry.message,
        }));
    }
}
