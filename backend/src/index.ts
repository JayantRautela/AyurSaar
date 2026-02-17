import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
})
.on("error", (err) => {
  console.error(err);
});