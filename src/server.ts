import express, {json} from "express";
import review from "#route/review.js";

const app = express();

app.use(json());

app.use("/api/review", review);

export default app;