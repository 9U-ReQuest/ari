import { LOGGER } from "@repo/logger";
import { createServer } from "./server.js";
import * as mongoose from "mongoose";

const port = process.env.PORT || 5050;
const server = createServer();

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => LOGGER("Success Connection MongoDB"))
  .catch((err: Error) => LOGGER(err.message));

server.listen(port, () => {
  LOGGER(`api running on ${port}`);
});
