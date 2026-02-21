import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
dotenv.config();
import UserRouter from "./routes/user.route.js";

const app = express();

app.use(express.json());

const PORT = process.env.PORT;

app.use('/api/v1/user', UserRouter);

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