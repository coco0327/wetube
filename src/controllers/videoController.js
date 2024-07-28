import { User } from "../models/User";
import { Video } from "../models/Video";

// Video.find({}, (error, videos) => {
//   console.log("error", error);
//   console.log("videos", videos);
// });

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: "desc" });
    res.render("index", { pageTitle: "Home", videos });
  } catch {
    return res.render("server-error");
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner");
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
    return res.redner(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.splitHashes(hashtags),
  });
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
    file: { path: videoUrl },
    body: { title, description, hashtags },
  } = req;

  try {
    const newVideo = await Video.create({
      title,
      videoUrl,
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
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
