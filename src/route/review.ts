import express, { Request, Response, Router } from "express";
import AsyncWrapper from "#global/middleware/async-wrapper.js";
import { ReviewService } from "#service/review.js";

const router: Router = express.Router();
const reviewService = new ReviewService();

router.post(
    "/",
    AsyncWrapper(async (req: Request, res: Response) => {
        try {
            const { assignmentId } = req.body;

            const aiReviewResult = await reviewService.generateReview({
                assignmentId, // 인스턴스 메서드 호출
            });

            if (!aiReviewResult) {
                return res.status(500).json({ error: "Failed to generate AI review" });
            }

            res.json({
                assignmentId,
                review: aiReviewResult,
            });
        } catch (error) {
            // Handle unexpected errors
            console.error(error);
            res.status(500).json({ error: "An unexpected error occurred" });
        }
    })
);

export default router;
