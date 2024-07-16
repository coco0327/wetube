import express from "express";
import { home, search } from "../controllers/videoController";
import {
  login,
  getRegister,
  postRegister,
} from "../controllers/userController";

const rootRouter = express.Router();

rootRouter.route("/").get(home);
rootRouter.route("/register").get(getRegister).post(postRegister);
rootRouter.route("/login").get(login);
rootRouter.route("/search").get(search);

export default rootRouter;
