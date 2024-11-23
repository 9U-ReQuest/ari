import ReviewEntryModel, { TReviewEntry } from '#model/reviewEntry';

export default class ReviewEntryRepository {
    // 새로운 리뷰 엔트리를 추가하는 메서드
    async saveReviewEntry(reviewEntry: TReviewEntry) {
        const entry = new ReviewEntryModel(reviewEntry);
        return entry.save();
    }
}
