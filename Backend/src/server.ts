import "./config/env";

import mongoose from "mongoose";
import app from "./app";

async function main() {
  await mongoose.connect(process.env.DATABASE_URL as string);

  app.listen(process.env.PORT || 3000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
  });
}

main().catch((err) => console.log(err));