import express from "express";
import {
  startGithubLogin,
  finishGithubLogin,
  logout,
  remove,
  see,
  getEdit,
  postEdit,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";
import {
  protectMiddleware,
  publicOnlyMiddleware,
} from "../middlewares/protectMiddleware";
import { avatarUpload } from "../middlewares/uploadMiddleware";
import { localsMiddleware } from "../middlewares/localsMiddleware";

const userRouter = express.Router();

userRouter
  .route("/github/start")
  .all(publicOnlyMiddleware)
  .get(startGithubLogin);
userRouter
  .route("/github/finish")
  .all(publicOnlyMiddleware)
  .get(finishGithubLogin);
userRouter.route("/logout").all(protectMiddleware).get(logout);
userRouter
  .route("/edit")
  .all(protectMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);
userRouter
  .route("/change-password")
  .all(protectMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/remove", remove);
userRouter.route("/:id").get(see);

export default userRouter;
