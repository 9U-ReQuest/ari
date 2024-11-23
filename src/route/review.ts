import express, { Request, Response, Router } from "express";
import ReviewService from "#service/review";
import AsyncWrapper from "#global/middleware/async-wrapper";

const router: Router = express.Router();
const reviewService = new ReviewService();

router.post(
    "/",
    AsyncWrapper(async (req: Request, res: Response) => {
        const { submissionId } = req.body;

        if (!submissionId) {
            return res.status(400).json({ error: "submissionId is required" });
        }

        const summary = await reviewService.generateSummary(String(submissionId));

        res.status(200).json({ summary, submissionId });
    })
);

export default router;
