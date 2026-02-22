import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
dotenv.config();
import UserRouter from "./routes/user.route.js";
import ChatRouter from "./routes/chat.route.js";
import HerbRouter from "./routes/herb.route.js";
// import { indexAllData } from "./scripts/indexData.js";

const app = express();

app.use(express.json());

const PORT = process.env.PORT;

app.use('/api/v1/user', UserRouter);
app.use('/api/v1/chat', ChatRouter);
app.use('/api/v1/herb', HerbRouter);

// indexAllData();

connectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error(err);
  });
})
.catch((err) => {
  console.error(err);
})