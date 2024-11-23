import express, { Request, Response, Router } from "express";
import SummaryService from "#service/summary";
import AsyncWrapper from "#global/middleware/async-wrapper";

const router: Router = express.Router();
const summaryService = new SummaryService();

router.get("/", AsyncWrapper(async (req: Request, res: Response) => {
    const { submissionId } = req.query;
    if (!submissionId) {
        return res.status(404).json({})
    }

    const summary = await summaryService.getTotalSummary(String(submissionId));

    res.status(200).json({ summary, submissionId });
}))

router.get("/summaries/:submissionId", AsyncWrapper(async (req: Request, res: Response) => {
    const { submissionId } = req.params;
    if (!submissionId) {
        return res.status(404).json({})
    }

    const summary = await summaryService.getTotalSummary(String(submissionId));

    res.status(200).json({ summary, submissionId });
}))

export default router;