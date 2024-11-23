import dotenvx from "@dotenvx/dotenvx"
import { ReviewService } from "#service/review.js";
import mongoose from "mongoose";

import app from "./server";

dotenvx.config();

await mongoose.connect(process.env.MONGODB_URI as string);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// ReviewService 사용
const rs = new ReviewService();
rs.generateReview({ assignmentId: "assignment" });
