import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
} from "../controllers/videoController";

export const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/views", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.delete("/comments/:id([0-9a-f]{24})", deleteComment);
