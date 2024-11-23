import dotenvx from "@dotenvx/dotenvx";
dotenvx.config();

(async () => {
  const { default: app } = await import("./server");
  const mongoose = await import("mongoose");

  await mongoose.connect(process.env.MONGODB_URI as string);

  const PORT = 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();