import express, { Request, Response, Router } from "express";
import AsyncWrapper from "#global/middleware/async-wrapper.js";
import { ReviewService } from "#service/review.js";
import { EventEmitter } from "events"

const router: Router = express.Router();
const reviewService = new ReviewService();

router.post(
    "/",
    AsyncWrapper(async (req: Request, res: Response) => {
        const { assignmentId , criteria, stream } = req.body;



        if (stream === true) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            const emitter = new EventEmitter();
            emitter.on("data", (data) => {
                console.log(data);
                res.write(`data: ${JSON.stringify(data)}\n\n`);
            })

           await reviewService.generateReview({
                assignmentId,
                criteria,
                emitter,
                stream: true,
            });

            res.write("event: end\n");
            res.write("data: end\n\n");
            res.end();
            return;
        }

        const aiReviewResult = await reviewService.generateReview({
            assignmentId, // 인스턴스 메서드 호출
            criteria,
        });

        if (!aiReviewResult) {
            return res.status(500).json({ error: "Failed to generate AI review" });
        }

        res.json({
            assignmentId,
            review: aiReviewResult,
        });

    })
);

// 라우트 통합 및 쿼리에 따른 분기
router.get(
    "/",
    AsyncWrapper(async (req: Request, res: Response) => {
        const { assignmentId, criteria } = req.query;

        if (!assignmentId) {
            return res.status(400).json({ error: "assignmentId is required" });
        }

        if (criteria) {
            // 특정 크리테리아 리뷰 가져오기
            const reviews = await reviewService.fetchCriteriaReviews(
                assignmentId as string,
                criteria as "accuracy" | "logic" | "efficiency" | "consistency"
            );
            return res.json(reviews);
        }

        // 전체 리뷰 가져오기
        const allReviews = await reviewService.fetchAllReviews(assignmentId as string);
        return res.json(allReviews);
    })
);


export default router;
