import multer from "multer";

export const avatarUpload = multer({
  dest: "uploads/avatars",
});
export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000,
  },
});
