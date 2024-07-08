import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 8062;

const app = express();
const logger = morgan("dev");
app.use(logger);

app.set("veiw engine", "ejs");

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

app.listen(PORT, () =>
  console.log(`✅ Server Listening on Port http://localhost:${PORT} 🤡`)
);
