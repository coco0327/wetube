import { User } from "../models/User";
import { Video } from "../models/Video";
import { Comment } from "../models/Comment";

// Video.find({}, (error, videos) => {
//   console.log("error", error);
//   console.log("videos", videos);
// });

export const home = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner");
    res.render("index", { pageTitle: "Home", videos });
  } catch {
    return res.render("server-error");
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found." });
  }
  return res.render("watch", {
    pageTitle: `Watch ${video.title}`,
    video,
  });
};

export const getEdit = async (req, res) => {
  const {
    session: {
      user: { _id: loggedInId },
    },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found." });
  }
  if (String(video.owner) !== String(loggedInId)) {
    req.flash("error", "You are not the owner of the video");
    return res.redner(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id: loggedInId },
    },
    params: { id },
    body: { title, description, hashtags },
  } = req;
  const video = await Video.findOne(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video Not Found." });
  }
  if (String(video.owner) !== String(loggedInId)) {
    req.flash("error", "You are not the owner of the video");
    return res.redner(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.splitHashes(hashtags),
  });
  req.flash("success", "Change saved.");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload" });
};

export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id: loggedInId },
    },
    files: { video, thumb },
    body: { title, description, hashtags },
  } = req;
  try {
    const newVideo = await Video.create({
      title,
      videoUrl: video[0].path,
      thumbUrl: thumb[0].path,
      description,
      hashtags: Video.splitHashes(hashtags),
      owner: loggedInId,
    });
    const user = await User.findById(loggedInId);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const {
    session: {
      user: { _id: loggedInId },
    },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found." });
  }
  if (String(video.owner) !== String(loggedInId)) {
    req.flash("error", "Not Authorized");
    return res.redner(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const {
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views += 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;

  const video = await Video.findOne({ _id: id });
  if (!video) {
    return res.sendStatus(404);
  }

  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });

  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  const {
    session: {
      user: { _id: loggedinId },
    },
    params: { id },
  } = req;
  const comment = await Comment.findOne({ _id: id }).populate("owner");
  if (String(comment.owner._id) !== String(loggedinId)) {
    return res.sendStatus(404);
  }
  await Comment.findByIdAndDelete(id);
  return res.sendStatus(200);
};
