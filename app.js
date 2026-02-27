import "dotenv/config";
import "express-async-errors";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import connectDatabase from "./db/connectDatabase.js";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import notFoundHandler from "./middlewares/notFondHandler.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);

app.use(notFoundHandler);
app.use(errorHandler);

await connectDatabase();

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log("Server is running. Use our API on port: 3000");
});