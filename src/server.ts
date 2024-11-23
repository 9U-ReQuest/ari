import express, {json} from "express";
import reviewEntry from "#route/reviewEntry";
import review from "#route/review";

const app = express();

app.use(json());

app.use("/api/review-entry", reviewEntry);
app.use("/api/review", review)

export default app;