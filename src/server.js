import express from "express";
import morgan from "morgan";

//Middlewares
import flash from "express-flash";
import { localsMiddleware } from "./middlewares/localsMiddleware";
import { sessionMiddleware } from "./middlewares/sessionMiddleware";

// Routers
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { apiRouter } from "./routers/apiRouter";

export const app = express();
const logger = morgan("dev");
app.use(logger);

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(sessionMiddleware);
app.use(flash());
app.use(localsMiddleware);

app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);
