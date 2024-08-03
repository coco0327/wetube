import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, tirm: true, maxLength: 80 },
  videoUrl: { type: String, required: true },
  description: { type: String, required: true, trimL: true, minLength: 20 },
  createdAt: { type: Date, default: Date.now },
  hashtags: {
    type: [String],
    // set: (hashtags) =>
    //   hashtags
    //     .split(",")
    //     .map((word) =>
    //       word.startsWith("#") ? word.trim() : `#${word.trim()}`
    //     ),
    trim: true,
  },
  meta: {
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

// videoSchema.pre("save", async function () {
//   this.hashtags = this.hashtags[0]
//     .split(",")
//     .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
// });

videoSchema.static("splitHashes", function (hashtags) {
  return hashtags
    .split(",")
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
});

export const Video = mongoose.model("Video", videoSchema);
