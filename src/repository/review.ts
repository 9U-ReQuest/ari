import ReviewModel, { TReviewDetail } from '#model/review';

export default class ReviewRepository {
    // 각 크리테리아 배열에 리뷰를 추가하는 메서드
    async addReviewToCriteria(
        assignmentId: string,
        criteria: 'accuracy' | 'logic' | 'efficiency' | 'consistency',
        reviewDetail: TReviewDetail
    ) {
        return ReviewModel.findOneAndUpdate(
            { assignmentId },
            { $push: { [criteria]: reviewDetail } },
            { new: true, upsert: true }
        ).lean();
    }

    // 특정 크리테리아 정보를 가져오는 메서드
    async getCriteriaReviews(
        assignmentId: string,
        criteria: 'accuracy' | 'logic' | 'efficiency' | 'consistency'
    ) {
        return ReviewModel.findOne({ assignmentId }, { [criteria]: 1, _id: 0 }).lean();
    }

    // 전체 리뷰 정보를 가져오는 메서드
    async getAllReviewsByAssignmentId(assignmentId: string) {
        return ReviewModel.findOne({ assignmentId }).lean();
    }
}
