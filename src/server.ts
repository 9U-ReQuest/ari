import express, {json} from "express";
import summary from "#route/summary";
import reviewEntry from "#route/reviewEntry";

const app = express();

app.use(json());

app.use("/api/review-entry", reviewEntry);
app.use("/api/summary", summary)

export default app;