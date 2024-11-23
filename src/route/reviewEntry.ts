import express, {Request, Response, Router} from "express";
import AsyncWrapper from "#global/middleware/async-wrapper.js";
import {ReviewEntryService} from "#service/reviewEntry";

const router: Router = express.Router();
const reviewService = new ReviewEntryService();

router.post(
    "/",
    AsyncWrapper(async (req: Request, res: Response) => {
        const { submissionId, scenario } = req.body;
        //scenario: "accuracy" | "logic" | "efficiency" | "consistency";

        res.json({
            message: "Review generated successfully",
        });

        await reviewService.generateReview({
            submissionId, // 인스턴스 메서드 호출
            scenario,
        });
    })
);

export default router;
