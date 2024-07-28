import express from "express";
import { home, search } from "../controllers/videoController";
import {
  login,
  getLogin,
  postLogin,
  getRegister,
  postRegister,
} from "../controllers/userController";
import { publicOnlyMiddleware } from "../middlewares/protectMiddleware";

const rootRouter = express.Router();

rootRouter.route("/").get(home);
rootRouter
  .route("/register")
  .all(publicOnlyMiddleware)
  .get(getRegister)
  .post(postRegister);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.route("/search").get(search);

export default rootRouter;
