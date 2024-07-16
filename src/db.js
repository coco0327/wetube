import mongoose from "mongoose";

mongoose.connect(
  "mongodb+srv://cocochanil5711:qkrcksdlf1@wetube.v23h9ad.mongodb.net/wetube?retryWrites=true&w=majority&appName=wetube"
);

const db = mongoose.connection;

db.on("error", (error) => console.log("DB Error", error));
db.once("open", () => console.log("✅ Connected to DB"));
