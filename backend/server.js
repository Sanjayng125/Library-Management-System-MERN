import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import bookRoute from "./routes/bookRoute.js";
import userRoute from "./routes/userRoute.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

//Routes

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/book", bookRoute);
app.use("/api/v1/users", userRoute);

//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Library Management System</h1>");
});

const port = process.env.PORT;

app.listen(8080, () => {
  console.log(`listening on ${port}`);
});
